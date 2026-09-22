import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { assertActiveUser } from '@/lib/authorization';
import { createOpaqueToken, hashOpaqueToken, matchesPkceChallenge, signMcpAccessToken } from '@/mcp/oauth/crypto';
import { resolveOAuthClient } from '@/mcp/oauth/clients';
import { assertUniqueOAuthParams, OAuthError, oauthScope } from '@/mcp/oauth/protocol';
import { getMcpPublicUrl } from '@/mcp/core/transport-security';
import type { AuthorizationRequest } from '@/mcp/oauth/authorization';

const CODE_TTL_MS = 5 * 60 * 1_000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1_000;
const ACCESS_TTL_SECONDS = 300;

export type TokenResponse = {
	access_token: string;
	token_type: 'Bearer';
	expires_in: number;
	scope: string;
	refresh_token?: string;
};

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

function isRetryableTransactionError(error: unknown) {
	if (error instanceof Prisma.PrismaClientKnownRequestError) return error.code === 'P2034';
	return Boolean(error && typeof error === 'object' && (error as { code?: unknown }).code === 'P2034');
}

async function serializable<T>(run: (tx: TransactionClient) => Promise<T>): Promise<T> {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		try {
			return await prisma.$transaction(run, {
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
				maxWait: 2_000,
				timeout: 5_000,
			});
		} catch (error) {
			if (!isRetryableTransactionError(error) || attempt === 2) throw error;
		}
	}

	throw new Error('Falha transacional.');
}

function required(form: URLSearchParams, name: string, maxLength = 2_048) {
	const value = form.get(name);
	if (!value || value.length > maxLength) throw new OAuthError('invalid_request', 400, `Parâmetro ${name} inválido.`);

	return value;
}

function canonicalResource() {
	return `${getMcpPublicUrl(false).origin}/api/mcp`;
}

function assertCanonicalResource(resource: string) {
	if (resource !== canonicalResource()) throw new OAuthError('invalid_target', 400, 'Recurso não suportado.');
}

function canonicalResourceParameter(form: URLSearchParams) {
	const resource = form.get('resource') ?? canonicalResource();
	if (!resource || resource.length > 2_048) throw new OAuthError('invalid_request', 400, 'Parâmetro resource inválido.');
	assertCanonicalResource(resource);

	return resource;
}

function assertUserIsActive(user: { isActive: boolean } | null) {
	if (!user) throw new OAuthError('invalid_grant', 400, 'Grant inválido.');
	try {
		assertActiveUser(user as { id: string; role: 'ADMIN' | 'MANAGER' | 'SELLER'; isActive: boolean });
	} catch {
		throw new OAuthError('invalid_grant', 400, 'Grant inválido.');
	}
}

function assertCodeBindings(code: { clientId: string; redirectUri: string; resource: string; codeChallenge: string }, clientId: string, redirectUri: string, resource: string, verifier: string) {
	if (code.clientId !== clientId || code.redirectUri !== redirectUri || code.resource !== resource || !matchesPkceChallenge(verifier, code.codeChallenge)) throw new OAuthError('invalid_grant', 400, 'Grant inválido.');
}

function accessTokenResponse(accessToken: string, scope: string, refreshToken?: string): TokenResponse {
	return {
		access_token: accessToken,
		token_type: 'Bearer',
		expires_in: ACCESS_TTL_SECONDS,
		scope,
		...(refreshToken ? { refresh_token: refreshToken } : {}),
	};
}

export async function issueAuthorizationCode(authorization: AuthorizationRequest, userId: string) {
	const code = createOpaqueToken();
	await prisma.mcpAuthorizationCode.create({
		data: {
			codeHash: hashOpaqueToken('code', code),
			userId,
			clientId: authorization.client.clientId,
			redirectUri: authorization.redirectUri,
			resource: authorization.resource,
			scope: authorization.scope,
			codeChallenge: authorization.codeChallenge,
			allowRefresh: authorization.client.grantTypes.includes('refresh_token'),
			expiresAt: new Date(Date.now() + CODE_TTL_MS),
		},
	});

	return code;
}

