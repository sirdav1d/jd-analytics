import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mocks = vi.hoisted(() => ({
	getCurrentUserFromRequest: vi.fn(),
	getResultsByOrganization: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
	getCurrentUserFromRequest: mocks.getCurrentUserFromRequest,
}));

vi.mock('@/services/data-services/shared-read-services', async () => {
	const actual = await vi.importActual<typeof import('@/services/data-services/shared-read-services')>('@/services/data-services/shared-read-services');

	return { ...actual, getResultsByOrganization: mocks.getResultsByOrganization };
});

import { GET } from '@/app/api/services/data-services/home/route';

const user = { id: 'manager-1', role: 'MANAGER' as const, isActive: true };
const data = {
	result: [{ organizationId: 'org-space', organization: 'Loja A B', revenue: 100, salesCount: 3, newCustomers: 3 }],
	historyOrganizations: [{ organizationId: 'org-space', organization: 'Loja A B' }],
	revenueByOrg: [{ period: '2026-08-01', 'org-space': 100 }],
	salesByOrg: [{ period: '2026-08-01', 'org-space': 3 }],
};

describe('rota de histórico por organização', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.getCurrentUserFromRequest.mockResolvedValue(user);
		mocks.getResultsByOrganization.mockResolvedValue({ ok: true, data, error: null });
	});

	it('mantém o resultado do serviço compartilhado sem transformar nomes de organizações', async () => {
		const request = new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/home?startDate=2026-08-01&endDate=2026-08-01`);
		const response = await GET(request);

		expect(response.status).toBe(200);
		expect(mocks.getResultsByOrganization).toHaveBeenCalledWith(user, {
			startDate: '2026-08-01',
			endDate: '2026-08-01',
		});
		await expect(response.json()).resolves.toEqual({ ok: true, data, error: null });
	});

	it('recusa sessão ausente antes de acessar os dados', async () => {
		mocks.getCurrentUserFromRequest.mockResolvedValue(null);

		const response = await GET(new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/services/data-services/home?startDate=2026-08-01&endDate=2026-08-01`));

		expect(response.status).toBe(401);
		expect(mocks.getResultsByOrganization).not.toHaveBeenCalled();
	});
});
