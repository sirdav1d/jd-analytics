/** @format */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');

	if (!startDate || !endDate) {
		return NextResponse.json(
			{
				ok: false,
				error: 'Parâmetros startDate e endDate são obrigatórios.',
				data: null,
			},
			{ status: 400 },
		);
	}

	const start = new Date(`${startDate}T00:00:00.000Z`);
	const end = new Date(`${endDate}T00:00:00.000Z`);

	const msInDay = 1000 * 60 * 60 * 24;
	const diffDays =
		Math.floor((end.getTime() - start.getTime()) / msInDay) + 1;

	// Se o período for até 30 dias, agrupamos por dia; caso contrário, por mês
	const isGroupedByMonth = diffDays > 30;
	const groupBy = diffDays <= 30 ? 'day' : 'month';
	const groupFormat = isGroupedByMonth ? 'YYYY-MM' : 'YYYY-MM-DD';

	const rowsRevenueOverTime = await prisma.$queryRaw<
		Array<{
			organizationId: string;
			organization: string;
			label: string;
			revenue: string;
		}>
	>(Prisma.sql`
    SELECT
      o.id AS "organizationId",
      o.name AS organization,
      TO_CHAR(
        date_trunc(${Prisma.raw(`'${groupBy}'`)}, p."data_pedido"),
        ${Prisma.raw(`'${groupFormat}'`)}
      ) AS label,
      SUM(si."total_value")::DOUBLE PRECISION AS revenue
    FROM "SaleItem" si
    JOIN "Pedido" p       ON si."sale_id" = p."id"
    JOIN "Organization" o ON p."organizationId" = o."id"
    JOIN "Customer" c     ON p."customerId"   = c."id"
    JOIN "Product" pr     ON si."product_id"  = pr."id"
    WHERE
      p."data_pedido" BETWEEN CAST(${startDate} AS date) AND CAST(${endDate} AS date)
      AND p.cancelled = FALSE
    GROUP BY
      o.id,
      o.name,
      label
    ORDER BY
      label ASC,
      o.name ASC,
      o.id ASC;
  `);

	const pivoted: Record<string, Record<string, number | string>> = {};

	for (const row of rowsRevenueOverTime) {
		const { organizationId, label, revenue } = row;

		// Se ainda não existir um objeto para esse período, inicializa com a chave period
		if (!pivoted[label]) {
			pivoted[label] = { period: label };
		}

		pivoted[label][organizationId] = Number(revenue);
	}

	const revenueByOrg = Object.values(pivoted);

	const rowsSalesOverTime = await prisma.$queryRaw<
		Array<{
			organizationId: string;
			organization: string;
			label: string;
			sales_count: bigint;
		}>
	>(
		Prisma.sql`
        SELECT
          o.id AS "organizationId",
          o.name AS organization,
          TO_CHAR(
            date_trunc(${Prisma.raw(`'${groupBy}'`)}, p."data_pedido"),
            ${Prisma.raw(`'${groupFormat}'`)}
          ) AS label,
          COUNT(p.id)::BIGINT AS sales_count
        FROM "Pedido" p
        JOIN "Organization" o ON p."organizationId" = o."id"
        WHERE
          p."data_pedido" BETWEEN CAST(${startDate} AS date) AND CAST(${endDate} AS date)
          AND p.cancelled = FALSE
        GROUP BY
          o.id,
          o.name,
          label
        ORDER BY
          label ASC,
          o.name ASC,
          o.id ASC
      `,
	);

	const pivotedSales: Record<string, Record<string, number | string>> = {};
	for (const row of rowsSalesOverTime) {
		const { organizationId, label, sales_count } = row;

		if (!pivotedSales[label]) {
			pivotedSales[label] = { period: label };
		}
		pivotedSales[label][organizationId] = Number(sales_count);
	}
	const salesByOrg = Object.values(pivotedSales);
	const historyOrganizations = Array.from(
		new Map(
			[...rowsRevenueOverTime, ...rowsSalesOverTime].map((row) => [
				row.organizationId,
				{
					organizationId: row.organizationId,
					organization: row.organization,
				},
			]),
		).values(),
	);

	try {
		const rowsClients = await prisma.$queryRaw<
			Array<{ organizationId: string; organization: string; cnt: string }>
		>(
			Prisma.sql`
					SELECT
						o.id AS "organizationId",
						o.name AS organization,
						COUNT(DISTINCT p."customerId") AS cnt
					FROM "Pedido" p
					JOIN "Organization" o ON o.id = p."organizationId"
					WHERE
						p."data_pedido" BETWEEN CAST(${startDate} AS date) AND CAST(${endDate} AS date)
						AND p."customerId" IS NOT NULL
	
						-- garante que esse cliente tenha EXATAMENTE 1 pedido no banco inteiro
						AND (
							SELECT COUNT(*)
							FROM "Pedido" p3
							WHERE p3."customerId" = p."customerId"
						) = 1
	
					GROUP BY o.id, o.name;
				`,
		);

		const novosClientesPorOrganizacao = rowsClients.map((row) => ({
			organizationId: row.organizationId,
			organization: row.organization,
			newCustomers: Number(row.cnt),
		}));

		//  — Versão SEM filtro de organização, mas COM categoria e tipo de cliente
		const rows = await prisma.$queryRaw<
			Array<{
				organizationId: string;
				organization: string;
				revenue: number;
				sales_count: bigint;
				new_customers: bigint;
			}>
		>(Prisma.sql`
      WITH customer_orders AS (
        SELECT 
          "customerId",
          MIN("data_pedido") AS first_order_date,
          MAX("data_pedido") AS last_order_date,
          COUNT(*) AS total_orders
        FROM "Pedido"
        WHERE "customerId" IS NOT NULL
          AND cancelled = false
        GROUP BY "customerId"
      )
      SELECT 
		org.id AS "organizationId",
        org.name AS organization,
        COALESCE(SUM(i."total_value"), 0) AS revenue,
        COUNT(DISTINCT p.id) AS sales_count,
        COUNT(DISTINCT p."customerId") FILTER (
          WHERE
            co.first_order_date BETWEEN CAST(${startDate} AS date) AND CAST(${endDate} AS date)
            AND co.last_order_date BETWEEN CAST(${startDate} AS date) AND CAST(${endDate} AS date)
            AND co.total_orders = 1
        ) AS new_customers
      FROM "Pedido" p
      JOIN "Organization" org ON org.id = p."organizationId"
      LEFT JOIN "SaleItem" i ON i."sale_id" = p.id
      LEFT JOIN customer_orders co ON co."customerId" = p."customerId"
      WHERE p."data_pedido" BETWEEN CAST(${startDate} AS date) AND CAST(${endDate} AS date)
        AND p.cancelled = false
		GROUP BY org.id, org.name
    `);

		const result = rows.map((row) => {
			const newCustomers =
				novosClientesPorOrganizacao.find(
					(value) => value.organizationId === row.organizationId,
				)?.newCustomers ?? 0;
			return {
				organizationId: row.organizationId,
				organization: row.organization,
				revenue: Number(row.revenue),
				salesCount: Number(row.sales_count),
				newCustomers: newCustomers,
			};
		});

		return NextResponse.json({
			ok: true,
			data: { result, historyOrganizations, revenueByOrg, salesByOrg },
			error: null,
		});
	} catch (error) {
		console.error('Error fetching data:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch data' },
			{ status: 500 },
		);
	}
}
