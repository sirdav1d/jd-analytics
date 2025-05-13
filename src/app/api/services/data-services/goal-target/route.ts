/** @format */

import { prisma } from '@/lib/prisma';
import { addMonths } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const startOfNextMonth = addMonths(startOfMonth, 1);

		const companyAgg = await prisma.salesGoal.aggregate({
			_sum: { revenue: true },
			where: {
				goalDateRef: { gte: startOfMonth, lt: startOfNextMonth },
			},
		});
		const companyGoal = companyAgg._sum.revenue ?? 0;

		// 3. Busca metas individuais do mês atual
		const goals = await prisma.salesGoal.findMany({
			where: {
				goalDateRef: { gte: startOfMonth, lt: startOfNextMonth },
			},
			include: {
				seller: { select: { id: true, name: true } },
			},
			orderBy: { userId: 'asc' },
		});

		const currentGoals = await Promise.all(
			goals.map(async (g) => {
				// soma de faturamento realizado no mês para este vendedor
				const soldAgg = await prisma.saleItem.aggregate({
					_sum: { totalValue: true },
					where: {
						sale: {
							userId: g.userId,
							data_pedido: { gte: startOfMonth, lt: startOfNextMonth },
						},
					},
				});

				return {
					sellerId: g.userId,
					sellerName: g.seller.name,
					monthRef: new Date(
						g.goalDateRef.getFullYear(),
						g.goalDateRef.getMonth() + 1,
						g.goalDateRef.getDate(),
					),
					revenue: g.revenue, // meta
					realized: soldAgg._sum.totalValue ?? 0, // faturamento realizado
				};
			}),
		);

		const allGoals = await prisma.salesGoal.findMany({
			where: { goalDateRef: { lt: startOfNextMonth } },
			include: { seller: { select: { id: true, name: true } } },
			orderBy: { goalDateRef: 'asc' },
		});

		const detailedGoals = await Promise.all(
			allGoals.map(async (g) => {
				// define início e fim do mês de referência
				const monthStart = new Date(
					g.goalDateRef.getFullYear(),
					g.goalDateRef.getMonth(),
					1,
				);
				const monthEnd = addMonths(monthStart, 1);

				// agregação do realizado
				const soldAgg = await prisma.saleItem.aggregate({
					_sum: { totalValue: true },
					where: {
						sale: {
							userId: g.userId,
							data_pedido: { gte: monthStart, lt: monthEnd },
						},
					},
				});
				return {
					monthRef: new Date(
						g.goalDateRef.getFullYear(),
						g.goalDateRef.getMonth() + 1,
						1,
					),
					sellerId: g.userId,
					sellerName: g.seller.name,
					revenue: g.revenue, // meta
					realized: soldAgg._sum.totalValue ?? 0, // faturamento realizado
				};
			}),
		);

		const historyMap: Record<
			string,
			Array<{
				sellerId: string;
				sellerName: string;
				revenue: number;
				realized: number;
				month: string;
			}>
		> = {};
		for (const g of detailedGoals) {
			const month = g.monthRef.toISOString();
			historyMap[month] ??= [];
			historyMap[month].push({
				sellerId: g.sellerId,
				sellerName: g.sellerName,
				revenue: g.revenue,
				month: month.slice(0, 7),
				realized: g.realized,
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
			currentGoals,
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
