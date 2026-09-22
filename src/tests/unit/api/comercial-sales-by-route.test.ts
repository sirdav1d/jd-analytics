import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
	getCurrentUserFromRequest: vi.fn(),
	getCommercialSalesBy: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
	getCurrentUserFromRequest: mocks.getCurrentUserFromRequest,
}));

vi.mock('@/services/data-services/shared-read-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/shared-read-services')>('@/services/data-services/shared-read-services');

	return { ...actual, getCommercialSalesBy: mocks.getCommercialSalesBy };
});

import { GET } from '@/app/api/services/data-services/comercial-sales-by/route';

const user = { id: 'seller-1', role: 'SELLER' as const, isActive: true };

describe('rota de dimensões comerciais', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getCurrentUserFromRequest.mockResolvedValue(user);
		mocks.getCommercialSalesBy.mockResolvedValue({ ok: true, data: { revenueOverTime: [] }, error: null });
	});

	it('autentica e delega os filtros ao serviço compartilhado', async () => {
		const request = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/comercial-sales-by?startDate=2026-08-01&endDate=2026-08-01&category=all&customerType=all&org=all`);

		const response = await GET(request);

		expect(response.status).toBe(200);
		expect(mocks.getCommercialSalesBy).toHaveBeenCalledWith(user, {
			startDate: '2026-08-01',
			endDate: '2026-08-01',
			category: 'all',
			customerType: 'all',
			org: 'all',
		});
		await expect(response.json()).resolves.toMatchObject({ ok: true, error: null });
	});

	it('recusa a chamada sem sessão antes do serviço', async () => {
		mocks.getCurrentUserFromRequest.mockResolvedValue(null);

		const response = await GET(new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/comercial-sales-by?startDate=2026-08-01&endDate=2026-08-01&category=all&customerType=all&org=all`));

		expect(response.status).toBe(401);
		expect(mocks.getCommercialSalesBy).not.toHaveBeenCalled();
	});
});
