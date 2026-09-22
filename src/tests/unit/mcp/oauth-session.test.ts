import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorizationError } from '@/lib/authorization';
import { authenticateMcpRequest } from '@/mcp/auth/session';

const mocks = vi.hoisted(() => ({
	readCurrentUserById: vi.fn(),
	verifyMcpAccessToken: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ readCurrentUserById: mocks.readCurrentUserById }));
vi.mock('@/mcp/oauth/crypto', () => ({
	verifyMcpAccessToken: mocks.verifyMcpAccessToken,
	isOAuthConfigurationError: (error: unknown) => error instanceof Error && (error.name === 'OAuthConfigurationError' || error.name === 'McpConfigurationError'),
}));

const user = { id: 'user-1', name: 'Usuário', email: 'user@jd.test', externalId: '1', role: 'MANAGER' as const, isActive: true };
const claims = { userId: user.id, clientId: 'client-1', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', expiresAt: Math.floor(Date.now() / 1_000) + 300 };

describe('Bearer OAuth do MCP', () => {
	beforeEach(() => {
		mocks.readCurrentUserById.mockReset().mockResolvedValue(user);
		mocks.verifyMcpAccessToken.mockReset().mockResolvedValue(claims);
	});

	it('rejeita sessão NextAuth ou Bearer ausente', async () => {
		await expect(authenticateMcpRequest(new Request('https://jd.example.com/api/mcp'))).rejects.toMatchObject({ status: 401 });
		mocks.verifyMcpAccessToken.mockRejectedValueOnce(new Error('next-auth token'));
		await expect(authenticateMcpRequest(new Request('https://jd.example.com/api/mcp', { headers: { authorization: 'Bearer next-auth-session' } }))).rejects.toMatchObject({ status: 401 });
	});

	it('recarrega usuário e entrega AuthInfo com escopo', async () => {
		const result = await authenticateMcpRequest(new Request('https://jd.example.com/api/mcp', { headers: { authorization: 'Bearer oauth-token' } }));

		expect(mocks.verifyMcpAccessToken).toHaveBeenCalledWith('oauth-token');
		expect(mocks.readCurrentUserById).toHaveBeenCalledWith(user.id);
		expect(result.user).toEqual(user);
		expect(result.authInfo).toMatchObject({ token: 'oauth-token', clientId: 'client-1', scopes: ['mcp:read'], expiresAt: claims.expiresAt });
	});

	it('separa escopo insuficiente de token inválido', async () => {
		mocks.verifyMcpAccessToken.mockResolvedValueOnce({ ...claims, scope: 'other' });
		await expect(authenticateMcpRequest(new Request('https://jd.example.com/api/mcp', { headers: { authorization: 'Bearer oauth-token' } }))).rejects.toMatchObject({ status: 403 });

		mocks.verifyMcpAccessToken.mockRejectedValueOnce(new Error('invalid'));
		await expect(authenticateMcpRequest(new Request('https://jd.example.com/api/mcp', { headers: { authorization: 'Bearer oauth-token' } }))).rejects.toBeInstanceOf(AuthorizationError);
	});

	it('não converte falha de configuração em 401', async () => {
		const error = new Error('segredo ausente');
		error.name = 'OAuthConfigurationError';
		mocks.verifyMcpAccessToken.mockRejectedValueOnce(error);

		await expect(authenticateMcpRequest(new Request('https://jd.example.com/api/mcp', { headers: { authorization: 'Bearer oauth-token' } }))).rejects.toBe(error);
	});
});
