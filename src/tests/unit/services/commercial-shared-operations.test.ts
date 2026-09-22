import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
	pedido: { findMany: vi.fn(), groupBy: vi.fn() },
}));

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import {
	getCommercialBigNumbers,
	getCommercialRankings,
	getCommercialSalesBy,
	getResultsByOrganization,
} from '@/services/data-services/shared-read-services';

const activeUser = { id: 'seller-1', role: 'SELLER' as const, isActive: true };
const inactiveUser = { ...activeUser, isActive: false };
const filters = {
	startDate: '2026-09-01',
	endDate: '2026-09-21',
	category: 'all',
	customerType: 'all',
	org: 'all',
};

function order(id: string, sellerId: string, customerId: string, amount: number) {
	return {
		id,
		userId: sellerId,
		customerId,
		data_pedido: new Date('2026-09-10T00:00:00.000Z'),
		cancelled: false,
		user: { id: sellerId, name: sellerId },
		customer: { id: customerId, name: customerId, externalCode: 1, personType: 'FISICA' },
		organization: { id: 'org-1', name: 'Centro' },
		Origin: { name: 'Google' },
		paymentMethod: { method: 'Pix' },
		items: [{
			quantity: 1,
			totalValue: amount,
			product: { id: 'product-1', description: 'Produto', external_code: 12, sector: 'all' },
		}],
	};
}

