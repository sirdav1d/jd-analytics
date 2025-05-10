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

		// 1. Overview: vendas por vendedor
		const rawOverview = await prisma.pedido.groupBy({
			by: ['userId'],
			where: {
				data_pedido: { gte: startDate, lte: endDate },
			},
			_count: { id: true },
		});

		// build overview with revenue and avgTicket
		const overview = await Promise.all(
			rawOverview.map(async (item) => {
				// soma de itens por venda do vendedor no período
				const revenue = await prisma.saleItem.aggregate({
					_sum: { totalValue: true },
					where: {
						sale: {
							userId: item.userId,
							data_pedido: { gte: startDate, lte: endDate },
						},
					},
				});

				const totalRevenue = revenue._sum.totalValue ?? 0;
				const orderCount = item._count.id;
				const avgTicket = orderCount ? totalRevenue / orderCount : 0;
				const seller = await prisma.user.findUnique({
					where: { id: item.userId },
					select: { name: true },
				});
				return {
					vendedor: seller?.name ?? 'Unknown',
					totalRevenue,
					orderCount,
					avgTicket,
				};
			}),
		);

		// sort descending revenue
		const overResp = overview.sort((a, b) => b.totalRevenue - a.totalRevenue);

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

		// 3. Lista de vendedores
		const sellers = await prisma.user.findMany({ select: { name: true } });
		const vendors = sellers.map((s) => s.name);

		return NextResponse.json(
			{
				overview: overResp,
				timeSeries,
				vendors,
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
			},
			{ status: 500 },
		);
	}
}
