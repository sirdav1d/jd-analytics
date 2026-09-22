import 'server-only';

import { z } from 'zod';
import { assertActiveUser, type AuthorizedUser } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import {
	commercialFiltersSchema,
	type CommercialFilters,
	type PeriodFilters,
} from '@/services/app-read-contracts';
import { resolveCivilDateRange } from '@/services/data-services/civil-date-range';

type CommercialResponse<T> = {
	ok: true;
	data: T;
	error: null;
};

type OrderRecord = {
	id: string;
	userId: string;
	customerId: string | null;
	data_pedido: Date;
	cancelled: boolean;
	user?: { id: string; name: string } | null;
	customer?: {
		id: string;
		name: string;
		externalCode: number | null;
		personType: string;
	} | null;
	organization?: { id: string; name: string } | null;
	Origin?: { name: string } | null;
	paymentMethod?: { method: string } | null;
	items: Array<{
		quantity: number;
		totalValue: number;
		product: {
			id: string;
			description: string;
			external_code: number | null;
			sector: string;
		};
	}>;
};

export type CommercialBigNumbersData = {
	current: {
		totalRevenue: number;
		averageTicket: number;
		totalSales: number;
		newCustomers: number;
		recurringCustomers: number;
		revenuePerCustomer: number;
	};
	previous: {
		totalRevenue: number;
		averageTicket: number;
		totalSales: number;
		newCustomers: number;
		recurringCustomers: number;
		revenuePerCustomer: number;
	};
	diff: Record<string, number>;
};

export type CommercialRankingsData = {
	sellers: Array<{
		posicao: number;
		name: string;
		sales: number;
		revenue: number;
		avgTicket: number;
	}>;
	products: Array<{
		posicao: number;
		name: string;
		code: string;
		sales: number;
		revenue: number;
	}>;
	topCustomers: Array<{
		posicao: number;
		name: string;
		code: string;
		purchases: number;
		revenue: number;
	}>;
};

export type CommercialSalesByData = {
	salesByClient: Array<{ type: string; revenue: number }>;
	salesByCategory: Array<{ category: string; revenue: number }>;
	SalesByPayment: Array<{ method: string; revenue: number }>;
	salesByItemType: Array<{ type: string; revenue: number }>;
	salesByClientType: Array<{ type: string; clients: number; revenue: number }>;
	revenueOverTime: Array<{ label: string; revenue: number }>;
};

export type CommercialOriginData = {
	revenueByOrigin: Array<{ origin: string; revenue: number; fill: string }>;
	salesCountByOrigin: Array<{ origin: string; sales_count: number; fill: string }>;
	avgTicketByOrigin: Array<{ origin: string; avg_ticket: number; fill: string }>;
};

export type ResultsByOrganizationData = {
	result: Array<{
		organizationId: string;
		organization: string;
		revenue: number;
		salesCount: number;
		newCustomers: number;
	}>;
	historyOrganizations: Array<{ organizationId: string; organization: string }>;
	revenueByOrg: Array<Record<string, number | string>>;
	salesByOrg: Array<Record<string, number | string>>;
};

export const commercialBigNumbersResponseSchema = z.unknown().describe('Resposta dos indicadores comerciais do dashboard.');
export const commercialRankingsResponseSchema = z.unknown().describe('Resposta dos rankings comerciais do dashboard.');
export const commercialSalesByResponseSchema = z.unknown().describe('Resposta das dimensões comerciais do dashboard.');
export const commercialOriginDataResponseSchema = z.unknown().describe('Resposta das origens comerciais do dashboard.');
export const resultsByOrganizationResponseSchema = z.unknown().describe('Resposta do histórico por organização do dashboard.');

function withRange(filters: CommercialFilters, start: Date, end: Date) {
	const where: Record<string, unknown> = {
		data_pedido: { gte: start, lte: end },
	};

	if (filters.org !== 'all') where.organizationId = filters.org;
	if (filters.customerType !== 'all') where.customer = { personType: filters.customerType };
	if (filters.category !== 'all') where.items = { some: { product: { sector: filters.category } } };

	return where;
}

