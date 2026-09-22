import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
	getCurrentUserFromRequest: vi.fn(),
	getGoogleAnalyticsData: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
	getCurrentUserFromRequest: mocks.getCurrentUserFromRequest,
}));

vi.mock('@/services/google-services/shared-operations', async () => {
	const actual = await vi.importActual<typeof import('@/services/google-services/shared-operations')>('@/services/google-services/shared-operations');

	return { ...actual, getGoogleAnalyticsData: mocks.getGoogleAnalyticsData };
});

import { GET } from '@/app/api/services/google-services/get-analytics-data/route';

const user = { id: 'manager-1', role: 'MANAGER' as const, isActive: true };
const filters = { startDate: '2026-08-01', endDate: '2026-08-31' };

describe('rota Google Analytics', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getCurrentUserFromRequest.mockResolvedValue(user);
		mocks.getGoogleAnalyticsData.mockResolvedValue({ ok: true, data: [], error: null });
	});

	it('delega o período ao serviço Google compartilhado', async () => {
		const request = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/google-services/get-analytics-data?startDate=2026-08-01&endDate=2026-08-31`);
		const response = await GET(request);

		expect(response.status).toBe(200);
		expect(mocks.getGoogleAnalyticsData).toHaveBeenCalledWith(user, filters);
	});

	it('protege o serviço para sessão ausente', async () => {
		mocks.getCurrentUserFromRequest.mockResolvedValue(null);

		const response = await GET(new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/google-services/get-analytics-data?startDate=2026-08-01&endDate=2026-08-31`));

		expect(response.status).toBe(401);
		expect(mocks.getGoogleAnalyticsData).not.toHaveBeenCalled();
	});
});
