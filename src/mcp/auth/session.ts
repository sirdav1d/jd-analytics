import type { AuthInfo } from '@modelcontextprotocol/server';
import { readCurrentUserById, type CurrentUser } from '@/lib/auth';
import { assertActiveUser, AuthorizationError } from '@/lib/authorization';
import { isOAuthConfigurationError, verifyMcpAccessToken, type AccessTokenClaims } from '@/mcp/oauth/crypto';
import { oauthScope } from '@/mcp/oauth/protocol';

export function createMcpAuthInfo(input: { token: string; claims: AccessTokenClaims; user: CurrentUser }): AuthInfo {
	return {
		token: input.token,
		clientId: input.claims.clientId,
		scopes: input.claims.scope.split(' ').filter(Boolean),
		expiresAt: input.claims.expiresAt,
		resource: new URL(input.claims.resource),
		extra: { user: input.user, claims: input.claims },
	};
}

export function readMcpUser(authInfo: AuthInfo): CurrentUser {
	const user = authInfo.extra?.user;
	if (!user || typeof user !== 'object') throw new AuthorizationError(401, 'Sessão MCP inválida');

	const candidate = user as Partial<CurrentUser>;
	if (
		typeof candidate.id !== 'string' ||
		!['ADMIN', 'MANAGER', 'SELLER'].includes(candidate.role as string) ||
		typeof candidate.isActive !== 'boolean'
	) throw new AuthorizationError(401, 'Sessão MCP inválida');

	return user as CurrentUser;
}

function readBearer(request: Request) {
	const value = request.headers.get('authorization');
	if (!value) throw new AuthorizationError(401, 'Bearer MCP ausente');
	const match = value.match(/^Bearer\s+([^\s]+)$/iu);
	if (!match) throw new AuthorizationError(401, 'Bearer MCP inválido');

	return match[1];
}

export async function authenticateMcpRequest(request: Request): Promise<{ user: CurrentUser; authInfo: AuthInfo }> {
	const token = readBearer(request);
	let claims: AccessTokenClaims;
	try {
		claims = await verifyMcpAccessToken(token);
	} catch (error) {
		if (isOAuthConfigurationError(error)) throw error;
		throw new AuthorizationError(401, 'Bearer MCP inválido');
	}
	if (!claims.scope.split(' ').includes(oauthScope())) throw new AuthorizationError(403, 'Escopo MCP insuficiente');

	const user = await readCurrentUserById(claims.userId);
	if (!user) throw new AuthorizationError(401, 'Usuário MCP não encontrado');
	assertActiveUser(user);

	return { user, authInfo: createMcpAuthInfo({ token, claims, user }) };
}