function itemRevenue(order: OrderRecord, category = 'all') {
	return order.items.reduce((total, item) => {
		if (category !== 'all' && item.product.sector !== category) return total;

		return total + item.totalValue;
	}, 0);
}

function totalRevenue(orders: OrderRecord[], category = 'all') {
	return orders.reduce((total, order) => total + itemRevenue(order, category), 0);
}

function roundMoney(value: number) {
	return Number(value.toFixed(2));
}

function diff(current: number, previous: number) {
	const difference = current - previous;

	return {
		difference,
		percent: previous === 0 ? 0 : roundMoney((difference / previous) * 100),
	};
}

function currentCustomerIds(orders: OrderRecord[]) {
	return Array.from(new Set(orders.map((order) => order.customerId).filter((id): id is string => Boolean(id))));
}

async function countCustomerHistory(customerIds: string[], before: Date, filters?: CommercialFilters) {
	if (!customerIds.length) return new Set<string>();

	const history = await prisma.pedido.findMany({
		where: { ...filters && withRange(filters, before, before), customerId: { in: customerIds }, data_pedido: { lt: before } },
		select: { customerId: true },
	});

	return new Set(history.flatMap((row) => row.customerId ? [row.customerId] : []));
}

async function readCommercialOrders(filters: CommercialFilters, start: Date, end: Date) {
	return prisma.pedido.findMany({
		where: withRange(filters, start, end),
		include: {
			items: { include: { product: true } },
			user: { select: { id: true, name: true } },
			customer: true,
			organization: { select: { id: true, name: true } },
			Origin: { select: { name: true } },
			paymentMethod: { select: { method: true } },
		},
	}) as unknown as Promise<OrderRecord[]>;
}

function summarizePeriod(orders: OrderRecord[], history: Set<string>, category: string, orderCounts?: Map<string | null, number>) {
	const revenue = totalRevenue(orders, category);
	const customers = currentCustomerIds(orders);
	const newCustomers = customers.filter((id) => !history.has(id) && (!orderCounts || orderCounts.get(id) === 1)).length;
	const recurringCustomers = customers.filter((id) => history.has(id)).length;
	const sales = orders.length;

	return {
		totalRevenue: revenue,
		averageTicket: sales ? roundMoney(revenue / sales) : 0,
		totalSales: sales,
		newCustomers,
		recurringCustomers,
		revenuePerCustomer: customers.length ? roundMoney(revenue / customers.length) : 0,
	};
}

export async function getCommercialBigNumbers(
	user: AuthorizedUser,
	filters: CommercialFilters,
): Promise<CommercialResponse<CommercialBigNumbersData>> {
	assertActiveUser(user);
	const range = resolveCivilDateRange(filters.startDate, filters.endDate);
	const [currentOrders, previousOrders] = await Promise.all([
		readCommercialOrders(filters, range.start, range.end),
		readCommercialOrders(filters, range.previousStart, range.previousEnd),
	]);
	const customerIds = currentCustomerIds(currentOrders);
	const [currentHistory, previousHistory, counts] = await Promise.all([
		countCustomerHistory(currentCustomerIds(currentOrders), range.start, filters),
		countCustomerHistory(currentCustomerIds(previousOrders), range.previousStart, filters),
		prisma.pedido.groupBy({ by: ['customerId'], where: { customerId: { in: customerIds } }, _count: { _all: true } }),
	]);
	const orderCounts = new Map(counts.map((row) => [row.customerId, row._count._all]));
	const current = summarizePeriod(currentOrders, currentHistory, filters.category, orderCounts);
	const previous = summarizePeriod(previousOrders, previousHistory, filters.category);
	const fields = [
		'totalRevenue',
		'averageTicket',
		'totalSales',
		'newCustomers',
		'recurringCustomers',
		'revenuePerCustomer',
	] as const;
	const differences = Object.fromEntries(fields.flatMap((field) => {
		const values = diff(current[field], previous[field]);
		return [[field, values.difference], [`${field}Pct`, values.percent]];
	})) as Record<string, number>;

	return { ok: true, data: { current, previous, diff: differences }, error: null };
}

