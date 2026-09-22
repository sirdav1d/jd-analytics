import { prisma } from '@/lib/prisma';
import { createOpaqueToken } from '@/mcp/oauth/crypto';
import { fetchCimdMetadata } from '@/mcp/oauth/cimd';
import { assertOAuthAdmission, OAuthError, oauthScope } from '@/mcp/oauth/protocol';

export type OAuthClient = {
	clientId: string;
	clientName: string;
	redirectUris: string[];
	grantTypes: Array<'authorization_code' | 'refresh_token'>;
	registrationSource: 'dcr' | 'cimd';
	clientOrigin?: string;
};

const clientCache = new Map<string, { client: OAuthClient; expiresAt: number }>();

function metadataObject(input: unknown) {
	if (!input || typeof input !== 'object' || Array.isArray(input)) throw new OAuthError('invalid_client_metadata', 400, 'Metadados de cliente inválidos.');

	return input as Record<string, unknown>;
}

function isLoopback(hostname: string) {
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}

function validateRedirectUri(value: unknown) {
	if (typeof value !== 'string' || value.length === 0 || value.length > 2_048 || /[\u0000-\u001F\\]/u.test(value)) throw new OAuthError('invalid_client_metadata', 400, 'Callback inválido.');

	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new OAuthError('invalid_client_metadata', 400, 'Callback inválido.');
	}
	if (url.username || url.password || url.hash) throw new OAuthError('invalid_client_metadata', 400, 'Callback inválido.');
	if (url.protocol === 'https:') return value;
	if (url.protocol === 'http:' && isLoopback(url.hostname)) return value;

	throw new OAuthError('invalid_client_metadata', 400, 'Callback inválido.');
}

function normalizedGrantTypes(value: unknown) {
	const grants = value === undefined ? ['authorization_code'] : value;
	if (!Array.isArray(grants) || grants.some((grant) => typeof grant !== 'string')) throw new OAuthError('invalid_client_metadata', 400, 'Grants inválidos.');
	const unique = [...new Set(grants)];
	if (!unique.includes('authorization_code') || unique.some((grant) => !['authorization_code', 'refresh_token'].includes(grant))) throw new OAuthError('invalid_client_metadata', 400, 'Grants inválidos.');

	return unique as Array<'authorization_code' | 'refresh_token'>;
}

function normalizedResponseTypes(value: unknown) {
	const responseTypes = value === undefined ? ['code'] : value;
	if (!Array.isArray(responseTypes) || responseTypes.length !== 1 || responseTypes[0] !== 'code') throw new OAuthError('invalid_client_metadata', 400, 'Response type inválido.');

	return ['code'] as const;
}

function normalizeClient(clientId: string, input: unknown, requireClientId = false): OAuthClient {
	const metadata = metadataObject(input);
	if ((requireClientId && metadata.client_id !== clientId) || (!requireClientId && metadata.client_id !== undefined && metadata.client_id !== clientId)) throw new OAuthError('invalid_client_metadata', 400, 'Client ID divergente.');
	if (typeof metadata.client_name !== 'string' || metadata.client_name.trim().length === 0 || metadata.client_name.length > 120) throw new OAuthError('invalid_client_metadata', 400, 'Nome de cliente inválido.');
	if (!Array.isArray(metadata.redirect_uris) || metadata.redirect_uris.length < 1 || metadata.redirect_uris.length > 10) throw new OAuthError('invalid_client_metadata', 400, 'Callbacks inválidos.');
	const redirectUris = metadata.redirect_uris.map(validateRedirectUri);
	const grantTypes = normalizedGrantTypes(metadata.grant_types);
	normalizedResponseTypes(metadata.response_types);
	if (metadata.token_endpoint_auth_method !== 'none') throw new OAuthError('invalid_client_metadata', 400, 'Cliente público exige autenticação none.');
	if (metadata.scope !== undefined && metadata.scope !== oauthScope()) throw new OAuthError('invalid_scope', 400, 'Escopo inválido.');

	const registrationSource = clientId.startsWith('https://') ? 'cimd' : 'dcr';
	const clientOrigin = registrationSource === 'cimd' ? new URL(clientId).origin : undefined;

	return { clientId, clientName: metadata.client_name, redirectUris, grantTypes, registrationSource, clientOrigin };
}

