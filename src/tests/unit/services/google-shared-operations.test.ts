import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	getAuthenticatedClient: vi.fn(),
	resolveGoogleAdsAccount: vi.fn(),
	report: vi.fn(),
	query: vi.fn(),
	pedidoFindMany: vi.fn(),
	runReport: vi.fn(),
}));

vi.mock('googleapis', () => ({ google: { analyticsdata: () => ({ properties: { runReport: mocks.runReport } }) } }));

vi.mock('@/lib/google-authenticated-client', () => ({ getAuthenticatedClient: mocks.getAuthenticatedClient }));
vi.mock('@/lib/google-ads-account', () => ({ resolveGoogleAdsAccount: mocks.resolveGoogleAdsAccount }));
vi.mock('@/lib/prisma', () => ({ prisma: { pedido: { findMany: mocks.pedidoFindMany } } }));
vi.mock('google-ads-api', () => ({
	GoogleAdsApi: class {
		Customer() {
			return { report: mocks.report, query: mocks.query };
		}
	},
}));

import { getGoogleAdsData, getGoogleAnalyticsData, getGoogleTopAds, getGoogleTopKeywords } from '@/services/google-services/shared-operations';

const activeUser = { id: 'manager', role: 'MANAGER' as const, isActive: true };
const inactiveUser = { ...activeUser, isActive: false };
const filters = { startDate: '2026-09-01', endDate: '2026-09-21', scope: 'products' as const, campaignId: 'all' };

describe('operações Google compartilhadas', () => {
	beforeEach(() => {
		vi.stubEnv('JD_CENTRO_ID', 'org-centro');
		mocks.getAuthenticatedClient.mockReset().mockResolvedValue({ refreshToken: 'refresh-token', oauth2Client: { getAccessToken: vi.fn() } });
		mocks.resolveGoogleAdsAccount.mockReset().mockReturnValue({ customerId: 'customer-id', managerId: 'manager-id' });
		mocks.report.mockReset().mockResolvedValue([]);
		mocks.query.mockReset().mockResolvedValue([]);
		mocks.pedidoFindMany.mockReset().mockResolvedValue([]);
		mocks.runReport.mockReset().mockResolvedValue({ data: {} });
	});

	it('usa o cliente Google já autenticado pela organização do app', async () => {
		await getGoogleAdsData(activeUser, filters);

		expect(mocks.getAuthenticatedClient).toHaveBeenCalledWith('org-centro');
		expect(mocks.resolveGoogleAdsAccount).toHaveBeenCalledWith('products');
	});

	it.each([getGoogleAdsData, getGoogleAnalyticsData, getGoogleTopAds, getGoogleTopKeywords])('não abre integração para usuário inativo em %s', async (read) => {
		await expect(read(inactiveUser, filters)).rejects.toMatchObject({ status: 403 });
		expect(mocks.getAuthenticatedClient).not.toHaveBeenCalled();
	});

	it.each([getGoogleAdsData, getGoogleAnalyticsData, getGoogleTopAds, getGoogleTopKeywords])('retorna falha segura para token revogado em %s', async (read) => {
		mocks.getAuthenticatedClient.mockRejectedValue(new Error('invalid_grant secret-token'));

		await expect(read(activeUser, filters)).resolves.toEqual({ ok: false, data: null, error: 'Não foi possível consultar os dados do Google. Tente novamente.' });
	});

	it.each([getGoogleAdsData, getGoogleAnalyticsData, getGoogleTopAds, getGoogleTopKeywords])('retorna falha segura quando a API rejeita em %s', async (read) => {
		mocks.report.mockRejectedValue(new Error('quota exceeded'));
		mocks.query.mockRejectedValue(new Error('quota exceeded'));
		mocks.runReport.mockRejectedValue(new Error('quota exceeded'));

		await expect(read(activeUser, filters)).resolves.toMatchObject({ ok: false, data: null });
	});
});
