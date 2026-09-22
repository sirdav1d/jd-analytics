import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { getMcpPublicUrl, McpConfigurationError } from '@/mcp/core/transport-security';

export type AccessTokenInput = {
	userId: string;
	clientId: string;
	resource: string;
	scope: string;
};

export type AccessTokenClaims = AccessTokenInput & { expiresAt: number };

export class OAuthConfigurationError extends Error {
	constructor(message = 'Configuração OAuth inválida.') {
		super(message);
		this.name = 'OAuthConfigurationError';
	}
}

export function isOAuthConfigurationError(error: unknown): error is OAuthConfigurationError | McpConfigurationError {
	return error instanceof OAuthConfigurationError || error instanceof McpConfigurationError;
}

function base64Url(value: Uint8Array) {
	return Buffer.from(value).toString('base64url');
}

function oauthSecret() {
	const secret = process.env.MCP_OAUTH_SIGNING_SECRET;
	const sessionSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
	if (!secret || Buffer.byteLength(secret) < 32 || (sessionSecret && secret === sessionSecret)) {
		throw new OAuthConfigurationError('MCP_OAUTH_SIGNING_SECRET inválido.');
	}

	return new TextEncoder().encode(secret);
}

function expectedIssuer() {
	return getMcpPublicUrl(false).origin;
}

export function createOpaqueToken() {
	return base64Url(randomBytes(32));
}

export function hashOpaqueToken(kind: 'code' | 'refresh', value: string) {
	return createHash('sha256').update(`jd-mcp/${kind}/v1\0${value}`).digest('hex');
}

function assertVerifier(verifier: string) {
	if (!/^[A-Za-z0-9\-._~]{43,128}$/u.test(verifier)) throw new Error('PKCE verifier inválido.');
}

export function createPkceChallenge(verifier: string) {
	assertVerifier(verifier);
	return base64Url(createHash('sha256').update(verifier).digest());
}

export function matchesPkceChallenge(verifier: string, challenge: string) {
	try {
		assertVerifier(verifier);
		if (!/^[A-Za-z0-9_-]{43}$/u.test(challenge)) return false;
		const expected = Buffer.from(createPkceChallenge(verifier));
		const actual = Buffer.from(challenge);
		return expected.length === actual.length && timingSafeEqual(expected, actual);
	} catch {
		return false;
	}
}

export async function signMcpAccessToken(input: AccessTokenInput) {
	const now = Math.floor(Date.now() / 1_000);
	const expiresAt = now + 300;
	const issuer = expectedIssuer();

	return new SignJWT({
		client_id: input.clientId,
		resource: input.resource,
		scope: input.scope,
	})
		.setProtectedHeader({ alg: 'HS256', typ: 'at+jwt' })
		.setIssuer(issuer)
		.setAudience(input.resource)
		.setSubject(input.userId)
		.setIssuedAt(now)
		.setExpirationTime(expiresAt)
		.setJti(createOpaqueToken())
		.sign(oauthSecret());
}

export async function verifyMcpAccessToken(token: string): Promise<AccessTokenClaims> {
	const issuer = expectedIssuer();
	const resource = `${issuer}/api/mcp`;
	const verified = await jwtVerify(token, oauthSecret(), {
		algorithms: ['HS256'],
		issuer,
		audience: resource,
	});
	if (verified.protectedHeader.typ !== 'at+jwt') throw new Error('Tipo de token inválido.');

	const payload = verified.payload;
	const userId = payload.sub;
	const clientId = payload.client_id;
	const tokenResource = payload.resource;
	const scope = payload.scope;
	if (
		typeof userId !== 'string' ||
		typeof clientId !== 'string' ||
		typeof tokenResource !== 'string' ||
		typeof scope !== 'string' ||
		typeof payload.exp !== 'number' ||
		typeof payload.iat !== 'number' ||
		typeof payload.jti !== 'string' ||
		tokenResource !== resource ||
		payload.exp <= payload.iat ||
		payload.exp - payload.iat > 300
	) throw new Error('Claims de token inválidos.');

	return { userId, clientId, resource: tokenResource, scope, expiresAt: payload.exp };
}
