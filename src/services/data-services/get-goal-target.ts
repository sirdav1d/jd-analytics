/** @format */

import 'server-only';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { formatBusinessCivilDate } from '@/services/data-services/civil-date-range';

type MonthlySalesRow = {
	userId: string;
	month: string;
	realized: number;
};

function startOfNextCivilMonth(month: string) {
	const start = new Date(`${month}-01T00:00:00.000Z`);
	start.setUTCMonth(start.getUTCMonth() + 1);
	return start.toISOString().slice(0, 10);
}

function monthFromDate(date: Date) {
	return date.toISOString().slice(0, 7);
}

function monthReference(month: string) {
	return `${month}-01T00:00:00.000Z`;
}

export async function FetchGoalTargetData(now: Date = new Date()) {
	const today = formatBusinessCivilDate(now);
	const currentMonth = today.slice(0, 7);
	const currentMonthStart = `${currentMonth}-01`;
	const nextMonthStart = startOfNextCivilMonth(currentMonth);

	const goals = await prisma.salesGoal.findMany({
		where: {
			goalDateRef: { lt: new Date(`${nextMonthStart}T00:00:00.000Z`) },
			seller: { isActive: true },
		},
		include: { seller: { select: { id: true, name: true } } },
		orderBy: [{ goalDateRef: 'asc' }, { userId: 'asc' }],
	});

	const oldestGoalDate = goals[0]?.goalDateRef.toISOString().slice(0, 10);
	const salesStartDate = oldestGoalDate ?? currentMonthStart;
	const monthlySales = await prisma.$queryRaw<MonthlySalesRow[]>(Prisma.sql`
		SELECT
			p."userId" AS "userId",
			to_char(p."data_pedido", 'YYYY-MM') AS "month",
			COALESCE(SUM(si."total_value"), 0)::double precision AS "realized"
		FROM "SaleItem" si
		INNER JOIN "Pedido" p ON p."id" = si."sale_id"
		INNER JOIN "User" u ON u."id" = p."userId"
		WHERE p."data_pedido" >= ${salesStartDate}::date
			AND p."data_pedido" < ${nextMonthStart}::date
			AND u."isActive" = true
		GROUP BY p."userId", to_char(p."data_pedido", 'YYYY-MM')
	`);

	const realizedBySellerMonth = new Map<string, number>();
	let currentRealized = 0;
	for (const row of monthlySales) {
		const realized = Number(row.realized ?? 0);
		realizedBySellerMonth.set(`${row.userId}:${row.month}`, realized);
		if (row.month === currentMonth) currentRealized += realized;
	}

	const currentGoals = goals
		.filter((goal) => monthFromDate(goal.goalDateRef) === currentMonth)
		.map((goal) => ({
			goalId: goal.id,
			sellerId: goal.userId,
			sellerName: goal.seller.name,
			monthRef: monthReference(currentMonth),
			revenue: goal.revenue,
			realized:
				realizedBySellerMonth.get(`${goal.userId}:${currentMonth}`) ?? 0,
		}));

	const meta = currentGoals.reduce((total, goal) => total + goal.revenue, 0);
	const elapsedDays = Number(today.slice(-2));
	const [year, month] = currentMonth.split('-').map(Number);
	const totalDaysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
	const predicted = elapsedDays
		? (currentRealized / elapsedDays) * totalDaysInMonth
		: 0;

	const historyMap = new Map<
		string,
		Array<{
			sellerId: string;
			sellerName: string;
			revenue: number;
			realized: number;
			month: string;
		}>
	>();

	for (const goal of goals) {
		const month = monthFromDate(goal.goalDateRef);
		const monthRef = monthReference(month);
		const monthlyGoals = historyMap.get(monthRef) ?? [];
		monthlyGoals.push({
			sellerId: goal.userId,
			sellerName: goal.seller.name,
			revenue: goal.revenue,
			month,
			realized: realizedBySellerMonth.get(`${goal.userId}:${month}`) ?? 0,
		});
		historyMap.set(monthRef, monthlyGoals);
	}

	return {
		ok: true,
		error: null,
		companyGoal: {
			meta,
			realized: currentRealized,
			remaining: Math.max(meta - currentRealized, 0),
			predicted,
		},
		currentGoals,
		history: Array.from(historyMap, ([month, monthlyGoals]) => ({
			month,
			goals: monthlyGoals,
		})),
	};
}
