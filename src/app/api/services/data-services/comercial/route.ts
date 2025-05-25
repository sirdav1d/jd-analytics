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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const whereClauseForGroupBy: any = {
			data_pedido: { gte: start, lte: end },
		};

		if (category && category !== 'all') {
			whereClauseForGroupBy.items = {
				some: {
					product: { sector: category },
				},
			};
		}

		if (customerType && customerType !== 'all') {
			whereClauseForGroupBy.customer = {
				personType: customerType,
			};
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const whereClause: any = {
			sale: {
				data_pedido: { gte: start, lte: end },
				...(customerType && customerType !== 'all'
					? { customer: { personType: { equals: customerType } } }
					: {}),
			},
			...(category && category !== 'all'
				? { product: { sector: category } }
				: {}),
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const whereClauseCustomer: any = {
			data_pedido: { gte: start, lte: end },
		};

		if (customerType && customerType !== 'all') {
			whereClauseCustomer.customer = { personType: customerType };
		}

		if (category && category !== 'all') {
			whereClauseCustomer.items = {
				some: {
					product: { sector: category },
				},
			};
		}

		const rawOverview = await prisma.pedido.groupBy({
			by: ['userId'],
			where: whereClauseForGroupBy,
			_count: { id: true }, // _count.id é o número de pedidos para aquele userId
		});

		const detailsSellers = await Promise.all(
			rawOverview.map(async (item) => {
				const userId = item.userId;
				const numSales = item._count.id; // número de pedidos distintos

				// 2a) Soma de receita apenas de items que obedecem ao filtro “categoryFilter”
				//     Se categoryFilter = null/undefined, soma todos os itens daquele vendedor no período
				const revenueAgg = await prisma.saleItem.aggregate({
					_sum: { totalValue: true },
					where: {
						sale: {
							userId: userId,
							data_pedido: { gte: start, lte: end },
							...(customerType && customerType !== 'all'
								? // eslint-disable-next-line @typescript-eslint/no-explicit-any
									{ customer: { is: { personType: customerType as any } } }
								: {}),
						},
						...(category && category !== 'all'
							? { product: { sector: category } }
							: {}),
					},
				});

				const totalRevenue = revenueAgg._sum.totalValue ?? 0;

				// 2b) Calcula ticket médio
				const avgTicket =
					numSales > 0 ? Number((totalRevenue / numSales).toFixed(2)) : 0;

				// 2c) Pega nome do vendedor
				const user = await prisma.user.findUnique({
					where: { id: userId },
					select: { name: true },
				});
				const name = user?.name ?? 'Unknown';

				return {
					userId,
					name,
					sales: numSales,
					revenue: totalRevenue,
					avgTicket,
				};
			}),
		);

		const rawProducts = await prisma.saleItem.groupBy({
			by: ['productId'],
			where: whereClause,
			_sum: {
				quantity: true,
				totalValue: true,
			},
		});

		const detailsProducts = await Promise.all(
			rawProducts.map(async (item) => {
				const productId = item.productId;
				const unitsSold = item._sum.quantity ?? 0;
				const revenue = item._sum.totalValue ?? 0;

				// Busca a descrição do produto
				const product = await prisma.product.findUnique({
					where: { id: productId },
					select: { description: true, externalCode: true },
				});
				const name = product?.description ?? 'Unknown';
				const code = product?.externalCode ?? '00';

				// Ticket médio do produto (avgPrice)

				return {
					productId,
					name,
					code,
					sales: unitsSold,
					revenue,
				};
			}),
		);
		const rawTop5 = await prisma.$queryRaw<
			Array<{
				customer_id: string;
				name: string;
				external_code: number;
				purchases: bigint;
				revenue: number;
			}>
		>(
			Prisma.sql`
      SELECT
        c."id"              AS customer_id,
        c."name"            AS name,
        c."externalCode"    AS external_code,
        COUNT(p."id")       AS purchases,
        SUM(si."total_value")::DOUBLE PRECISION AS revenue
      FROM "Pedido" p
      JOIN "Customer" c   ON c."id" = p."customerId"
      JOIN "SaleItem" si  ON si."sale_id" = p."id"
      JOIN "Product" pr   ON pr."id" = si."product_id"
      WHERE
        p."data_pedido" BETWEEN ${start} AND ${end}
        AND (
          ${customerType}::text IS NULL
          OR ${customerType} = 'all'
          OR c."person_type"::text = ${customerType}
        )
        AND (
          ${category}::text IS NULL
          OR ${category} = 'all'
          OR pr."sector" = ${category}
        )
      GROUP BY c."id", c."name", c."externalCode"
      ORDER BY revenue DESC
      LIMIT 5
      `,
		);

		// Monta o JSON final adicionando a posição (1 a 5)
		const topCustomers = rawTop5.map((row, idx) => ({
			posicao: idx + 1,
			name: row.name,
			code: String(row.external_code).padStart(2, '0'),
			purchases: Number(row.purchases),
			revenue: Number(row.revenue),
		}));

		const products = detailsProducts
			.filter((d) => d.sales > 0) // opcional: só produtos que venderam pelo menos 1 unidade
			.sort((a, b) => b.revenue - a.revenue)
			.slice(0, 5)
			.map((d, idx) => ({
				posicao: idx + 1,
				name: d.name,
				code: d.code,
				sales: d.sales,
				revenue: d.revenue,
			}));

		const sellers = detailsSellers
			// (opcional) filtrar quem não fez nenhuma venda: numSales === 0
			.filter((d) => d.sales > 0)
			.sort((a, b) => b.revenue - a.revenue)
			.map((d, idx) => ({
				posicao: idx + 1,
				name: d.name,
				sales: d.sales,
				revenue: d.revenue,
				avgTicket: d.avgTicket,
			}));

		return NextResponse.json({
			ok: true,
			data: { sellers, products, topCustomers },
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
