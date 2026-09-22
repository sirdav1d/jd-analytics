import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
	getCurrentUserForRequest: vi.fn(),
	getGoalsCurrent: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
	getCurrentUserForRequest: mocks.getCurrentUserForRequest,
}));

vi.mock('@/services/data-services/goals-shared-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/goals-shared-services')>('@/services/data-services/goals-shared-services');

	return { ...actual, getGoalsCurrent: mocks.getGoalsCurrent };
});

import { GET } from '@/app/api/services/data-services/goals-current/route';

const user = { id: 'manager-1', role: 'MANAGER' as const, isActive: true };

describe('rota de metas correntes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getCurrentUserForRequest.mockResolvedValue(user);
		mocks.getGoalsCurrent.mockResolvedValue({ ok: true, data: { commercial: {}, roas: {} }, error: null });
	});

	it('usa a sessão da requisição e repassa o escopo ao serviço', async () => {
		const request = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/goals-current?scope=services`);
		const response = await GET(request);

		expect(response.status).toBe(200);
		expect(mocks.getGoalsCurrent).toHaveBeenCalledWith(user, 'services');
	});

	it('não consulta metas quando a sessão está ausente', async () => {
		mocks.getCurrentUserForRequest.mockResolvedValue(null);

		const response = await GET(new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/goals-current`));

		expect(response.status).toBe(401);
		expect(mocks.getGoalsCurrent).not.toHaveBeenCalled();
	});
});
