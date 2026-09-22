import 'server-only';

import { Prisma } from '@prisma/client';
import { assertActiveUser, type AuthorizedUser } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import type { GoogleAdsScope } from '@/lib/google-ads-account';
import {
	formatBusinessCivilDate,
	resolveCivilDateRange,
} from '@/services/data-services/civil-date-range';
import { getMarketingReportAggregate } from '@/services/marketing-report/get-marketing-report-aggregate';

export { getCommercialGoalTargets } from '@/services/data-services/get-goal-target';
export { getMarketingGoals } from '@/services/data-services/get-marketing-goals';

export const goalsCurrentResponseSchema = { _type: 'goals-current' } as const;
export const goalTrackingResponseSchema = { _type: 'goal-tracking' } as const;

export type GoalsCurrentResponse = {
	ok: true;
	data: {
		commercial: {
			currentRevenue: number;
			revenueGoal: number;
			difference: number;
			percentage: number;
		};
		roas: {
			currentRoas: number;
			roasTarget: number;
			difference: number;
			percentage: number;
		};
	};
	error: null;
};

export async function getGoalsCurrent(
	user: AuthorizedUser,
	scope: GoogleAdsScope = 'products',
): Promise<GoalsCurrentResponse> {
	assertActiveUser(user);
	void scope;
	const todayCivil = formatBusinessCivilDate();
	const [year, month, day] = todayCivil.split('-').map(Number);
	const monthStart = new Date(Date.UTC(year, month - 1, 1));
	const nextMonthStart = new Date(Date.UTC(year, month, 1));
	const today = new Date(Date.UTC(year, month - 1, day));
	const [salesGoals, currentOrders, roasGoal] = await Promise.all([
		prisma.salesGoal.findMany({
			where: { goalDateRef: { gte: monthStart, lt: nextMonthStart } },
		}),
		prisma.pedido.findMany({
			where: { data_pedido: { gte: monthStart, lte: today }, cancelled: false },
			include: { items: true },
		}),
		prisma.roasGoal.findFirst({
			where: { goalDateRef: { gte: monthStart, lt: nextMonthStart } },
		}),
	]);
	const revenueGoal = salesGoals.reduce((total, goal) => total + goal.revenue, 0);
	const currentRevenue = currentOrders.reduce(
		(total, order) => total + order.items.reduce((sum, item) => sum + item.totalValue, 0),
		0,
	);
	const roasTarget = roasGoal?.roas ?? 0;
	const aggregate = await getMarketingReportAggregate({ date: todayCivil });
	const currentRoas = aggregate.ok ? aggregate.data.roasGeral : 0;

	return {
		ok: true,
		data: {
			commercial: {
				currentRevenue,
				revenueGoal,
				difference: currentRevenue - revenueGoal,
				percentage: revenueGoal > 0 ? (currentRevenue / revenueGoal) * 100 : 0,
			},
			roas: {
				currentRoas,
				roasTarget,
				difference: currentRoas - roasTarget,
				percentage: roasTarget > 0 ? (currentRoas / roasTarget) * 100 : 0,
			},
		},
		error: null,
	};
}

function getCivilMonthBounds(civilDate: string) {
	const [year, month] = civilDate.split('-').map(Number);
	const start = new Date(Date.UTC(year, month - 1, 1));
	const next = new Date(Date.UTC(year, month, 1));
	const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();

	return { start, next, totalDays };
}

export type GoalTrackingResponse = {
	ok: true;
	overview: Array<{
		vendedor: string;
		totalRevenue: number;
		meta: number;
		orderCount: number;
		avgTicket: number;
		forecast: number;
		percentualDif: number;
	}>;
	timeSeries: Array<{ period: string; revenue: number }>;
	companySummary: { meta: number; realizado: number; forecast: number; diffPercent: number };
	error: null;
};