function rankRows<T extends { revenue: number }>(rows: T[]) {
	let previousRevenue: number | undefined;
	let position = 0;

	return rows.slice().sort((left, right) => right.revenue - left.revenue).map((row, index) => {
		if (previousRevenue !== row.revenue) position = index + 1;
		previousRevenue = row.revenue;
		return { ...row, posicao: position };
	});
}

export async function getCommercialRankings(
	user: AuthorizedUser,
	filters: CommercialFilters,
): Promise<CommercialResponse<CommercialRankingsData>> {
	assertActiveUser(user);
	const range = resolveCivilDateRange(filters.startDate, filters.endDate);
	const orders = await readCommercialOrders(filters, range.start, range.end);
	const sellers = new Map<string, { name: string; sales: number; revenue: number }>();
	const products = new Map<string, { name: string; code: string; sales: number; revenue: number }>();
	const customers = new Map<string, { name: string; code: string; purchases: number; revenue: number }>();

	for (const order of orders) {
		const sellerId = order.userId;
		const seller = sellers.get(sellerId) ?? { name: order.user?.name ?? 'Unknown', sales: 0, revenue: 0 };
		seller.sales += 1;
		seller.revenue += itemRevenue(order, filters.category);
		sellers.set(sellerId, seller);

		if (order.customerId) {
			const customer = customers.get(order.customerId) ?? {
				name: order.customer?.name ?? 'Unknown',
				code: String(order.customer?.externalCode ?? 0).padStart(2, '0'),
				purchases: 0,
				revenue: 0,
			};
			customer.purchases += 1;
			customer.revenue += itemRevenue(order, filters.category);
			customers.set(order.customerId, customer);
		}

		for (const item of order.items) {
			if (filters.category !== 'all' && item.product.sector !== filters.category) continue;

			const product = products.get(item.product.id) ?? {
				name: item.product.description,
				code: String(item.product.external_code ?? '00'),
				sales: 0,
				revenue: 0,
			};
			product.sales += item.quantity;
			product.revenue += item.totalValue;
			products.set(item.product.id, product);
		}
	}

	const sellerRows = Array.from(sellers, ([, row]) => ({
		...row,
		avgTicket: row.sales ? roundMoney(row.revenue / row.sales) : 0,
	}));
	const sellerRankings = rankRows(sellerRows).slice(0, 5);
	const productRankings = rankRows(Array.from(products, ([, row]) => row)).filter((row) => row.sales > 0).slice(0, 5);
	const customerRankings = rankRows(Array.from(customers, ([, row]) => row)).slice(0, 5);

	return {
		ok: true,
		data: {
			sellers: sellerRankings,
			products: productRankings,
			topCustomers: customerRankings,
		},
		error: null,
	};
}

function addAmount(map: Map<string, number>, key: string, amount: number) {
	map.set(key, (map.get(key) ?? 0) + amount);
}

