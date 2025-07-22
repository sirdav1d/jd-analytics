/** @format */
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import {
	differenceInCalendarDays,
	endOfMonth,
	startOfMonth as dfStartOfMonth,
	getDaysInMonth,
} from 'date-fns';

export async function GET(req: NextRequest) {
	try {
		const now = new Date();
		const { searchParams } = req.nextUrl;
		const startParam = searchParams.get('startDate') ?? dfStartOfMonth(now);
		const endParam = searchParams.get('endDate') ?? new Date();

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
					where: { id: item.userId, isActive: true },
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

				// 3) Cálculo de forecast

				// 1) Defina o mês corrente (sempre será “maio de 2025” enquanto estivermos em maio):
				const currentMonthStart = dfStartOfMonth(now); // ex: 2025‑05‑01T00:00:00
				const currentMonthEnd = endOfMonth(currentMonthStart);

				const salesCurrentMonthAgg = await prisma.saleItem.aggregate({
					_sum: { totalValue: true },
					where: {
						sale: {
							data_pedido: {
								gte: currentMonthStart, // 2025‑05‑01
								lte: now, // “semana atual” ou data exata
							},
							userId: item.userId,
						},
					},
				});
				const totalRevenueCurrentMonth =
					salesCurrentMonthAgg._sum.totalValue ?? 0;
				const daysElapsedThisMonth =
					differenceInCalendarDays(now, currentMonthStart) + 1;
				const totalDaysInThisMonth = getDaysInMonth(currentMonthStart);
				const avgDailyThisMonth =
					daysElapsedThisMonth > 0
						? totalRevenueCurrentMonth / daysElapsedThisMonth
						: 0;

				const forecast = avgDailyThisMonth * totalDaysInThisMonth;

				const goalCurrentMonthAgg = await prisma.salesGoal.aggregate({
					_sum: { revenue: true },
					where: {
						goalDateRef: {
							gte: currentMonthStart,
							lt: currentMonthEnd,
						},
						userId: item.userId,
					},
				});
				const metaCurrentMonth = goalCurrentMonthAgg._sum.revenue ?? 0;

				// 5) Cálculo do percentual de diferença:
				const percentualDif =
					metaCurrentMonth > 0 ? (forecast / metaCurrentMonth) * 100 : 100;

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

		const currentMonthStart = dfStartOfMonth(now);
		const currentMonthEnd = endOfMonth(currentMonthStart);

		const salesCurrentMonthAgg = await prisma.saleItem.aggregate({
			_sum: { totalValue: true },
			where: {
				sale: {
					data_pedido: {
						gte: currentMonthStart,
						lt: now < currentMonthEnd ? now : currentMonthEnd,
					},
				},
			},
		});
		const realizadoCurrentMonth = salesCurrentMonthAgg._sum.totalValue ?? 0;

		const diasPassadosNoMes =
			differenceInCalendarDays(
				now < currentMonthEnd ? now : currentMonthEnd,
				currentMonthStart,
			) + 1;

		const totalDiasNoMes = getDaysInMonth(currentMonthStart); // ex: 31 para maio

		const mediaDiariaNoMes =
			diasPassadosNoMes > 0 ? realizadoCurrentMonth / diasPassadosNoMes : 0;

		const forecastCurrentMonth = mediaDiariaNoMes * totalDiasNoMes;

		const percentualDif =
			salesGoalSum._sum.revenue != null && salesGoalSum._sum.revenue > 0
				? (forecastCurrentMonth / salesGoalSum._sum.revenue) * 100
				: 0;

		const companySummary = {
			meta: salesGoalSum._sum.revenue ?? 0,
			realizado: salesSum._sum.totalValue ?? 0,
			forecast: forecastCurrentMonth,
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