function cacheClient(client: OAuthClient, ttlSeconds: number) {
	if (clientCache.size >= 128) {
		const oldest = clientCache.keys().next().value;
		clientCache.delete(oldest ?? '');
	}
	if (ttlSeconds > 0) clientCache.set(client.clientId, { client, expiresAt: Date.now() + Math.min(ttlSeconds, 3_600) * 1_000 });
}

function responseForClient(client: OAuthClient, issuedAt: number) {
	return {
		client_id: client.clientId,
		client_name: client.clientName,
		redirect_uris: client.redirectUris,
		grant_types: client.grantTypes,
		response_types: ['code'],
		token_endpoint_auth_method: 'none',
		scope: oauthScope(),
		client_id_issued_at: issuedAt,
	};
}

export async function registerPublicClient(input: unknown): Promise<Record<string, unknown>> {
	assertOAuthAdmission('register');
	const clientId = `mcp_${createOpaqueToken()}`;
	const client = normalizeClient(clientId, input);
	const created = await prisma.mcpOAuthClient.create({
		data: {
			clientId: client.clientId,
			clientName: client.clientName,
			redirectUris: client.redirectUris,
			grantTypes: client.grantTypes,
		},
	});
	const issuedAt = Math.floor(created.createdAt.getTime() / 1_000);
	cacheClient(client, 3_600);

	return responseForClient(client, issuedAt);
}

function fromStoredClient(client: { clientId: string; clientName: string; redirectUris: string[]; grantTypes: string[] }) {
	return {
		clientId: client.clientId,
		clientName: client.clientName,
		redirectUris: client.redirectUris,
		grantTypes: client.grantTypes.filter((grant): grant is 'authorization_code' | 'refresh_token' => grant === 'authorization_code' || grant === 'refresh_token'),
		registrationSource: 'dcr' as const,
	};
}

export async function resolveOAuthClient(clientId: string): Promise<OAuthClient> {
	const cached = clientCache.get(clientId);
	if (cached && cached.expiresAt > Date.now()) return cached.client;
	if (cached) clientCache.delete(clientId);

	const stored = await prisma.mcpOAuthClient.findUnique({ where: { clientId } });
	if (stored) {
		const client = fromStoredClient(stored);
		cacheClient(client, 3_600);
		return client;
	}
	if (!clientId.startsWith('https://')) throw new OAuthError('invalid_client', 400, 'Cliente não registrado.');

	const fetched = await fetchCimdMetadata(clientId);
	const client = normalizeClient(clientId, fetched.metadata, true);
	cacheClient(client, fetched.cacheTtlSeconds);

	return client;
}

function loopbackWithoutPort(value: string) {
	return value.replace(/^(http:\/\/(?:localhost|127\.0\.0\.1|\[::1\]))(?::\d+)?/u, '$1');
}

export function matchesRegisteredRedirectUri(registered: string, requested: string) {
	if (registered === requested) {
		try {
			const url = new URL(registered);
			return url.protocol === 'https:' || (url.protocol === 'http:' && isLoopback(url.hostname));
		} catch {
			return false;
		}
	}

	try {
		const registeredUrl = new URL(registered);
		const requestedUrl = new URL(requested);
		if (registeredUrl.protocol !== 'http:' || requestedUrl.protocol !== 'http:') return false;
		if (!isLoopback(registeredUrl.hostname) || registeredUrl.hostname !== requestedUrl.hostname) return false;
		return loopbackWithoutPort(registered) === loopbackWithoutPort(requested);
	} catch {
		return false;
	}
}
