/** @format */

import { prisma } from '@/lib/prisma';
import { addMonths } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const startOfNextMonth = addMonths(startOfMonth, 1);

		// 1) Metas do mês atual
		const currentGoals = await prisma.salesGoal.findMany({
			where: { goalDateRef: { gte: startOfMonth, lt: startOfNextMonth } },
			include: { seller: { select: { id: true, name: true } } },
		});

		// 2) Histórico (até fim do mês atual)
		const allGoals = await prisma.salesGoal.findMany({
			where: { goalDateRef: { lt: startOfNextMonth } },
			include: { seller: { select: { id: true, name: true } } },
			orderBy: { goalDateRef: 'asc' },
		});

		// 3. Meta geral da empresa (soma das metas individuais)
		const companyAgg = await prisma.salesGoal.aggregate({
			_sum: { revenue: true },
			where: {
				goalDateRef: { gte: startOfMonth, lt: startOfNextMonth },
			},
		});
		const companyGoal = companyAgg._sum.revenue ?? 0;

		// 5. Agrupa histórico por mês (MM/yyyy)
		const historyMap: Record<
			string,
			Array<{
				sellerId: string;
				sellerName: string;
				revenue: number;
				month: string;
			}>
		> = {};
		for (const g of allGoals) {
			const month = g.goalDateRef.toISOString().slice(0, 7);
			historyMap[month] ??= [];
			historyMap[month].push({
				sellerId: g.userId,
				sellerName: g.seller.name,
				revenue: g.revenue,
				month: month,
			});
		}

		const history = Object.entries(historyMap).map(([month, goals]) => ({
			month,
			goals,
		}));

		return NextResponse.json({
			ok: true,
			error: null,
			companyGoal,
			currentGoals: currentGoals.map((g) => ({
				sellerId: g.userId,
				sellerName: g.seller.name,
				revenue: g.revenue,
				monthRef: g.goalDateRef,
			})),
			history,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error(err);
		return NextResponse.json(
			{ ok: false, error: err.message },
			{ status: 500 },
		);
	}
}
