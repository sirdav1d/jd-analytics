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

		let vendasPorVendedor: {
			vendedor: string;
			totalRevenue: number;
			orderCount: number;
			avgTicket: number;
		}[] = [];

		const rawVendas = await prisma.pedidos.groupBy({
			by: ['vendedor'],
			where: { data_pedido: { gte: startDate, lte: endDate } },
			_sum: { valor_total: true },
			_count: { id: true },
			_avg: { valor_total: true },
		});

		vendasPorVendedor = rawVendas
			.map((v) => ({
				vendedor: v.vendedor,
				totalRevenue: v._sum.valor_total?.toNumber() ?? 0,
				orderCount: v._count.id,
				avgTicket: v._avg.valor_total?.toNumber() ?? 0,
			}))
			.sort((a, b) => b.totalRevenue - a.totalRevenue);

		// 2. Série temporal (diária se período < 31 dias, senão mensal)
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
            SELECT date_trunc('day', data_pedido)::date AS day,
                   SUM(valor_total)::float AS revenue
            FROM Pedidos
            WHERE data_pedido >= ${startDate}
              AND data_pedido <= ${endDate}
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
            to_char(date_trunc('month', data_pedido), 'YYYY-MM') AS period,
            SUM(valor_total)::float AS revenue
          FROM Pedidos
          WHERE data_pedido >= ${startDate}
            AND data_pedido <= ${endDate}
          GROUP BY period
          ORDER BY period
        `,
			);
		}

		const allVendors = await prisma.pedidos.findMany({
			select: { vendedor: true },
			distinct: ['vendedor'],
		});

		const vendors = allVendors.map((v) => v.vendedor);

		return NextResponse.json(
			{
				overview: vendasPorVendedor,
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
