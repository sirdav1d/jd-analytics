import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { assertActiveUser } from '@/lib/authorization';
import { matchesRegisteredRedirectUri, resolveOAuthClient, type OAuthClient } from '@/mcp/oauth/clients';
import { getMcpPublicUrl } from '@/mcp/core/transport-security';
import { OAuthError, assertUniqueOAuthParams, oauthScope } from '@/mcp/oauth/protocol';
import { issueAuthorizationCode } from '@/mcp/oauth/tokens';

export type AuthorizationRequest = {
	client: OAuthClient;
	redirectUri: string;
	resource: string;
	scope: 'mcp:read';
	state?: string;
	codeChallenge: string;
};

export type ConsentSnapshot = {
	authorization: AuthorizationRequest;
	userId: string;
	expiresAt: number;
};

export function createConsentSnapshot(authorization: AuthorizationRequest, userId: string): ConsentSnapshot {
	return { authorization, userId, expiresAt: Date.now() + 300_000 };
}

const recognizedParameters = [
	'client_id', 'response_type', 'redirect_uri', 'scope', 'state', 'resource', 'code_challenge', 'code_challenge_method',
] as const;

function requiredParameter(params: URLSearchParams, name: string, maxLength: number) {
	const value = params.get(name);
	if (!value || value.length > maxLength) throw new OAuthError('invalid_request', 400, `Parâmetro ${name} inválido.`);

	return value;
}

function assertSafeState(state: string | null) {
	if (state === null) return undefined;
	if (state.length > 1_024 || /[\u0000-\u001F\u007F]/u.test(state)) throw new OAuthError('invalid_request', 400, 'State inválido.');

	return state;
}

export async function parseAuthorizationRequest(params: URLSearchParams): Promise<AuthorizationRequest> {
	if (params.toString().length > 8 * 1_024) throw new OAuthError('invalid_request', 400, 'Solicitação muito grande.');
	assertUniqueOAuthParams(params, recognizedParameters);

	const clientId = requiredParameter(params, 'client_id', 2_048);
	const redirectUri = requiredParameter(params, 'redirect_uri', 2_048);
	const responseType = requiredParameter(params, 'response_type', 32);
	if (responseType !== 'code') throw new OAuthError('unsupported_response_type', 400, 'Response type não suportado.');

	const client = await resolveOAuthClient(clientId);
	if (!client.redirectUris.some((registered) => matchesRegisteredRedirectUri(registered, redirectUri))) throw new OAuthError('invalid_redirect_uri', 400, 'Callback não registrado.');

	const expectedResource = `${getMcpPublicUrl(false).origin}/api/mcp`;
	const resource = params.get('resource') ?? expectedResource;
	if (!resource || resource.length > 2_048) throw new OAuthError('invalid_target', 400, 'Recurso não suportado.');
	if (resource !== expectedResource) throw new OAuthError('invalid_target', 400, 'Recurso não suportado.');

	const scope = params.get('scope') ?? oauthScope();
	if (scope !== oauthScope()) throw new OAuthError('invalid_scope', 400, 'Escopo não suportado.');
	const codeChallenge = requiredParameter(params, 'code_challenge', 128);
	if (!/^[A-Za-z0-9_-]{43}$/u.test(codeChallenge) || params.get('code_challenge_method') !== 'S256') throw new OAuthError('invalid_request', 400, 'PKCE S256 obrigatório.');

	return {
		client,
		redirectUri,
		resource,
		scope: 'mcp:read',
		state: assertSafeState(params.get('state')),
		codeChallenge,
	};
}

function matchesClientSnapshot(current: OAuthClient, expected: OAuthClient, redirectUri: string) {
	if (current.clientId !== expected.clientId || current.clientName !== expected.clientName) return false;

	return current.redirectUris.some((registered) => matchesRegisteredRedirectUri(registered, redirectUri));
}

function callbackDestination(authorization: AuthorizationRequest, values: Record<string, string>) {
	const destination = new URL(authorization.redirectUri);
	for (const [key, value] of Object.entries(values)) destination.searchParams.set(key, value);
	if (authorization.state !== undefined) destination.searchParams.set('state', authorization.state);
	destination.searchParams.set('iss', getMcpPublicUrl(false).origin);

	return destination.toString();
}

export async function completeAuthorization(snapshot: ConsentSnapshot, formData: FormData) {
	if (snapshot.expiresAt <= Date.now()) throw new OAuthError('access_denied', 400, 'A autorização expirou.');
	const decisions = formData.getAll('decision');
	if (decisions.length !== 1 || (decisions[0] !== 'approve' && decisions[0] !== 'deny')) throw new OAuthError('invalid_request', 400, 'Decisão inválida.');

	const requestHeaders = await headers();
	if (requestHeaders.get('origin') !== getMcpPublicUrl(false).origin) throw new OAuthError('access_denied', 400, 'Origem não autorizada.');

	const user = await getCurrentUser();
	assertActiveUser(user);
	if (user.id !== snapshot.userId) throw new OAuthError('access_denied', 400, 'Sessão alterada.');

	const currentClient = await resolveOAuthClient(snapshot.authorization.client.clientId);
	if (!matchesClientSnapshot(currentClient, snapshot.authorization.client, snapshot.authorization.redirectUri)) throw new OAuthError('access_denied', 400, 'Cliente alterado.');

	if (decisions[0] === 'deny') return callbackDestination(snapshot.authorization, { error: 'access_denied' });

	const code = await issueAuthorizationCode(snapshot.authorization, user.id);
	return callbackDestination(snapshot.authorization, { code });
}
