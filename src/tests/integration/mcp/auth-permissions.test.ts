import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthorizationError } from '@/lib/authorization';
import { createJdMcpHandler } from '@/mcp/server';
import { invokeMcpTool } from './harness';

const mocks = vi.hoisted(() => ({
	authenticateMcpRequest: vi.fn(),
	getCommercialGoalTargets: vi.fn(),
}));

vi.mock('@/mcp/auth/session', () => ({ authenticateMcpRequest: mocks.authenticateMcpRequest, readMcpUser: (authInfo: { extra?: Record<string, unknown> }) => authInfo.extra?.user }));
vi.mock('@/services/data-services/goals-shared-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/goals-shared-services')>('@/services/data-services/goals-shared-services');

	return { ...actual, getCommercialGoalTargets: mocks.getCommercialGoalTargets, getGoalsCurrent: vi.fn(), getGoalTracking: vi.fn(), getMarketingGoals: vi.fn() };
});
vi.mock('@/services/data-services/shared-read-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/shared-read-services')>('@/services/data-services/shared-read-services');

	return { ...actual, getCommercialBigNumbers: vi.fn(), getCommercialRankings: vi.fn(), getCommercialSalesBy: vi.fn(), getCommercialOriginData: vi.fn(), getResultsByOrganization: vi.fn() };
});
vi.mock('@/services/google-services/shared-operations', () => ({
	getGoogleAdsData: vi.fn(),
	getGoogleAnalyticsData: vi.fn(),
	getGoogleTopAds: vi.fn(),
	getGoogleTopKeywords: vi.fn(),
}));
vi.mock('@/services/marketing-report/get-marketing-report-aggregate', () => ({ getAuthenticatedMarketingReport: vi.fn() }));

describe('permissões do MCP pela sessão do JD', () => {
	beforeEach(() => {
		vi.stubEnv('NEXTAUTH_URL', process.env.NEXT_PUBLIC_API_URL!);
		mocks.authenticateMcpRequest.mockReset();
		mocks.getCommercialGoalTargets.mockReset();
	});

	it('retorna 401 sem sessão NextAuth', async () => {
		mocks.authenticateMcpRequest.mockRejectedValue(new AuthorizationError(401, 'Bearer MCP ausente'));
		const response = await invokeMcpTool(createJdMcpHandler(), undefined, 'modern', 'jd_goals_current', {});

		expect(response.status).toBe(401);
	});

	it('retorna 403 antes do serviço para SELLER em operação administrativa', async () => {
		const user = {
			id: 'seller',
			name: 'Seller',
			email: 'seller@jd.test',
			externalId: '20',
			role: 'SELLER',
			isActive: true,
		};
		mocks.authenticateMcpRequest.mockResolvedValue({ user, authInfo: { token: 'oauth', clientId: 'client', scopes: ['mcp:read'], extra: { user } } });
		const response = await invokeMcpTool(createJdMcpHandler(), 'session', 'modern', 'jd_commercial_goal_targets', {});

		expect(response.status).toBe(200);
		const payload = response.payload as { result: { structuredContent: { ok: boolean; error?: { code: string } } } };
		expect(payload.result.structuredContent).toMatchObject({ ok: false, error: { code: 'FORBIDDEN' } });
		expect(mocks.getCommercialGoalTargets).not.toHaveBeenCalled();
	});

	it('retorna 403 para usuário inativo depois de recarregar a sessão', async () => {
		mocks.authenticateMcpRequest.mockRejectedValue(new AuthorizationError(403, 'Usuário inativo'));

		const response = await invokeMcpTool(createJdMcpHandler(), 'session', 'modern', 'jd_goals_current', {});

		expect(response.status).toBe(403);
	});
});