describe('operações comerciais compartilhadas', () => {
	beforeEach(() => {
		prismaMock.pedido.findMany.mockReset();
		prismaMock.pedido.groupBy.mockReset().mockResolvedValue([]);
	});

	it('recusa usuário inativo antes de consultar Prisma', async () => {
		await expect(getCommercialRankings(inactiveUser, filters)).rejects.toMatchObject({ status: 403 });
		expect(prismaMock.pedido.findMany).not.toHaveBeenCalled();
	});

	it('preserva indicadores e atribui a mesma posição para empate', async () => {
		prismaMock.pedido.findMany.mockResolvedValue([
			order('sale-1', 'seller-1', 'customer-1', 100),
			order('sale-2', 'seller-2', 'customer-2', 100),
		]);

		const bigNumbers = await getCommercialBigNumbers(activeUser, filters);
		const rankings = await getCommercialRankings(activeUser, filters);

		expect(bigNumbers.data.current.totalRevenue).toBe(200);
		expect(rankings.data.sellers.map((seller) => seller.posicao)).toEqual([1, 1]);
	});

	it('soma somente itens do setor e conta clientes distintos por tipo', async () => {
		const first = order('sale-1', 'seller-1', 'customer-1', 10);
		first.items[0].product.sector = 'A';
		first.items.push({ quantity: 1, totalValue: 90, product: { id: 'product-2', description: 'Outro', external_code: 20, sector: 'B' } });
		const second = order('sale-2', 'seller-1', 'customer-1', 20);
		second.items[0].product.sector = 'A';
		prismaMock.pedido.findMany.mockResolvedValueOnce([first, second]).mockResolvedValueOnce([]);

		const result = await getCommercialSalesBy(activeUser, { ...filters, category: 'A' });

		expect(result.data.salesByClient).toEqual([{ type: 'FISICA', revenue: 30 }, { type: 'JURIDICA', revenue: 0 }]);
		expect(result.data.salesByClientType).toEqual([
			{ type: 'Novo', clients: 1, revenue: 30 },
			{ type: 'Recorrente', clients: 0, revenue: 0 },
		]);
	});

	it('exige exatamente um pedido global para clientes novos', async () => {
		const orders = [order('1', 'seller', 'repeat', 10), order('2', 'seller', 'repeat', 20), order('3', 'seller', 'single', 30)];
		prismaMock.pedido.findMany.mockResolvedValueOnce(orders).mockResolvedValueOnce([]).mockResolvedValue([]);
		prismaMock.pedido.groupBy.mockResolvedValue([{ customerId: 'repeat', _count: { _all: 2 } }, { customerId: 'single', _count: { _all: 1 } }]);

		const result = await getCommercialBigNumbers(activeUser, filters);

		expect(result.data.current.newCustomers).toBe(1);
		expect(result.data.current.recurringCustomers).toBe(0);
		expect(prismaMock.pedido.groupBy).toHaveBeenCalledWith({ by: ['customerId'], where: { customerId: { in: ['repeat', 'single'] } }, _count: { _all: true } });
	});

	it.each([{ org: 'org-1', category: 'all' }, { org: 'all', category: 'A' }])('restringe recorrência ao filtro %j', async (selected) => {
		prismaMock.pedido.findMany.mockResolvedValueOnce([order('1', 'seller', 'client', 10)]).mockResolvedValueOnce([]).mockResolvedValue([]);
		prismaMock.pedido.groupBy.mockResolvedValue([{ customerId: 'client', _count: { _all: 2 } }]);

		const result = await getCommercialBigNumbers(activeUser, { ...filters, ...selected });
		const expectedFilter = selected.org !== 'all' ? { organizationId: selected.org } : { items: { some: { product: { sector: selected.category } } } };

		expect(prismaMock.pedido.findMany).toHaveBeenLastCalledWith({ where: { ...expectedFilter, customerId: { in: ['client'] }, data_pedido: { lt: new Date('2026-09-01T00:00:00Z') } }, select: { customerId: true } });
		expect(result.data.current.recurringCustomers).toBe(0);
		expect(result.data.current.newCustomers).toBe(0);
	});

	it('preserva ausência de histórico como regra de novos no período anterior', async () => {
		prismaMock.pedido.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([order('1', 'seller', 'client', 10), order('2', 'seller', 'client', 20)]).mockResolvedValue([]);

		const result = await getCommercialBigNumbers(activeUser, filters);

		expect(result.data.previous.newCustomers).toBe(1);
		expect(result.data.previous.recurringCustomers).toBe(0);
	});

	it.each(['2026-09-01', '2026-08-01'])('ordena séries diárias ou mensais desde %s', async (startDate) => {
		const dates = ['2026-09-20', startDate, '2026-09-10'];
		prismaMock.pedido.findMany.mockResolvedValueOnce(dates.map((date, index) => ({ ...order(String(index), 'seller', 'client', 10), data_pedido: new Date(`${date}T00:00:00Z`) }))).mockResolvedValueOnce([]);

		const result = await getResultsByOrganization(activeUser, { startDate, endDate: '2026-09-21' });
		const periods = startDate === '2026-09-01' ? ['2026-09-01', '2026-09-10', '2026-09-20'] : ['2026-08', '2026-09'];

		expect(result.data.revenueByOrg.map((row) => row.period)).toEqual(periods);
		expect(result.data.salesByOrg.map((row) => row.period)).toEqual(periods);
		expect(result.data.revenueByOrg.reduce((sum, row) => sum + Number(row['org-1']), 0)).toBe(30);
	});

	it('calcula novos clientes e séries por organização sem chavear o nome', async () => {
		const current = {
			...order('sale-1', 'seller-1', 'customer-1', 100),
			organization: { id: 'org-1', name: 'Loja A B' },
		};
		prismaMock.pedido.findMany.mockResolvedValueOnce([current]).mockResolvedValueOnce([
			{ customerId: 'customer-1', data_pedido: new Date('2026-09-10T00:00:00.000Z') },
		]);

		const result = await getResultsByOrganization(activeUser, { startDate: '2026-09-10', endDate: '2026-09-10' });

		expect(result.data.result).toEqual([{
			organizationId: 'org-1',
			organization: 'Loja A B',
			revenue: 100,
			salesCount: 1,
			newCustomers: 1,
		}]);
		expect(result.data.revenueByOrg).toEqual([{ period: '2026-09-10', 'org-1': 100 }]);
	});
});