export async function getGoalTracking(
	user: AuthorizedUser,
	filters: { startDate: string; endDate: string },
): Promise<GoalTrackingResponse> {
	assertActiveUser(user);
	const businessToday = formatBusinessCivilDate();
	const startParam = filters.startDate;
	const endParam = filters.endDate;
	const range = resolveCivilDateRange(startParam, endParam);
	const useDaily = range.inclusiveDays <= 30;
	const selectedMonthStart = getCivilMonthBounds(startParam).start;
	const selectedMonthEndExclusive = getCivilMonthBounds(endParam).next;
	const currentMonth = getCivilMonthBounds(businessToday);
	const isCurrentMonthToDate = startParam === `${businessToday.slice(0, 7)}-01` && endParam === businessToday;
	const forecastMultiplier = isCurrentMonthToDate ? currentMonth.totalDays / range.inclusiveDays : 1;
	const rawOverview = await prisma.pedido.groupBy({
		by: ['userId'],
		where: { data_pedido: { gte: range.start, lte: range.end } },
		_count: { id: true },
	});
	const overviewRows = await Promise.all(rawOverview.map(async (item) => {
		const seller = await prisma.user.findUnique({ where: { id: item.userId }, select: { name: true } });
		if (!seller) return null;
		const [revenue, goalAgg] = await Promise.all([
			prisma.saleItem.aggregate({ _sum: { totalValue: true }, where: { sale: { userId: item.userId, data_pedido: { gte: range.start, lte: range.end } } } }),
			prisma.salesGoal.aggregate({ _sum: { revenue: true }, where: { userId: item.userId, goalDateRef: { gte: selectedMonthStart, lt: selectedMonthEndExclusive } } }),
		]);
		const totalRevenue = revenue._sum.totalValue ?? 0;
		const meta = goalAgg._sum.revenue ?? 0;
		const orderCount = item._count.id;
		const forecast = totalRevenue * forecastMultiplier;

		return {
			vendedor: seller.name,
			totalRevenue,
			meta,
			orderCount,
			avgTicket: orderCount ? totalRevenue / orderCount : 0,
			forecast,
			percentualDif: meta > 0 ? (forecast / meta) * 100 : 100,
		};
	}));
	const overview = overviewRows.filter((row): row is NonNullable<typeof row> => row !== null).sort((left, right) => right.totalRevenue - left.totalRevenue);
	const timeSeries = useDaily
		? await prisma.$queryRaw<Array<{ period: string; revenue: number }>>(Prisma.sql`
			WITH days AS (
				SELECT generate_series(CAST(${startParam} AS date), CAST(${endParam} AS date), '1 day'::interval) AS day
			), agg AS (
				SELECT date_trunc('day', p.data_pedido)::date AS day, SUM(si.total_value)::float AS revenue
				FROM "Pedido" p JOIN "SaleItem" si ON si.sale_id = p.id
				WHERE p.data_pedido BETWEEN CAST(${startParam} AS date) AND CAST(${endParam} AS date)
				GROUP BY day
			)
			SELECT to_char(days.day, 'YYYY-MM-DD') AS period, COALESCE(agg.revenue, 0) AS revenue
			FROM days LEFT JOIN agg ON days.day = agg.day ORDER BY days.day
		`)
		: await prisma.$queryRaw<Array<{ period: string; revenue: number }>>(Prisma.sql`
			SELECT to_char(date_trunc('month', p.data_pedido), 'YYYY-MM') AS period, SUM(si.total_value)::float AS revenue
			FROM "Pedido" p JOIN "SaleItem" si ON si.sale_id = p.id
			WHERE p.data_pedido BETWEEN CAST(${startParam} AS date) AND CAST(${endParam} AS date)
			GROUP BY period ORDER BY period
		`);
	const [salesGoalSum, salesSum] = await Promise.all([
		prisma.salesGoal.aggregate({ _sum: { revenue: true }, where: { goalDateRef: { gte: selectedMonthStart, lt: selectedMonthEndExclusive } } }),
		prisma.saleItem.aggregate({ _sum: { totalValue: true }, where: { sale: { data_pedido: { gte: range.start, lte: range.end } } } }),
	]);
	const realizado = salesSum._sum.totalValue ?? 0;
	const forecast = realizado * forecastMultiplier;
	const meta = salesGoalSum._sum.revenue ?? 0;

	return {
		ok: true,
		overview,
		timeSeries,
		companySummary: { meta, realizado, forecast, diffPercent: meta > 0 ? (forecast / meta) * 100 : 0 },
		error: null,
	};
}
