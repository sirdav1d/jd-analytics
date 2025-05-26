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

		return NextResponse.json({
			ok: true,
			data: { salesByClient, salesByCategory },
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
