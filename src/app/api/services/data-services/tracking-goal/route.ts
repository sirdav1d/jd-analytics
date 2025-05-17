/** @format */
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const startParam = searchParams.get('startDate');
		const endParam = searchParams.get('endDate');

		if (!startParam || !endParam) {
			return NextResponse.json(
				{
					error: 'Parâmetros start e end são obrigatórios.',
					ok: false,
					vendors: null,
					timeSeries: null,
					overview: null,
				},
				{ status: 400 },
			);
		}

		const startDate = new Date(startParam);
		const endDate = new Date(endParam);
		const msInDay = 1000 * 60 * 60 * 24;
		const diffDays = (endDate.getTime() - startDate.getTime()) / msInDay;
		const useDaily = diffDays < 30;
		const startOfMonth = new Date(
			startDate.getFullYear(),
			startDate.getMonth(),
			1,
			0,
			0,
			0,
		);

		//OVERVIEW INICIO
		const rawOverview = await prisma.pedido.groupBy({
			by: ['userId'],
			where: {
				data_pedido: { gte: startDate, lte: endDate },
			},
			_count: { id: true },
		});

		const overview = await Promise.all(
			rawOverview.map(async (item) => {
				const seller = await prisma.user.findUnique({
					where: { id: item.userId },
					select: { name: true, role: true },
				});

				// Filtra apenas vendedores
				if (!seller || seller.role !== 'SELLER') return null;

				const revenue = await prisma.saleItem.aggregate({
					_sum: { totalValue: true },
					where: {
						sale: {
							userId: item.userId,
							data_pedido: { gte: startDate, lte: endDate },
						},
					},
				});

				const goalAgg = await prisma.salesGoal.aggregate({
					_sum: { revenue: true },
					where: {
						userId: item.userId,
						goalDateRef: { gte: startOfMonth, lte: endDate },
					},
				});
				const meta = goalAgg._sum.revenue ?? 0;
				const totalRevenue = revenue._sum.totalValue ?? 0;
				const orderCount = item._count.id;
				const avgTicket = orderCount ? totalRevenue / orderCount : 0;

				return {
					vendedor: seller?.name ?? 'Unknown',
					totalRevenue,
					meta,
					orderCount,
					avgTicket,
				};
			}),
		);

		const overResp = overview
			.filter(Boolean)
			.sort((a, b) => b!.totalRevenue - a!.totalRevenue);
		//OVERVIEW FIM

		// 2. Série temporal
		let timeSeries: Array<{ period: string; revenue: number }>;
		if (useDaily) {
			timeSeries = await prisma.$queryRaw<
				Array<{ period: string; revenue: number }>
			>(
				Prisma.sql`
					 WITH days AS (
						 SELECT generate_series(
							 ${startDate}::date,
							 ${endDate}::date,
							 '1 day'::interval
						 ) AS day
					 ), agg AS (
						 SELECT date_trunc('day', p.data_pedido)::date AS day,
										SUM(si.total_value)::float AS revenue
						 FROM "Pedido" p
						 JOIN "SaleItem" si ON si.sale_id = p.id
						 WHERE p.data_pedido BETWEEN ${startDate} AND ${endDate}
						 GROUP BY day
					 )
					 SELECT to_char(days.day, 'YYYY-MM-DD') AS period,
									COALESCE(agg.revenue, 0) AS revenue
					 FROM days
					 LEFT JOIN agg ON days.day = agg.day
					 ORDER BY days.day
				 `,
			);
		} else {
			timeSeries = await prisma.$queryRaw<
				Array<{ period: string; revenue: number }>
			>(
				Prisma.sql`
					 SELECT
						 to_char(date_trunc('month', p.data_pedido), 'YYYY-MM') AS period,
						 SUM(si.total_value)::float AS revenue
					 FROM "Pedido" p
					 JOIN "SaleItem" si ON si.sale_id = p.id
					 WHERE p.data_pedido BETWEEN ${startDate} AND ${endDate}
					 GROUP BY period
					 ORDER BY period
				 `,
			);
		}

		const salesGoalSum = await prisma.salesGoal.aggregate({
			_sum: { revenue: true },
			where: {
				goalDateRef: {
					gte: startOfMonth, // >= 1º dia do mês selecionado
					lt: endDate, // < 1º dia do mês seguinte
				},
			},
		});

		const salesSum = await prisma.saleItem.aggregate({
			_sum: { totalValue: true },
			where: {
				sale: {
					data_pedido: { gte: startDate, lte: endDate },
				},
			},
		});

		const companySummary = {
			meta: salesGoalSum._sum.revenue ?? 0,
			realizado: salesSum._sum.totalValue ?? 0,
		};

		return NextResponse.json(
			{
				overview: overResp,
				timeSeries,
				companySummary,
				ok: true,
				error: null,
			},
			{ status: 200 },
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.log('Erro do servidor', err);
		return NextResponse.json(
			{
				error: err.message || 'Erro interno',
				ok: false,
				timeSeries: null,
				overview: null,
				vendors: null,
				companySummary: null,
			},
			{ status: 500 },
		);
	}
}
