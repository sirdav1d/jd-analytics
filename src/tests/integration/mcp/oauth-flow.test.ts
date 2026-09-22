import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as getAuthorizationServerMetadata } from '@/app/.well-known/oauth-authorization-server/route';
import { POST as registerClient } from '@/app/api/mcp/oauth/register/route';
import { createPkceChallenge } from '@/mcp/oauth/crypto';
import { parseAuthorizationRequest } from '@/mcp/oauth/authorization';
import { issueAuthorizationCode, exchangeToken, revokeRefreshToken } from '@/mcp/oauth/tokens';
import { resolveOAuthClient } from '@/mcp/oauth/clients';
import { createJdMcpHandler } from '@/mcp/server';
import { invokeMcpTool } from './harness';

const mocks = vi.hoisted(() => ({
	prisma: {
		mcpOAuthClient: { create: vi.fn(), findUnique: vi.fn() },
		mcpAuthorizationCode: { create: vi.fn() },
		user: { findUnique: vi.fn() },
		$transaction: vi.fn(),
	},
	getCommercialBigNumbers: vi.fn(),
	fetchCimdMetadata: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: mocks.prisma }));
vi.mock('@/mcp/oauth/cimd', () => ({ fetchCimdMetadata: mocks.fetchCimdMetadata }));
vi.mock('@/services/data-services/shared-read-services', () => ({
	getCommercialBigNumbers: mocks.getCommercialBigNumbers,
	getCommercialRankings: vi.fn(),
	getCommercialSalesBy: vi.fn(),
	getCommercialOriginData: vi.fn(),
	getResultsByOrganization: vi.fn(),
}));
vi.mock('@/services/data-services/goals-shared-services', () => ({ getGoalsCurrent: vi.fn(), getGoalTracking: vi.fn(), getCommercialGoalTargets: vi.fn(), getMarketingGoals: vi.fn() }));
vi.mock('@/services/google-services/shared-operations', () => ({ getGoogleAdsData: vi.fn(), getGoogleAnalyticsData: vi.fn(), getGoogleTopAds: vi.fn(), getGoogleTopKeywords: vi.fn() }));
vi.mock('@/services/marketing-report/get-marketing-report-aggregate', () => ({ getAuthenticatedMarketingReport: vi.fn() }));

const user = { id: 'user-1', name: 'Usuário OAuth', email: 'oauth@jd.test', externalId: '1', role: 'MANAGER' as const, isActive: true };
const resource = `${process.env.NEXT_PUBLIC_API_URL}/api/mcp`;