async function exchangeAuthorizationCode(form: URLSearchParams): Promise<TokenResponse> {
	const clientId = required(form, 'client_id');
	const codeValue = required(form, 'code');
	const redirectUri = required(form, 'redirect_uri');
	const resource = canonicalResourceParameter(form);
	const verifier = required(form, 'code_verifier', 128);
	const client = await resolveOAuthClient(clientId);
	if (!client.grantTypes.includes('authorization_code')) throw new OAuthError('unauthorized_client', 400, 'Cliente não autorizado.');
	const codeHash = hashOpaqueToken('code', codeValue);
	const now = new Date();

	const result = await serializable(async (tx) => {
		const code = await tx.mcpAuthorizationCode.findUnique({ where: { codeHash } });
		if (!code) throw new OAuthError('invalid_grant', 400, 'Grant inválido.');
		assertCodeBindings(code, clientId, redirectUri, resource, verifier);
		if (code.consumedAt) {
			await tx.mcpRefreshToken.updateMany({ where: { familyId: codeHash, revokedAt: null }, data: { revokedAt: now } });
			return { kind: 'replay' as const };
		}
		if (code.expiresAt <= now) throw new OAuthError('invalid_grant', 400, 'Grant expirado.');
		const user = await tx.user.findUnique({ where: { id: code.userId }, select: { id: true, role: true, isActive: true } });
		assertUserIsActive(user);
		const consumed = await tx.mcpAuthorizationCode.updateMany({ where: { codeHash, consumedAt: null, expiresAt: { gt: now } }, data: { consumedAt: now } });
		if (consumed.count !== 1) throw new OAuthError('invalid_grant', 400, 'Grant inválido.');

		const refreshToken = code.allowRefresh && client.grantTypes.includes('refresh_token') ? createOpaqueToken() : undefined;
		if (refreshToken) {
			await tx.mcpRefreshToken.create({
				data: {
					tokenHash: hashOpaqueToken('refresh', refreshToken),
					familyId: codeHash,
					userId: code.userId,
					clientId: code.clientId,
					resource: code.resource,
					scope: code.scope,
					expiresAt: new Date(now.getTime() + REFRESH_TTL_MS),
				},
			});
		}
		const accessToken = await signMcpAccessToken({ userId: code.userId, clientId: code.clientId, resource: code.resource, scope: code.scope });

		return { kind: 'success' as const, response: accessTokenResponse(accessToken, code.scope, refreshToken) };
	});

	if (result.kind === 'replay') throw new OAuthError('invalid_grant', 400, 'Grant reutilizado.');

	return result.response;
}

async function exchangeRefreshToken(form: URLSearchParams): Promise<TokenResponse> {
	const clientId = required(form, 'client_id');
	const tokenValue = required(form, 'refresh_token');
	const resource = canonicalResourceParameter(form);
	const client = await resolveOAuthClient(clientId);
	if (!client.grantTypes.includes('refresh_token')) throw new OAuthError('unauthorized_client', 400, 'Cliente não autorizado.');
	const tokenHash = hashOpaqueToken('refresh', tokenValue);
	const now = new Date();

	const result = await serializable(async (tx) => {
		const token = await tx.mcpRefreshToken.findUnique({ where: { tokenHash } });
		if (!token) throw new OAuthError('invalid_grant', 400, 'Grant inválido.');
		if (token.clientId !== clientId || token.resource !== resource || token.scope !== oauthScope()) throw new OAuthError('invalid_grant', 400, 'Grant inválido.');
		if (token.consumedAt || token.revokedAt || token.expiresAt <= now) {
			await tx.mcpRefreshToken.updateMany({ where: { familyId: token.familyId, revokedAt: null }, data: { revokedAt: now } });
			return { kind: 'replay' as const };
		}
		const familyRevoked = await tx.mcpRefreshToken.findFirst({ where: { familyId: token.familyId, revokedAt: { not: null } }, select: { tokenHash: true } });
		if (familyRevoked) return { kind: 'replay' as const };
		const user = await tx.user.findUnique({ where: { id: token.userId }, select: { id: true, role: true, isActive: true } });
		assertUserIsActive(user);
		const consumed = await tx.mcpRefreshToken.updateMany({ where: { tokenHash, consumedAt: null, revokedAt: null, expiresAt: { gt: now } }, data: { consumedAt: now } });
		if (consumed.count !== 1) return { kind: 'replay' as const };
		const successor = createOpaqueToken();
		await tx.mcpRefreshToken.create({ data: { tokenHash: hashOpaqueToken('refresh', successor), familyId: token.familyId, userId: token.userId, clientId: token.clientId, resource: token.resource, scope: token.scope, expiresAt: token.expiresAt } });
		const accessToken = await signMcpAccessToken({ userId: token.userId, clientId: token.clientId, resource: token.resource, scope: token.scope });

		return { kind: 'success' as const, response: accessTokenResponse(accessToken, token.scope, successor) };
	});

	if (result.kind === 'replay') throw new OAuthError('invalid_grant', 400, 'Grant reutilizado.');

	return result.response;
}

export async function exchangeToken(form: URLSearchParams): Promise<TokenResponse> {
	assertUniqueOAuthParams(form, ['grant_type', 'client_id', 'code', 'redirect_uri', 'resource', 'code_verifier', 'refresh_token']);
	const grantType = form.get('grant_type');
	if (grantType === 'authorization_code') return exchangeAuthorizationCode(form);
	if (grantType === 'refresh_token') return exchangeRefreshToken(form);
	throw new OAuthError('unsupported_grant_type', 400, 'Grant type não suportado.');
}

export async function revokeRefreshToken(form: URLSearchParams): Promise<void> {
	assertUniqueOAuthParams(form, ['token', 'client_id', 'token_type_hint']);
	const token = required(form, 'token');
	const clientId = required(form, 'client_id');
	if (form.get('token_type_hint') === 'access_token') throw new OAuthError('unsupported_token_type', 400, 'Tipo de token não suportado.');
	const tokenHash = hashOpaqueToken('refresh', token);

	await serializable(async (tx) => {
		const record = await tx.mcpRefreshToken.findUnique({ where: { tokenHash } });
		if (!record || record.clientId !== clientId) return;
		await tx.mcpRefreshToken.updateMany({ where: { familyId: record.familyId, clientId, revokedAt: null }, data: { revokedAt: new Date() } });
	});
}
