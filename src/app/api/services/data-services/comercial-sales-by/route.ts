/** @format */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const category = searchParams.get('category');
	const customerType = searchParams.get('customerType');
	const org = searchParams.get('org');

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

	const start = new Date(`${startDate}T00:00:00`);
	const end = new Date(`${endDate}T23:59:59`);
	const msInDay = 1000 * 60 * 60 * 24;
	const dateDiffInDays = Math.ceil((end.getTime() - start.getTime()) / msInDay);
	const isGroupedByMonth = dateDiffInDays > 30;
	const groupFormat = isGroupedByMonth ? 'YYYY-MM' : 'YYYY-MM-DD';

	try {
		const sqlOrgFilter =
			org && org !== 'all'
				? Prisma.sql`AND p."organizationId" = ${org}`
				: Prisma.empty;

		const sqlCategoryFilter =
			category && category !== 'all'
				? Prisma.sql`AND pr."sector" = ${category}`
				: Prisma.empty;

		const sqlCustomerTypeFilter =
			customerType && customerType !== 'all'
				? Prisma.raw(`AND c."person_type" = '${customerType}'::"PersonType"`)
				: Prisma.empty;

		const rows = await prisma.$queryRaw<
			Array<{ person_type: string; revenue: string }>
		>(
			Prisma.sql`
        SELECT
          c."person_type"        AS person_type,
          SUM(si."total_value")::DOUBLE PRECISION AS revenue
        FROM "SaleItem" si
        JOIN "Pedido" p     ON si."sale_id"     = p."id"
        JOIN "Customer" c   ON p."customerId"   = c."id"
        JOIN "Product" pr   ON si."product_id"  = pr."id"
        WHERE
          p."data_pedido" BETWEEN ${start} AND ${end}
          ${sqlOrgFilter}
          ${sqlCategoryFilter}
          ${sqlCustomerTypeFilter}
        GROUP BY c."person_type";
        `,
		);

		const output = {
			FISICA: 0,
			JURIDICA: 0,
		};

		// b) Soma de receita para este cliente, respeitando os mesmos filtros de data, org, tipo e categoria
		for (const row of rows) {
			const tipo = row.person_type; // "FISICA" ou "JURIDICA"
			output[tipo as 'FISICA' | 'JURIDICA'] = Number(row.revenue);
		}

		const salesByClient = [
			{ type: 'FISICA', revenue: output.FISICA },
			{ type: 'JURIDICA', revenue: output.JURIDICA },
		];

		const sqlCategoryFilterForSector =
			category && category !== 'all'
				? Prisma.sql`AND pr."sector" = ${category}`
				: Prisma.empty;

		const rowsCategory = await prisma.$queryRaw<
			Array<{ sector: string; revenue: string }>
		>(
			Prisma.sql`
    SELECT
      pr."sector"                             AS sector,
      SUM(si."total_value")::DOUBLE PRECISION AS revenue
    FROM "SaleItem" si
    JOIN "Pedido" p     ON si."sale_id"     = p."id"
    JOIN "Customer" c   ON p."customerId"   = c."id"
    JOIN "Product" pr   ON si."product_id"  = pr."id"
    WHERE
      p."data_pedido" BETWEEN ${start} AND ${end}
      ${sqlOrgFilter}
      ${sqlCategoryFilterForSector}
      ${sqlCustomerTypeFilter}
    GROUP BY pr."sector"
    ORDER BY revenue DESC;
    `,
		);

		const salesByCategory = rowsCategory.map((row) => ({
			category: row.sector,
			revenue: Number(row.revenue),
		}));

		const rowsPayment = await prisma.$queryRaw<
			Array<{ method: string; revenue: string }>
		>(Prisma.sql`
			SELECT
				pm."method"                         AS method,
				SUM(si."total_value")::DOUBLE PRECISION AS revenue
			FROM "SaleItem" si
			JOIN "Pedido" p     ON si."sale_id" = p."id"
			JOIN "Customer" c   ON p."customerId" = c."id"
			JOIN "Product" pr   ON si."product_id" = pr."id"
			JOIN "PaymentMethod" pm ON p."paymentMethodId" = pm."id"
			WHERE
				p."data_pedido" BETWEEN ${start} AND ${end}
				${sqlOrgFilter}
				${sqlCategoryFilter}
				${sqlCustomerTypeFilter}
			GROUP BY pm."method";
		`);

		const revenueByMethod: Record<string, number> = {};

		for (const row of rowsPayment) {
			const raw = row.method.trim();
			const key = raw.includes(',') ? 'Múltiplos' : raw;

			revenueByMethod[key] = (revenueByMethod[key] || 0) + Number(row.revenue);
		}

		const SalesByPayment = Object.entries(revenueByMethod)
			.map(([method, revenue]) => ({
				method,
				revenue,
			}))
			.sort((a, b) => b.revenue - a.revenue);

		const rowsItemType = await prisma.$queryRaw<
			Array<{ tipo: string; revenue: string }>
		>(Prisma.sql`
  SELECT
    CASE
      WHEN pr."external_code" = '1459' THEN 'Serviço'
      ELSE 'Produto'
    END AS tipo,
    SUM(si."total_value")::DOUBLE PRECISION AS revenue
  FROM "SaleItem" si
  JOIN "Pedido" p     ON si."sale_id"     = p."id"
  JOIN "Customer" c   ON p."customerId"   = c."id"
  JOIN "Product" pr   ON si."product_id"  = pr."id"
  WHERE
    p."data_pedido" BETWEEN ${start} AND ${end}
    ${sqlOrgFilter}
    ${sqlCategoryFilter}
    ${sqlCustomerTypeFilter}
  GROUP BY tipo;
`);

		const salesByItemType = rowsItemType.map((row) => ({
			type: row.tipo, // "Serviço" ou "Produto"
			revenue: Number(row.revenue),
		}));

		const rowsNewClients = await prisma.$queryRaw<
			Array<{ revenue: string; clients: number }>
		>(Prisma.sql`
		SELECT
			SUM(si."total_value")::DOUBLE PRECISION AS revenue,
			COUNT(DISTINCT c."id") AS clients
		FROM "SaleItem" si
		JOIN "Pedido" p        ON si."sale_id" = p."id"
		JOIN "Customer" c      ON p."customerId" = c."id"
		JOIN "Product" pr      ON si."product_id" = pr."id"
		WHERE
			p."data_pedido" BETWEEN ${start} AND ${end}
			AND NOT EXISTS (
				SELECT 1
				FROM "Pedido" p2
				WHERE p2."customerId" = c."id"
					AND p2."data_pedido" < ${start}
			)
			${sqlOrgFilter}
			${sqlCategoryFilter}
			${sqlCustomerTypeFilter}
	`);
		const rowsReturningClients = await prisma.$queryRaw<
			Array<{ revenue: string; clients: number }>
		>(Prisma.sql`
SELECT
	SUM(si."total_value")::DOUBLE PRECISION AS revenue,
	COUNT(DISTINCT c."id") AS clients
FROM "SaleItem" si
JOIN "Pedido" p        ON si."sale_id" = p."id"
JOIN "Customer" c      ON p."customerId" = c."id"
JOIN "Product" pr      ON si."product_id" = pr."id"
WHERE
	p."data_pedido" BETWEEN ${start} AND ${end}
	AND EXISTS (
		SELECT 1
		FROM "Pedido" p2
		WHERE p2."customerId" = c."id"
			AND p2."data_pedido" < ${start}
	)
	${sqlOrgFilter}
	${sqlCategoryFilter}
	${sqlCustomerTypeFilter}
`);

		const salesByClientType = [
			{
				type: 'Novo',
				clients: Number(rowsNewClients[0]?.clients || 0),
				revenue: rowsNewClients[0]?.revenue
					? Number(rowsNewClients[0].revenue)
					: 0,
			},
			{
				type: 'Recorrente',
				clients: Number(rowsReturningClients[0]?.clients || 0),
				revenue: rowsReturningClients[0]?.revenue
					? Number(rowsReturningClients[0].revenue)
					: 0,
			},
		];

		const rowsRevenueOverTime = await prisma.$queryRaw<
			Array<{ label: string; revenue: string }>
		>(Prisma.sql`
			SELECT
				TO_CHAR(p."data_pedido", ${groupFormat}) AS label,
				SUM(si."total_value")::DOUBLE PRECISION  AS revenue
			FROM "SaleItem" si
			JOIN "Pedido" p        ON si."sale_id" = p."id"
			JOIN "Customer" c      ON p."customerId" = c."id"
			JOIN "Product" pr      ON si."product_id" = pr."id"
			WHERE
				p."data_pedido" BETWEEN ${start} AND ${end}
				${sqlOrgFilter}
				${sqlCategoryFilter}
				${sqlCustomerTypeFilter}
			GROUP BY label
			ORDER BY label;
		`);

		const revenueOverTime = rowsRevenueOverTime.map((row) => ({
			label: row.label,
			revenue: Number(row.revenue),
		}));

		return NextResponse.json({
			ok: true,
			data: {
				salesByClient,
				salesByCategory,
				SalesByPayment,
				salesByItemType,
				salesByClientType,
				revenueOverTime,
			},
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
