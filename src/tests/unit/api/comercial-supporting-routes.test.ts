import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
	getCurrentUserFromRequest: vi.fn(),
	getCommercialBigNumbers: vi.fn(),
	getCommercialRankings: vi.fn(),
	getCommercialOriginData: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
	getCurrentUserFromRequest: mocks.getCurrentUserFromRequest,
}));

vi.mock('@/services/data-services/shared-read-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/shared-read-services')>('@/services/data-services/shared-read-services');

	return {
		...actual,
		getCommercialBigNumbers: mocks.getCommercialBigNumbers,
		getCommercialRankings: mocks.getCommercialRankings,
		getCommercialOriginData: mocks.getCommercialOriginData,
	};
});

import { GET as getBigNumbers } from '@/app/api/services/data-services/comercial-big-numbers/route';
import { GET as getRankings } from '@/app/api/services/data-services/comercial-rankings/route';
import { GET as getOriginData } from '@/app/api/services/data-services/data-origin/route';

const user = { id: 'seller-1', role: 'SELLER' as const, isActive: true };
const query = 'startDate=2026-08-01&endDate=2026-08-01&category=all&customerType=all&org=all';
const filters = { startDate: '2026-08-01', endDate: '2026-08-01', category: 'all', customerType: 'all', org: 'all' };

describe('rotas comerciais compartilhadas', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getCurrentUserFromRequest.mockResolvedValue(user);
		mocks.getCommercialBigNumbers.mockResolvedValue({ ok: true, data: { current: {} }, error: null });
		mocks.getCommercialRankings.mockResolvedValue({ ok: true, data: { sellers: [], products: [], topCustomers: [] }, error: null });
		mocks.getCommercialOriginData.mockResolvedValue({ ok: true, data: { revenueByOrigin: [] }, error: null });
	});

	it('delega indicadores, rankings e origens com o mesmo usuário e filtros', async () => {
		const request = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/comercial-big-numbers?${query}`);
		const rankingsRequest = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/comercial-rankings?${query}`);
		const originRequest = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/data-origin?${query}`);

		expect((await getBigNumbers(request)).status).toBe(200);
		expect((await getRankings(rankingsRequest)).status).toBe(200);
		expect((await getOriginData(originRequest)).status).toBe(200);

		expect(mocks.getCommercialBigNumbers).toHaveBeenCalledWith(user, filters);
		expect(mocks.getCommercialRankings).toHaveBeenCalledWith(user, filters);
		expect(mocks.getCommercialOriginData).toHaveBeenCalledWith(user, filters);
	});

	it('não consulta o serviço para sessão ausente', async () => {
		mocks.getCurrentUserFromRequest.mockResolvedValue(null);

		const response = await getRankings(new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/comercial-rankings?${query}`));

		expect(response.status).toBe(401);
		expect(mocks.getCommercialRankings).not.toHaveBeenCalled();
	});
});
