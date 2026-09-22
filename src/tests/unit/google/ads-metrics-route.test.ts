import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
	getCurrentUserFromRequest: vi.fn(),
	getGoogleAdsData: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
	getCurrentUserFromRequest: mocks.getCurrentUserFromRequest,
}));

vi.mock('@/services/google-services/shared-operations', async () => {
	const actual = await vi.importActual<typeof import('@/services/google-services/shared-operations')>('@/services/google-services/shared-operations');

	return { ...actual, getGoogleAdsData: mocks.getGoogleAdsData };
});

import { GET } from '@/app/api/services/google-services/get-ads-data/route';

const user = { id: 'manager-1', role: 'MANAGER' as const, isActive: true };
const filters = { startDate: '2026-08-01', endDate: '2026-08-31', scope: 'products' as const, campaignId: 'all' };

describe('rota Google Ads', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getCurrentUserFromRequest.mockResolvedValue(user);
		mocks.getGoogleAdsData.mockResolvedValue({ ok: true, data: { dataADS: {} }, error: null });
	});

	it('usa autenticação do app e delega os filtros ao serviço Google compartilhado', async () => {
		const request = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/google-services/get-ads-data?startDate=2026-08-01&endDate=2026-08-31&scope=products&campaignId=all`);
		const response = await GET(request);

		expect(response.status).toBe(200);
		expect(mocks.getGoogleAdsData).toHaveBeenCalledWith(user, filters);
	});

	it('não abre a integração para sessão ausente', async () => {
		mocks.getCurrentUserFromRequest.mockResolvedValue(null);

		const response = await GET(new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/google-services/get-ads-data?startDate=2026-08-01&endDate=2026-08-31&scope=products&campaignId=all`));

		expect(response.status).toBe(401);
		expect(mocks.getGoogleAdsData).not.toHaveBeenCalled();
	});
});
