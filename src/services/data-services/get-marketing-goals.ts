/** @format */

import 'server-only';
import { Prisma } from '@prisma/client';
import type { GoogleAdsScope } from '@/lib/google-ads-account';
import { prisma } from '@/lib/prisma';
import { formatBusinessCivilDate } from '@/services/data-services/civil-date-range';
import {
	getClosedMonthlyGoogleAdsCosts,
	getCurrentMonthlyGoogleAdsCosts,
	type MonthlyGoogleAdsCosts,
} from '@/services/google-services/get-monthly-ads-costs';

type MonthlyRevenueRow = { month: string; revenue: number };
type GoalRecord = Awaited<ReturnType<typeof prisma.roasGoal.findMany>>[number];
type HistoryGoal = Omit<GoalRecord, 'goalDateRef' | 'createdAt' | 'updatedAt'> & {
	goalDateRef: string;
	createdAt: string;
	updatedAt: string;
	faturamento: number;
	custo: number;
	roasAtingido: number | null;
};

export type MarketingGoalsResponse = {
	ok: boolean;
	data: HistoryGoal[] | null;
	bigNumbers: {
		metaAtual: number | null;
		roasAtingido: number | null;
		roasPrevisto: number | null;
	} | null;
	error: string | null;
	status: number;
};

function addMonths(month: string, amount: number) {
	const date = new Date(`${month}-01T00:00:00.000Z`);
	date.setUTCMonth(date.getUTCMonth() + amount);
	return date.toISOString().slice(0, 7);
}

function previousDay(date: string) {
	const value = new Date(`${date}T00:00:00.000Z`);
	value.setUTCDate(value.getUTCDate() - 1);
	return value.toISOString().slice(0, 10);
}

function goalMonth(goal: GoalRecord) {
	return goal.goalDateRef.toISOString().slice(0, 7);
}

function ratio(revenue: number, cost: number) {
	return cost === 0 ? null : revenue / cost;
}

function serializeGoal(
	goal: GoalRecord,
	values: Pick<HistoryGoal, 'faturamento' | 'custo' | 'roasAtingido'>,
): HistoryGoal {
	return {
		...goal,
		goalDateRef: goal.goalDateRef.toISOString(),
		createdAt: goal.createdAt.toISOString(),
		updatedAt: goal.updatedAt.toISOString(),
		...values,
	};
}

async function loadMarketingGoals(
	scope: GoogleAdsScope,
	now: Date,
): Promise<MarketingGoalsResponse> {
	const goals = await prisma.roasGoal.findMany({
		orderBy: { goalDateRef: 'desc' },
	});
	if (!goals.length) {
		return {
			ok: false,
			data: null,
			bigNumbers: null,
			error: 'Nenhuma meta encontrada',
			status: 404,
		};
	}

	const today = formatBusinessCivilDate(now);
	const currentMonth = today.slice(0, 7);
	const currentMonthStart = `${currentMonth}-01`;
	const nextMonthStart = `${addMonths(currentMonth, 1)}-01`;
	const relevantGoals = goals.filter((goal) => goalMonth(goal) <= currentMonth);
	const oldestRelevantMonth = relevantGoals.at(-1)
		? goalMonth(relevantGoals.at(-1)!)
		: currentMonth;
	const closedGoals = relevantGoals.filter((goal) => goalMonth(goal) < currentMonth);
	const oldestClosedMonth = closedGoals.at(-1)
		? goalMonth(closedGoals.at(-1)!)
		: null;

	const revenuePromise = prisma.$queryRaw<MonthlyRevenueRow[]>(Prisma.sql`
		SELECT
			to_char(p."data_pedido", 'YYYY-MM') AS "month",
			COALESCE(SUM(si."total_value"), 0)::double precision AS "revenue"
		FROM "SaleItem" si
		INNER JOIN "Pedido" p ON p."id" = si."sale_id"
		INNER JOIN "Origin" o ON o."id" = p."origin_id"
		WHERE p."data_pedido" >= ${`${oldestRelevantMonth}-01`}::date
			AND p."data_pedido" < ${nextMonthStart}::date
			AND o."name" ILIKE ${'%google%'}
		GROUP BY to_char(p."data_pedido", 'YYYY-MM')
	`);
	const closedCostsPromise: Promise<MonthlyGoogleAdsCosts> = oldestClosedMonth
		? getClosedMonthlyGoogleAdsCosts(
				scope,
				`${oldestClosedMonth}-01`,
				previousDay(currentMonthStart),
			)
		: Promise.resolve({});
	const currentCostsPromise = getCurrentMonthlyGoogleAdsCosts(
		scope,
		currentMonthStart,
		today,
	);
	const [revenueRows, closedCosts, currentCosts] = await Promise.all([
		revenuePromise,
		closedCostsPromise,
		currentCostsPromise,
	]);

	const revenueByMonth = new Map(
		revenueRows.map((row) => [row.month, Number(row.revenue ?? 0)]),
	);
	const history = goals.map((goal) => {
		const month = goalMonth(goal);
		const isFuture = month > currentMonth;
		const faturamento = isFuture ? 0 : (revenueByMonth.get(month) ?? 0);
		const custo = isFuture
			? 0
			: month === currentMonth
				? (currentCosts[month] ?? 0)
				: (closedCosts[month] ?? 0);
		return serializeGoal(goal, {
			faturamento,
			custo,
			roasAtingido: ratio(faturamento, custo),
		});
	});
	const latestNonFuture = history.find(
		(goal) => goal.goalDateRef.slice(0, 7) <= currentMonth,
	);
	const currentRevenue = revenueByMonth.get(currentMonth) ?? 0;
	const currentCost = currentCosts[currentMonth] ?? 0;

	return {
		ok: true,
		data: history,
		bigNumbers: {
			metaAtual: latestNonFuture?.roas ?? null,
			roasAtingido: latestNonFuture?.roasAtingido ?? null,
			roasPrevisto: ratio(currentRevenue, currentCost),
		},
		error: null,
		status: 200,
	};
}

export function createMarketingGoalLoaders(
	scope: GoogleAdsScope = 'products',
	now: Date = new Date(),
) {
	const response = loadMarketingGoals(scope, now);
	return {
		response,
		bigNumbers: response.then(({ ok, bigNumbers, error }) => ({
			ok,
			bigNumbers,
			error,
		})),
		history: response.then(({ ok, data, error }) => ({ ok, data, error })),
	};
}