describe('fluxo OAuth do MCP', () => {
	beforeEach(() => {
		vi.stubEnv('NEXTAUTH_URL', process.env.NEXT_PUBLIC_API_URL!);
		vi.stubEnv('MCP_OAUTH_SIGNING_SECRET', 'oauth-secret-'.repeat(6));
		mocks.prisma.mcpOAuthClient.create.mockReset().mockImplementation(async ({ data }: { data: unknown }) => ({ ...(data as object), createdAt: new Date('2026-09-22T00:00:00Z') }));
		mocks.prisma.mcpOAuthClient.findUnique.mockReset().mockResolvedValue(null);
		mocks.prisma.mcpAuthorizationCode.create.mockReset();
		mocks.prisma.user.findUnique.mockReset().mockResolvedValue(user);
		mocks.fetchCimdMetadata.mockReset();
		mocks.getCommercialBigNumbers.mockReset().mockResolvedValue({ ok: true, data: {
			current: { totalRevenue: 500, averageTicket: 500, totalSales: 1, newCustomers: 1, recurringCustomers: 0, revenuePerCustomer: 500 },
			previous: { totalRevenue: 0, averageTicket: 0, totalSales: 0, newCustomers: 0, recurringCustomers: 0, revenuePerCustomer: 0 },
			diff: { totalRevenue: 500 },
		}, error: null });
	});

	it('resolve CIMD com client_id idêntico sem persistir cliente externo', async () => {
		const clientId = 'https://agent.example/.well-known/oauth-client';
		mocks.fetchCimdMetadata.mockResolvedValue({
			metadata: { client_id: clientId, client_name: 'Agente CIMD', redirect_uris: ['https://agent.example/callback'], token_endpoint_auth_method: 'none', grant_types: ['authorization_code'] },
			cacheTtlSeconds: 60,
		});

		const client = await resolveOAuthClient(clientId);
		expect(client).toMatchObject({ clientId, registrationSource: 'cimd', clientOrigin: 'https://agent.example' });
		expect(mocks.prisma.mcpOAuthClient.findUnique).toHaveBeenCalledWith({ where: { clientId } });
		expect(mocks.prisma.mcpOAuthClient.create).not.toHaveBeenCalled();
	});

	it('percorre descoberta, DCR, código, ferramenta, refresh e revoke', async () => {
		const metadata = await getAuthorizationServerMetadata();
		expect(metadata.status).toBe(200);
		expect((await metadata.json()).issuer).toBe(process.env.NEXT_PUBLIC_API_URL!);

		const registration = await registerClient(new Request(`${process.env.NEXT_PUBLIC_API_URL}/api/mcp/oauth/register`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ client_name: 'Agente integrado', redirect_uris: ['http://127.0.0.1/callback'], grant_types: ['authorization_code', 'refresh_token'], token_endpoint_auth_method: 'none' }),
		}));
		const registered = await registration.json() as { client_id: string };
		expect(registration.status).toBe(201);

		const verifier = 'v'.repeat(43);
		const authorization = await parseAuthorizationRequest(new URLSearchParams({ client_id: registered.client_id, response_type: 'code', redirect_uri: 'http://127.0.0.1/callback', resource, code_challenge: createPkceChallenge(verifier), code_challenge_method: 'S256' }));
		mocks.prisma.mcpAuthorizationCode.create.mockImplementationOnce(async ({ data }: { data: { codeHash: string; clientId: string; redirectUri: string; resource: string; scope: string; codeChallenge: string; allowRefresh: boolean; expiresAt: Date; userId: string } }) => {
			return data;
		});
		const issued = await issueAuthorizationCode(authorization, user.id);
		expect(issued).toHaveLength(43);
		const storedCode = await mocks.prisma.mcpAuthorizationCode.create.mock.results[0].value;
		const codeRecord = await storedCode;
		const refreshCreated = vi.fn();
		mocks.prisma.$transaction.mockImplementationOnce(async (run) => run({
			user: { findUnique: vi.fn().mockResolvedValue(user) },
			mcpAuthorizationCode: { findUnique: vi.fn().mockResolvedValue({ ...codeRecord, consumedAt: null }), updateMany: vi.fn().mockResolvedValue({ count: 1 }) },
			mcpRefreshToken: { create: refreshCreated, updateMany: vi.fn() },
		}));

		const token = await exchangeToken(new URLSearchParams({ grant_type: 'authorization_code', client_id: registered.client_id, code: issued, redirect_uri: 'http://127.0.0.1/callback', resource, code_verifier: verifier }));
		expect(token.refresh_token).toBeTypeOf('string');
		expect(refreshCreated).toHaveBeenCalled();

		const toolResponse = await invokeMcpTool(createJdMcpHandler(), token.access_token, 'modern', 'jd_commercial_big_numbers', { startDate: '2026-09-01', endDate: '2026-09-22', category: 'all', customerType: 'all', org: 'all' });
		expect(toolResponse.status).toBe(200);
		expect((toolResponse.payload as { result: { structuredContent: { data: { current: { totalRevenue: number } } } } }).result.structuredContent.data.current.totalRevenue).toBe(500);

		const refreshRecord = refreshCreated.mock.calls[0][0].data;
		mocks.prisma.$transaction.mockImplementationOnce(async (run) => run({
			user: { findUnique: vi.fn().mockResolvedValue(user) },
			mcpRefreshToken: { findUnique: vi.fn().mockResolvedValue({ ...refreshRecord, consumedAt: null, revokedAt: null }), findFirst: vi.fn().mockResolvedValue(null), updateMany: vi.fn().mockResolvedValue({ count: 1 }), create: vi.fn() },
		}));
		const refreshed = await exchangeToken(new URLSearchParams({ grant_type: 'refresh_token', client_id: registered.client_id, refresh_token: token.refresh_token!, resource }));
		expect(refreshed.access_token).toBeTypeOf('string');

		mocks.prisma.$transaction.mockImplementationOnce(async (run) => run({ mcpRefreshToken: { findUnique: vi.fn().mockResolvedValue({ ...refreshRecord, clientId: registered.client_id }), updateMany: vi.fn() } }));
		await expect(revokeRefreshToken(new URLSearchParams({ token: token.refresh_token!, client_id: registered.client_id }))).resolves.toBeUndefined();

		mocks.prisma.$transaction.mockImplementationOnce(async (run) => run({
			user: { findUnique: vi.fn().mockResolvedValue(user) },
			mcpRefreshToken: {
				findUnique: vi.fn().mockResolvedValue({ ...refreshRecord, clientId: registered.client_id, consumedAt: null, revokedAt: new Date() }),
				updateMany: vi.fn(),
				findFirst: vi.fn(),
				create: vi.fn(),
			},
		}));
		await expect(exchangeToken(new URLSearchParams({ grant_type: 'refresh_token', client_id: registered.client_id, refresh_token: token.refresh_token!, resource }))).rejects.toMatchObject({ code: 'invalid_grant' });
	});
});