export async function getCommercialSalesBy(
	user: AuthorizedUser,
	filters: CommercialFilters,
): Promise<CommercialResponse<CommercialSalesByData>> {
	assertActiveUser(user);
	const range = resolveCivilDateRange(filters.startDate, filters.endDate);
	const orders = await readCommercialOrders(filters, range.start, range.end);
	const client = new Map<string, number>([['FISICA', 0], ['JURIDICA', 0]]);
	const category = new Map<string, number>();
	const payment = new Map<string, number>();
	const itemType = new Map<string, number>();
	const timeline = new Map<string, number>();

	for (const order of orders) {
		if (!order.customer || !order.items.length) continue;

		const revenue = itemRevenue(order, filters.category);
		addAmount(client, order.customer.personType, revenue);
		if (order.paymentMethod) {
			const paymentMethod = order.paymentMethod.method.includes(',') ? 'Múltiplos' : order.paymentMethod.method;
			addAmount(payment, paymentMethod, revenue);
		}
		const label = range.inclusiveDays > 30
			? order.data_pedido.toISOString().slice(0, 7)
			: order.data_pedido.toISOString().slice(0, 10);
		addAmount(timeline, label, revenue);

		for (const item of order.items) {
			if (filters.category !== 'all' && item.product.sector !== filters.category) continue;

			addAmount(category, item.product.sector, item.totalValue);
			addAmount(itemType, item.product.external_code === 1459 ? 'Serviço' : 'Produto', item.totalValue);
		}
	}

	const previousCustomers = await countCustomerHistory(currentCustomerIds(orders), range.start);
	const clientTypes = new Map<string, { clients: Set<string>; revenue: number }>([
		['Novo', { clients: new Set<string>(), revenue: 0 }],
		['Recorrente', { clients: new Set<string>(), revenue: 0 }],
	]);
	for (const order of orders) {
		if (!order.customerId || !order.customer) continue;

		const type = previousCustomers.has(order.customerId) ? 'Recorrente' : 'Novo';
		const current = clientTypes.get(type)!;
		current.clients.add(order.customerId);
		current.revenue += itemRevenue(order, filters.category);
	}

	return {
		ok: true,
		data: {
			salesByClient: Array.from(client, ([type, revenue]) => ({ type, revenue })),
			salesByCategory: Array.from(category, ([categoryName, revenue]) => ({ category: categoryName, revenue })).sort((a, b) => b.revenue - a.revenue),
			SalesByPayment: Array.from(payment, ([method, revenue]) => ({ method, revenue })).sort((a, b) => b.revenue - a.revenue),
			salesByItemType: Array.from(itemType, ([type, revenue]) => ({ type, revenue })),
			salesByClientType: Array.from(clientTypes, ([type, values]) => ({ type, clients: values.clients.size, revenue: values.revenue })),
			revenueOverTime: Array.from(timeline, ([label, revenue]) => ({ label, revenue })).sort((a, b) => a.label.localeCompare(b.label)),
		},
		error: null,
	};
}

function originGroup(name: string | undefined) {
	const value = (name ?? '').toLowerCase();
	const rules: Array<[string, string]> = [
		['google', 'Google'],
		['meta', 'Meta'],
		['balcão', 'Balcão'],
		['indicação', 'Indicação'],
		['boa dica', 'Boa_Dica'],
		['comercial ativo', 'Comercial_Ativo'],
		['cliente recorrente', 'Comercial_Ativo'],
	];
	return rules.find(([needle]) => value.includes(needle))?.[1] ?? 'Desconhecido';
}

export async function getCommercialOriginData(
	user: AuthorizedUser,
	filters: CommercialFilters,
): Promise<CommercialResponse<CommercialOriginData>> {
	assertActiveUser(user);
	const range = resolveCivilDateRange(filters.startDate, filters.endDate);
	const orders = await readCommercialOrders(filters, range.start, range.end);
	const groups = new Map<string, { revenue: number; sales: number }>();

	for (const order of orders) {
		if (!order.items.length) continue;

		const origin = originGroup(order.Origin?.name);
		const current = groups.get(origin) ?? { revenue: 0, sales: 0 };
		current.revenue += itemRevenue(order, filters.category);
		current.sales += 1;
		groups.set(origin, current);
	}

	const rows = Array.from(groups, ([origin, values]) => ({ origin, ...values })).sort((a, b) => b.revenue - a.revenue);

	return {
		ok: true,
		data: {
			revenueByOrigin: rows.map(({ origin, revenue }) => ({ origin, revenue, fill: `var(--color-${origin})` })),
			salesCountByOrigin: rows.map(({ origin, sales }) => ({ origin, sales_count: sales, fill: `var(--color-${origin})` })),
			avgTicketByOrigin: rows.map(({ origin, revenue, sales }) => ({ origin, avg_ticket: sales ? revenue / sales : 0, fill: `var(--color-${origin})` })),
		},
		error: null,
	};
}

