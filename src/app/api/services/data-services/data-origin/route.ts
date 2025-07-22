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
		// CLAUSULAS DE FILTRO REUTILIZÁVEIS
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

		// 7) **Receita por ORIGEM** – agrupa nas 6 chaves + Desconhecido
		// 7) Receita por ORIGEM com alias origin_group
		const rowsOrigin = await prisma.$queryRaw<
			Array<{ origin_group: string; revenue: string }>
		>(Prisma.sql`
      SELECT
        CASE
          WHEN o."name" ILIKE '%google%'                THEN 'Google'
          WHEN o."name" ILIKE '%meta%'                  THEN 'Meta'
          WHEN o."name" ILIKE '%balcão%'                THEN 'Balcão'
          WHEN o."name" ILIKE '%indicação%'             THEN 'Indicação'
          WHEN o."name" ILIKE '%boa dica%'              THEN 'Boa_Dica'
          WHEN o."name" ILIKE '%comercial ativo%' 
               OR o."name" ILIKE '%cliente recorrente%' THEN 'Comercial_Ativo'
          ELSE 'Desconhecido'
        END AS origin_group,
        SUM(si."total_value")::DOUBLE PRECISION AS revenue
      FROM "SaleItem" si
      JOIN "Pedido" p     ON si."sale_id"   = p."id"
      JOIN "Origin" o     ON p."origin_id"   = o."id"    -- ajuste se o campo FK tiver nome diferente
      WHERE
        p."data_pedido" BETWEEN ${start} AND ${end}
        ${sqlOrgFilter}
        ${sqlCategoryFilter}
        ${sqlCustomerTypeFilter}
      GROUP BY origin_group
      ORDER BY revenue DESC;
    `);
		const revenueByOrigin = rowsOrigin.map((r) => ({
			origin: r.origin_group,
			revenue: Number(r.revenue),
			fill: `var(--color-${r.origin_group})`,
		}));

		return NextResponse.json({
			ok: true,
			data: {
				revenueByOrigin, // novo bloco
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
