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

function createContext(goals: GoalRecord[], now: Date) {
	const today = formatBusinessCivilDate(now);
	const currentMonth = today.slice(0, 7);
	const currentMonthStart = `${currentMonth}-01`;
	const nextMonthStart = `${addMonths(currentMonth, 1)}-01`;
	const relevantGoals = goals.filter((goal) => goalMonth(goal) <= currentMonth);
	const closedGoals = relevantGoals.filter((goal) => goalMonth(goal) < currentMonth);
	const oldestClosedMonth = closedGoals.at(-1)
		? goalMonth(closedGoals.at(-1)!)
		: null;
	return {
		goals,
		today,
		currentMonth,
		currentMonthStart,
		nextMonthStart,
		relevantGoals,
		oldestRelevantMonth: relevantGoals.at(-1)
			? goalMonth(relevantGoals.at(-1)!)
			: null,
		oldestClosedMonth,
	};
}

export function createMarketingGoalLoaders(
	scope: GoogleAdsScope = 'products',
	now: Date = new Date(),
) {
	const goalsPromise = prisma.roasGoal.findMany({
		orderBy: { goalDateRef: 'desc' },
	});
	const contextPromise = goalsPromise.then((goals) => createContext(goals, now));

	const revenuePromise = contextPromise.then((context) => {
		if (!context.oldestRelevantMonth) return [];
		return prisma.$queryRaw<MonthlyRevenueRow[]>(Prisma.sql`
			SELECT
				to_char(p."data_pedido", 'YYYY-MM') AS "month",
				COALESCE(SUM(si."total_value"), 0)::double precision AS "revenue"
			FROM "SaleItem" si
			INNER JOIN "Pedido" p ON p."id" = si."sale_id"
			INNER JOIN "Origin" o ON o."id" = p."origin_id"
			WHERE p."data_pedido" >= ${`${context.oldestRelevantMonth}-01`}::date
				AND p."data_pedido" < ${context.nextMonthStart}::date
				AND o."name" ILIKE ${'%google%'}
			GROUP BY to_char(p."data_pedido", 'YYYY-MM')
		`);
	});
	const revenueByMonthPromise = revenuePromise.then(
		(rows) =>
			new Map(rows.map((row) => [row.month, Number(row.revenue ?? 0)])),
	);
	const currentCostsPromise: Promise<MonthlyGoogleAdsCosts> = contextPromise.then((context) => {
		if (!context.relevantGoals.length) return {};
		return getCurrentMonthlyGoogleAdsCosts(
			scope,
			context.currentMonthStart,
			context.today,
		);
	});
	const closedCostsPromise: Promise<MonthlyGoogleAdsCosts> = contextPromise.then(
		(context) => {
			if (!context.oldestClosedMonth) return {};
			return getClosedMonthlyGoogleAdsCosts(
				scope,
				`${context.oldestClosedMonth}-01`,
				previousDay(context.currentMonthStart),
			);
		},
	);

	const bigNumbers = Promise.all([
		contextPromise,
		revenueByMonthPromise,
		currentCostsPromise,
	]).then(([context, revenueByMonth, currentCosts]) => {
		if (!context.goals.length) {
			return { ok: false, bigNumbers: null, error: 'Nenhuma meta encontrada' };
		}
		if (!context.relevantGoals.length) {
			return {
				ok: true,
				bigNumbers: {
					metaAtual: null,
					roasAtingido: null,
					roasPrevisto: null,
				},
				error: null,
			};
		}
		const currentGoal = context.relevantGoals.find(
			(goal) => goalMonth(goal) === context.currentMonth,
		);
		const currentRevenue = revenueByMonth.get(context.currentMonth) ?? 0;
		const currentCost = currentCosts[context.currentMonth] ?? 0;
		const currentRoas = ratio(currentRevenue, currentCost);
		return {
			ok: true,
			bigNumbers: {
				metaAtual: currentGoal?.roas ?? null,
				roasAtingido: currentRoas,
				roasPrevisto: currentRoas,
			},
			error: null,
		};
	});

	const history = Promise.all([
		contextPromise,
		revenueByMonthPromise,
		currentCostsPromise,
		closedCostsPromise,
	]).then(([context, revenueByMonth, currentCosts, closedCosts]) => {
		if (!context.goals.length) {
			return { ok: false, data: null, error: 'Nenhuma meta encontrada' };
		}
		return {
			ok: true,
			data: context.goals.map((goal) => {
				const month = goalMonth(goal);
				const isFuture = month > context.currentMonth;
				const faturamento = isFuture ? 0 : (revenueByMonth.get(month) ?? 0);
				const custo = isFuture
					? 0
					: month === context.currentMonth
						? (currentCosts[month] ?? 0)
						: (closedCosts[month] ?? 0);
				return serializeGoal(goal, {
					faturamento,
					custo,
					roasAtingido: ratio(faturamento, custo),
				});
			}),
			error: null,
		};
	});

	const response: Promise<MarketingGoalsResponse> = Promise.all([
		contextPromise,
		bigNumbers,
		history,
	]).then(([context, bigNumbersResult, historyResult]) => {
		if (!context.goals.length) {
			return {
				ok: false,
				data: null,
				bigNumbers: null,
				error: 'Nenhuma meta encontrada',
				status: 404,
			};
		}
		return {
			ok: true,
			data: historyResult.data,
			bigNumbers: bigNumbersResult.bigNumbers,
			error: null,
			status: 200,
		};
	});

	return {
		response,
		bigNumbers,
		history,
	};
}