export async function getResultsByOrganization(
	user: AuthorizedUser,
	filters: PeriodFilters,
): Promise<CommercialResponse<ResultsByOrganizationData>> {
	assertActiveUser(user);
	const range = resolveCivilDateRange(filters.startDate, filters.endDate);
	const orders = await prisma.pedido.findMany({
		where: { data_pedido: { gte: range.start, lte: range.end }, cancelled: false },
		include: {
			items: true,
			organization: { select: { id: true, name: true } },
			customer: { select: { id: true } },
		},
	}) as unknown as Array<OrderRecord & { organization: { id: string; name: string }; customer: { id: string } | null }>;
	const customerIds = Array.from(new Set(orders.flatMap((order) => order.customer?.id ? [order.customer.id] : [])));
	const customerHistory = customerIds.length
		? await prisma.pedido.findMany({
			where: { customerId: { in: customerIds }, cancelled: false },
			select: { customerId: true, data_pedido: true },
		})
		: [];
	const customerStats = new Map<string, { count: number; first: Date; last: Date }>();

	for (const row of customerHistory) {
		if (!row.customerId) continue;

		const current = customerStats.get(row.customerId);
		if (!current) {
			customerStats.set(row.customerId, { count: 1, first: row.data_pedido, last: row.data_pedido });
			continue;
		}

		current.count += 1;
		if (row.data_pedido < current.first) current.first = row.data_pedido;
		if (row.data_pedido > current.last) current.last = row.data_pedido;
	}

	const byOrganization = new Map<string, { organization: string; revenue: number; salesCount: number; newCustomers: Set<string> }>();
	const revenueByPeriod = new Map<string, Map<string, number>>();
	const salesByPeriod = new Map<string, Map<string, number>>();
	const groupedByMonth = range.inclusiveDays > 30;

	for (const order of orders) {
		const current = byOrganization.get(order.organization.id) ?? {
			organization: order.organization.name,
			revenue: 0,
			salesCount: 0,
			newCustomers: new Set<string>(),
		};
		current.revenue += itemRevenue(order);
		current.salesCount += 1;
		if (order.customer?.id) {
			const stats = customerStats.get(order.customer.id);
			const isNew = stats
				&& stats.count === 1
				&& stats.first >= range.start
				&& stats.last <= range.end;

			if (isNew) current.newCustomers.add(order.customer.id);
		}
		byOrganization.set(order.organization.id, current);

		const period = groupedByMonth
			? order.data_pedido.toISOString().slice(0, 7)
			: order.data_pedido.toISOString().slice(0, 10);
		const revenuePeriod = revenueByPeriod.get(period) ?? new Map<string, number>();
		revenuePeriod.set(order.organization.id, (revenuePeriod.get(order.organization.id) ?? 0) + itemRevenue(order));
		revenueByPeriod.set(period, revenuePeriod);
		const salesPeriod = salesByPeriod.get(period) ?? new Map<string, number>();
		salesPeriod.set(order.organization.id, (salesPeriod.get(order.organization.id) ?? 0) + 1);
		salesByPeriod.set(period, salesPeriod);
	}

	const result = Array.from(byOrganization, ([organizationId, value]) => ({
		organizationId,
		organization: value.organization,
		revenue: value.revenue,
		salesCount: value.salesCount,
		newCustomers: value.newCustomers.size,
	}));
	const historyOrganizations = result.map(({ organizationId, organization }) => ({ organizationId, organization }));
	const revenueByOrg = Array.from(revenueByPeriod, ([period, values]) => ({ period, ...Object.fromEntries(values) })).sort((a, b) => a.period.localeCompare(b.period));
	const salesByOrg = Array.from(salesByPeriod, ([period, values]) => ({ period, ...Object.fromEntries(values) })).sort((a, b) => a.period.localeCompare(b.period));

	return { ok: true, data: { result, historyOrganizations, revenueByOrg, salesByOrg }, error: null };
}

export function parseCommercialFilters(input: Record<string, string | undefined>) {
	return commercialFiltersSchema.parse({
		startDate: input.startDate,
		endDate: input.endDate,
		category: input.category ?? 'all',
		customerType: input.customerType ?? 'all',
		org: input.org ?? 'all',
	});
}
