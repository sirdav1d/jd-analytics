/** @format */
import { prisma } from '@/lib/prisma';
import {
	formatBusinessCivilDate,
	resolveCivilDateRange,
} from '@/services/data-services/civil-date-range';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

function getCivilMonthBounds(civilDate: string) {
	const [year, month] = civilDate.split('-').map(Number);
	const start = new Date(Date.UTC(year, month - 1, 1));
	const next = new Date(Date.UTC(year, month, 1));
	const totalDays = new Date(Date.UTC(year, month, 0)).getUTCDate();
	return { start, next, totalDays };
}

export async function GET(req: NextRequest) {
	try {
		const now = new Date();
		const businessToday = formatBusinessCivilDate(now);
		const { searchParams } = req.nextUrl;
		const startParam =
			searchParams.get('startDate') ?? `${businessToday.slice(0, 7)}-01`;
		const endParam = searchParams.get('endDate') ?? businessToday;

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

		const range = resolveCivilDateRange(startParam, endParam);
		const { start: startDate, end: endDate, inclusiveDays } = range;
		const useDaily = inclusiveDays <= 30;
		const selectedMonthStart = getCivilMonthBounds(startParam).start;
		const selectedMonthEndExclusive = getCivilMonthBounds(endParam).next;
		const currentMonth = getCivilMonthBounds(businessToday);
		const isCurrentMonthToDate =
			startParam === `${businessToday.slice(0, 7)}-01` &&
			endParam === businessToday;
		const forecastMultiplier = isCurrentMonthToDate
			? currentMonth.totalDays / inclusiveDays
			: 1;

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
					select: { name: true },
				});

				if (!seller) return null;

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
						goalDateRef: {
							gte: selectedMonthStart,
							lt: selectedMonthEndExclusive,
						},
					},
				});

				const meta = goalAgg._sum.revenue ?? 0;
				const totalRevenue = revenue._sum.totalValue ?? 0;
				const orderCount = item._count.id;
				const avgTicket = orderCount ? totalRevenue / orderCount : 0;

				const forecast = totalRevenue * forecastMultiplier;
				const percentualDif = meta > 0 ? (forecast / meta) * 100 : 100;

				return {
					vendedor: seller?.name ?? 'Unknown',
					totalRevenue,
					meta,
					orderCount,
					avgTicket,
					forecast, // previsão de faturamento até fim do mês
					percentualDif, // forecast / meta * 100
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
							 CAST(${startParam} AS date),
							 CAST(${endParam} AS date),
							 '1 day'::interval
						 ) AS day
					 ), agg AS (
						 SELECT date_trunc('day', p.data_pedido)::date AS day,
										SUM(si.total_value)::float AS revenue
						 FROM "Pedido" p
						 JOIN "SaleItem" si ON si.sale_id = p.id
						 WHERE p.data_pedido BETWEEN CAST(${startParam} AS date) AND CAST(${endParam} AS date)
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
					 WHERE p.data_pedido BETWEEN CAST(${startParam} AS date) AND CAST(${endParam} AS date)
					 GROUP BY period
					 ORDER BY period
				 `,
			);
		}

		const salesGoalSum = await prisma.salesGoal.aggregate({
			_sum: { revenue: true },
			where: {
				goalDateRef: {
					gte: selectedMonthStart,
					lt: selectedMonthEndExclusive,
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

		const realizado = salesSum._sum.totalValue ?? 0;
		const forecast = realizado * forecastMultiplier;

		const percentualDif =
			salesGoalSum._sum.revenue != null && salesGoalSum._sum.revenue > 0
				? (forecast / salesGoalSum._sum.revenue) * 100
				: 0;

		const companySummary = {
			meta: salesGoalSum._sum.revenue ?? 0,
			realizado,
			forecast,
			diffPercent: percentualDif,
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
