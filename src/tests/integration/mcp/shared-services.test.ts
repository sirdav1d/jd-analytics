import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createJdMcpHandler } from '@/mcp/server';
import { invokeLegacyMcpRequest, invokeMcpTool, invokeModernMcpRequest } from './harness';

const currentUser = {
	id: '10000000-0000-4000-8000-000000000001',
	name: 'Usuário atual',
	email: 'atual@jd.test',
	externalId: '10',
	role: 'MANAGER' as const,
	isActive: true,
};

const mocks = vi.hoisted(() => ({
	authenticateMcpRequest: vi.fn(),
	getCommercialBigNumbers: vi.fn(),
	getCommercialRankings: vi.fn(),
	getCommercialSalesBy: vi.fn(),
	getCommercialOriginData: vi.fn(),
	getResultsByOrganization: vi.fn(),
	getGoalsCurrent: vi.fn(),
	getGoalTracking: vi.fn(),
	getCommercialGoalTargets: vi.fn(),
	getMarketingGoals: vi.fn(),
	getGoogleAdsData: vi.fn(),
	getGoogleAnalyticsData: vi.fn(),
	getGoogleTopAds: vi.fn(),
	getGoogleTopKeywords: vi.fn(),
	getAuthenticatedMarketingReport: vi.fn(),
}));

vi.mock('@/mcp/auth/session', () => ({ authenticateMcpRequest: mocks.authenticateMcpRequest, readMcpUser: (authInfo: { extra?: Record<string, unknown> }) => authInfo.extra?.user }));
vi.mock('@/services/data-services/shared-read-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/shared-read-services')>('@/services/data-services/shared-read-services');

	return { ...actual, getCommercialBigNumbers: mocks.getCommercialBigNumbers, getCommercialRankings: mocks.getCommercialRankings, getCommercialSalesBy: mocks.getCommercialSalesBy, getCommercialOriginData: mocks.getCommercialOriginData, getResultsByOrganization: mocks.getResultsByOrganization };
});
vi.mock('@/services/data-services/goals-shared-services', () => ({
	getGoalsCurrent: mocks.getGoalsCurrent,
	getGoalTracking: mocks.getGoalTracking,
	getCommercialGoalTargets: mocks.getCommercialGoalTargets,
	getMarketingGoals: mocks.getMarketingGoals,
}));
vi.mock('@/services/google-services/shared-operations', () => ({
	getGoogleAdsData: mocks.getGoogleAdsData,
	getGoogleAnalyticsData: mocks.getGoogleAnalyticsData,
	getGoogleTopAds: mocks.getGoogleTopAds,
	getGoogleTopKeywords: mocks.getGoogleTopKeywords,
}));
vi.mock('@/services/marketing-report/get-marketing-report-aggregate', () => ({
	getAuthenticatedMarketingReport: mocks.getAuthenticatedMarketingReport,
}));

describe('MCP sobre os serviços compartilhados', () => {
	beforeEach(() => {
		vi.stubEnv('NEXTAUTH_URL', process.env.NEXT_PUBLIC_API_URL!);
		mocks.authenticateMcpRequest.mockResolvedValue({ user: currentUser, authInfo: { token: 'oauth', clientId: 'client', scopes: ['mcp:read'], extra: { user: currentUser } } });
		mocks.getCommercialBigNumbers.mockResolvedValue({ ok: true, data: {
			current: { totalRevenue: 500, averageTicket: 500, totalSales: 1, newCustomers: 1, recurringCustomers: 0, revenuePerCustomer: 500 },
			previous: { totalRevenue: 0, averageTicket: 0, totalSales: 0, newCustomers: 0, recurringCustomers: 0, revenuePerCustomer: 0 },
			diff: { totalRevenue: 500 },
		}, error: null });
	});

	it('publica exatamente as 14 operações aprovadas', async () => {
		const response = await invokeModernMcpRequest(createJdMcpHandler(), 'oauth', 'tools/list', {});
		const payload = response.payload as { result: { tools: Array<{ name: string }> } };

		expect(response.status).toBe(200);
		expect(payload.result.tools.map((tool) => tool.name)).toEqual([
			'jd_commercial_big_numbers',
			'jd_commercial_rankings',
			'jd_commercial_sales_by',
			'jd_commercial_origin_data',
			'jd_results_by_organization',
			'jd_goals_current',
			'jd_goal_tracking',
			'jd_commercial_goal_targets',
			'jd_marketing_goals',
			'jd_google_ads_data',
			'jd_google_analytics_data',
			'jd_google_top_ads',
			'jd_google_top_keywords',
			'jd_marketing_report',
		]);
	});

	it('mantém descoberta stateless da revisão legada suportada pelo SDK', async () => {
		const response = await invokeLegacyMcpRequest(createJdMcpHandler(), 'oauth', 'tools/list', {});
		const payload = response.payload as { result: { tools: Array<{ name: string }> } };

		expect(response.status).toBe(200);
		expect(payload.result.tools).toHaveLength(14);
	});

	it.each([
		['jd_google_ads_data', mocks.getGoogleAdsData],
		['jd_google_analytics_data', mocks.getGoogleAnalyticsData],
		['jd_google_top_ads', mocks.getGoogleTopAds],
		['jd_google_top_keywords', mocks.getGoogleTopKeywords],
	] as const)('converte falha operacional de %s em UPSTREAM_UNAVAILABLE', async (name, read) => {
		read.mockResolvedValue({ ok: false, data: null, error: 'Falha segura da integração.' });

		const response = await invokeMcpTool(createJdMcpHandler(), 'session', 'modern', name, { startDate: '2026-09-01', endDate: '2026-09-21' });
		const payload = response.payload as { result: { structuredContent: { ok: boolean; error: { code: string } } } };

		expect(payload.result.structuredContent).toMatchObject({ ok: false, error: { code: 'UPSTREAM_UNAVAILABLE' } });
	});

	it('encaminha sessão e filtros ao serviço comercial único', async () => {
		const filters = {
			startDate: '2026-09-01',
			endDate: '2026-09-21',
			category: 'all',
			customerType: 'all',
			org: 'all',
		};
		const response = await invokeMcpTool(createJdMcpHandler(), 'session', 'modern', 'jd_commercial_big_numbers', filters);
		const payload = response.payload as { result: { structuredContent: { data: { current: { totalRevenue: number } } } } };

		expect(response.status).toBe(200);
		expect(mocks.getCommercialBigNumbers).toHaveBeenCalledWith(currentUser, filters);
		expect(payload.result.structuredContent.data.current.totalRevenue).toBe(500);
	});
});
