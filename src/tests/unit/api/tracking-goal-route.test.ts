import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
	getCurrentUserFromRequest: vi.fn(),
	getGoalTracking: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
	getCurrentUserFromRequest: mocks.getCurrentUserFromRequest,
}));

vi.mock('@/services/data-services/goals-shared-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/goals-shared-services')>('@/services/data-services/goals-shared-services');

	return { ...actual, getGoalTracking: mocks.getGoalTracking };
});

import { GET } from '@/app/api/services/data-services/tracking-goal/route';

const user = { id: 'manager-1', role: 'MANAGER' as const, isActive: true };
const filters = { startDate: '2026-08-01', endDate: '2026-08-31' };

describe('rota de acompanhamento de metas', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getCurrentUserFromRequest.mockResolvedValue(user);
		mocks.getGoalTracking.mockResolvedValue({ ok: true, overview: [], timeSeries: [], companySummary: {}, error: null });
	});

	it('delega o intervalo civil ao serviço compartilhado', async () => {
		const request = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/tracking-goal?startDate=2026-08-01&endDate=2026-08-31`);
		const response = await GET(request);

		expect(response.status).toBe(200);
		expect(mocks.getGoalTracking).toHaveBeenCalledWith(user, filters);
	});

	it('protege o serviço quando não há sessão', async () => {
		mocks.getCurrentUserFromRequest.mockResolvedValue(null);

		const response = await GET(new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/tracking-goal?startDate=2026-08-01&endDate=2026-08-31`));

		expect(response.status).toBe(401);
		expect(mocks.getGoalTracking).not.toHaveBeenCalled();
	});
});
