import { beforeEach, describe, expect, it, vi } from 'vitest';
import { exchangeToken, revokeRefreshToken } from '@/mcp/oauth/tokens';

const mocks = vi.hoisted(() => ({
	transaction: vi.fn(),
	verify: vi.fn(),
	sign: vi.fn(),
	resolve: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: { $transaction: mocks.transaction } }));
vi.mock('@/mcp/oauth/crypto', () => ({
	hashOpaqueToken: (kind: string, value: string) => `${kind}:${value}`,
	createOpaqueToken: () => 'opaque-token',
	matchesPkceChallenge: (verifier: string, challenge: string) => verifier === 'verifier' && challenge === 'challenge',
	signMcpAccessToken: mocks.sign,
}));
vi.mock('@/mcp/oauth/clients', () => ({ resolveOAuthClient: mocks.resolve }));

const client = { clientId: 'client-1', clientName: 'Cliente', redirectUris: ['http://127.0.0.1/callback'], grantTypes: ['authorization_code', 'refresh_token'] };

describe('tokens OAuth do MCP', () => {
	beforeEach(() => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');
		mocks.transaction.mockReset();
		mocks.sign.mockReset().mockResolvedValue('access-token');
		mocks.resolve.mockReset().mockResolvedValue(client);
	});

	it('troca código sem resource uma única vez e cria refresh na mesma transação', async () => {
		const tx = {
			user: { findUnique: vi.fn().mockResolvedValue({ id: 'user-1', role: 'MANAGER', isActive: true }) },
			mcpAuthorizationCode: {
				findUnique: vi.fn().mockResolvedValue({ codeHash: 'code:code-1', userId: 'user-1', clientId: 'client-1', redirectUri: 'http://127.0.0.1/callback', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', codeChallenge: 'challenge', allowRefresh: true, expiresAt: new Date(Date.now() + 60_000), consumedAt: null }),
			updateMany: vi.fn().mockResolvedValue({ count: 1 }),
			},
			mcpRefreshToken: { create: vi.fn().mockResolvedValue({}) },
		};
		mocks.transaction.mockImplementation(async (run) => run(tx));

		const result = await exchangeToken(new URLSearchParams({ grant_type: 'authorization_code', client_id: 'client-1', code: 'code-1', redirect_uri: 'http://127.0.0.1/callback', code_verifier: 'verifier' }));

		expect(result).toMatchObject({ access_token: 'access-token', token_type: 'Bearer', refresh_token: 'opaque-token', scope: 'mcp:read' });
		expect(tx.mcpAuthorizationCode.updateMany).toHaveBeenCalled();
		expect(tx.mcpRefreshToken.create).toHaveBeenCalled();
	});

	it('não consome código com PKCE ou callback incompatível', async () => {
		const updateMany = vi.fn();
		const tx = { mcpAuthorizationCode: { findUnique: vi.fn().mockResolvedValue({ codeHash: 'code:code-1', userId: 'user-1', clientId: 'client-1', redirectUri: 'http://127.0.0.1/callback', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', codeChallenge: 'challenge', allowRefresh: false, expiresAt: new Date(Date.now() + 60_000), consumedAt: null }), updateMany }, mcpRefreshToken: { create: vi.fn() } };
		mocks.transaction.mockImplementation(async (run) => run(tx));

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'authorization_code', client_id: 'client-1', code: 'code-1', redirect_uri: 'https://other.example/callback', resource: 'https://jd.example.com/api/mcp', code_verifier: 'wrong' }))).rejects.toMatchObject({ code: 'invalid_grant' });
		expect(updateMany).not.toHaveBeenCalled();
	});

	it('revoga a família quando um código já consumido é reapresentado', async () => {
		const updateMany = vi.fn().mockResolvedValue({ count: 1 });
		let transactionCompleted = false;
		const tx = {
			mcpAuthorizationCode: {
				findUnique: vi.fn().mockResolvedValue({
					codeHash: 'code:code-1', userId: 'user-1', clientId: 'client-1', redirectUri: 'http://127.0.0.1/callback', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', codeChallenge: 'challenge', allowRefresh: true, expiresAt: new Date(Date.now() + 60_000), consumedAt: new Date(),
				}),
			},
			mcpRefreshToken: { updateMany },
		};
		mocks.transaction.mockImplementation(async (run) => {
			const result = await run(tx);
			transactionCompleted = true;
			return result;
		});

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'authorization_code', client_id: 'client-1', code: 'code-1', redirect_uri: 'http://127.0.0.1/callback', resource: 'https://jd.example.com/api/mcp', code_verifier: 'verifier' }))).rejects.toMatchObject({ code: 'invalid_grant' });
		expect(updateMany).toHaveBeenCalledWith({ where: { familyId: 'code:code-1', revokedAt: null }, data: { revokedAt: expect.any(Date) } });
		expect(transactionCompleted).toBe(true);
	});

	it('revoga a família quando um refresh token reaparece', async () => {
		const updateMany = vi.fn().mockResolvedValue({ count: 1 });
		let transactionCompleted = false;
		const tx = {
			mcpRefreshToken: {
				findUnique: vi.fn().mockResolvedValue({
					tokenHash: 'refresh:refresh-1', familyId: 'family-1', userId: 'user-1', clientId: 'client-1', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', expiresAt: new Date(Date.now() + 60_000), consumedAt: new Date(), revokedAt: null,
				}),
				updateMany,
			},
		};
		mocks.transaction.mockImplementation(async (run) => {
			const result = await run(tx);
			transactionCompleted = true;
			return result;
		});

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'refresh_token', client_id: 'client-1', refresh_token: 'refresh-1', resource: 'https://jd.example.com/api/mcp' }))).rejects.toMatchObject({ code: 'invalid_grant' });
		expect(updateMany).toHaveBeenCalledWith({ where: { familyId: 'family-1', revokedAt: null }, data: { revokedAt: expect.any(Date) } });
		expect(transactionCompleted).toBe(true);
	});

	it('repete transação serializável quando o banco retorna P2034', async () => {
		const tx = {
			user: { findUnique: vi.fn().mockResolvedValue({ id: 'user-1', role: 'MANAGER', isActive: true }) },
			mcpAuthorizationCode: {
				findUnique: vi.fn().mockResolvedValue({ codeHash: 'code:code-1', userId: 'user-1', clientId: 'client-1', redirectUri: 'http://127.0.0.1/callback', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', codeChallenge: 'challenge', allowRefresh: false, expiresAt: new Date(Date.now() + 60_000), consumedAt: null,
				}),
				updateMany: vi.fn().mockResolvedValue({ count: 1 }),
			},
			mcpRefreshToken: { create: vi.fn() },
		};
		mocks.transaction
			.mockRejectedValueOnce({ code: 'P2034' })
			.mockImplementationOnce(async (run) => run(tx));

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'authorization_code', client_id: 'client-1', code: 'code-1', redirect_uri: 'http://127.0.0.1/callback', resource: 'https://jd.example.com/api/mcp', code_verifier: 'verifier' }))).resolves.toMatchObject({ access_token: 'access-token' });
		expect(mocks.transaction).toHaveBeenCalledTimes(2);
	});

	it('propaga P2034 após esgotar as três tentativas', async () => {
		mocks.transaction
			.mockRejectedValueOnce({ code: 'P2034' })
			.mockRejectedValueOnce({ code: 'P2034' })
			.mockRejectedValueOnce({ code: 'P2034' });

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'authorization_code', client_id: 'client-1', code: 'code-1', redirect_uri: 'http://127.0.0.1/callback', resource: 'https://jd.example.com/api/mcp', code_verifier: 'verifier' }))).rejects.toMatchObject({ code: 'P2034' });
		expect(mocks.transaction).toHaveBeenCalledTimes(3);
	});

	it('revoga e rejeita refresh expirado sem criar sucessor', async () => {
		const updateMany = vi.fn().mockResolvedValue({ count: 1 });
		const create = vi.fn();
		const tx = {
			mcpRefreshToken: {
				findUnique: vi.fn().mockResolvedValue({ tokenHash: 'refresh:refresh-1', familyId: 'family-1', userId: 'user-1', clientId: 'client-1', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', expiresAt: new Date(Date.now() - 1), consumedAt: null, revokedAt: null }),
				updateMany,
				create,
			},
		};
		mocks.transaction.mockImplementation(async (run) => run(tx));

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'refresh_token', client_id: 'client-1', refresh_token: 'refresh-1', resource: 'https://jd.example.com/api/mcp' }))).rejects.toMatchObject({ code: 'invalid_grant' });
		expect(create).not.toHaveBeenCalled();
		expect(updateMany).toHaveBeenCalledWith({ where: { familyId: 'family-1', revokedAt: null }, data: { revokedAt: expect.any(Date) } });
	});

	it('renova sem resource e mantém a expiração absoluta durante a rotação', async () => {
		const expiresAt = new Date(Date.now() + 86_400_000);
		const create = vi.fn().mockResolvedValue({});
		const tx = {
			user: { findUnique: vi.fn().mockResolvedValue({ id: 'user-1', role: 'MANAGER', isActive: true }) },
			mcpRefreshToken: {
				findUnique: vi.fn().mockResolvedValue({ tokenHash: 'refresh:refresh-1', familyId: 'family-1', userId: 'user-1', clientId: 'client-1', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', expiresAt, consumedAt: null, revokedAt: null }),
				findFirst: vi.fn().mockResolvedValue(null),
				updateMany: vi.fn().mockResolvedValue({ count: 1 }),
				create,
			},
		};
		mocks.transaction.mockImplementation(async (run) => run(tx));

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'refresh_token', client_id: 'client-1', refresh_token: 'refresh-1' }))).resolves.toMatchObject({ access_token: 'access-token', refresh_token: 'opaque-token' });
		expect(create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ expiresAt }) }));
	});

	it('não retorna tokens quando a criação do sucessor falha', async () => {
		const create = vi.fn().mockRejectedValue(new Error('falha de persistência'));
		const tx = {
			user: { findUnique: vi.fn().mockResolvedValue({ id: 'user-1', role: 'MANAGER', isActive: true }) },
			mcpRefreshToken: {
				findUnique: vi.fn().mockResolvedValue({ tokenHash: 'refresh:refresh-1', familyId: 'family-1', userId: 'user-1', clientId: 'client-1', resource: 'https://jd.example.com/api/mcp', scope: 'mcp:read', expiresAt: new Date(Date.now() + 60_000), consumedAt: null, revokedAt: null }),
				findFirst: vi.fn().mockResolvedValue(null),
				updateMany: vi.fn().mockResolvedValue({ count: 1 }),
				create,
			},
		};
		mocks.transaction.mockImplementation(async (run) => run(tx));

		await expect(exchangeToken(new URLSearchParams({ grant_type: 'refresh_token', client_id: 'client-1', refresh_token: 'refresh-1', resource: 'https://jd.example.com/api/mcp' }))).rejects.toThrow('falha de persistência');
	});

	it('revoga token desconhecido de forma idempotente', async () => {
		const updateMany = vi.fn();
		const tx = { mcpRefreshToken: { findUnique: vi.fn().mockResolvedValue(null), updateMany } };
		mocks.transaction.mockImplementation(async (run) => run(tx));

		await expect(revokeRefreshToken(new URLSearchParams({ token: 'unknown', client_id: 'client-1' }))).resolves.toBeUndefined();
		expect(updateMany).not.toHaveBeenCalled();
	});
});
