import { describe, expect, it, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
	salesGoal: { findMany: vi.fn() },
	pedido: { findMany: vi.fn(), groupBy: vi.fn() },
	roasGoal: { findFirst: vi.fn(), findMany: vi.fn() },
	saleItem: { aggregate: vi.fn() },
	$queryRaw: vi.fn(),
}));

const marketingReportMock = vi.hoisted(() => vi.fn().mockResolvedValue({
	ok: false,
	data: null,
	error: 'sem dados',
}));

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
vi.mock('@/services/marketing-report/get-marketing-report-aggregate', () => ({
	getMarketingReportAggregate: marketingReportMock,
}));

import {
	getCommercialGoalTargets,
	getGoalsCurrent,
	getGoalTracking,
} from '@/services/data-services/goals-shared-services';

const admin = { id: 'admin', role: 'ADMIN' as const, isActive: true };
const manager = { id: 'manager', role: 'MANAGER' as const, isActive: true };
const seller = { id: 'seller', role: 'SELLER' as const, isActive: true };
const filters = { startDate: '2026-09-01', endDate: '2026-09-21' };

describe('operações de metas compartilhadas', () => {
	it.each([admin, manager, seller])('permite metas correntes para %s', async (user) => {
		prismaMock.salesGoal.findMany.mockResolvedValue([]);
		prismaMock.pedido.findMany.mockResolvedValue([]);
		prismaMock.roasGoal.findFirst.mockResolvedValue(null);

		await expect(getGoalsCurrent(user)).resolves.toMatchObject({ ok: true });
	});

	it.each([manager, seller])('recusa metas administrativas para %s', async (user) => {
		await expect(getCommercialGoalTargets(user)).rejects.toMatchObject({ status: 403 });
		expect(prismaMock.salesGoal.findMany).not.toHaveBeenCalled();
	});

	it('recusa rastreamento para usuário inativo antes da consulta', async () => {
		await expect(getGoalTracking({ ...admin, isActive: false }, filters)).rejects.toMatchObject({ status: 403 });
		expect(prismaMock.pedido.groupBy).not.toHaveBeenCalled();
	});
});
