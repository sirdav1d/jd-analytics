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

	// 2️⃣ Calcula o período anterior com mesma duração
	const durationMs = end.getTime() - start.getTime();
	const prevEndMs = start.getTime() - 1;
	const prevStartMs = prevEndMs - durationMs;
	const prevStart = new Date(prevStartMs);
	const prevEnd = new Date(prevEndMs);

	try {
		function whereVenda(periodStart: Date, periodEnd: Date) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const w: any = {
				data_pedido: { gte: periodStart, lte: periodEnd },
			};
			if (org && org !== 'all') {
				w.organizationId = org;
			}
			if (customerType && customerType !== 'all') {
				w.customer = { personType: customerType };
			}
			if (category && category !== 'all') {
				w.items = {
					some: {
						product: { sector: category },
					},
				};
			}
			return w;
		}

		const filtroAtualPedido = whereVenda(start, end);

		const totalVendasAtual = await prisma.pedido.count({
			where: filtroAtualPedido,
		});

		const revenueAggAtual = await prisma.saleItem.aggregate({
			_sum: { totalValue: true },
			where: {
				sale: {
					data_pedido: { gte: start, lte: end },
					...(org && org !== 'all' ? { organizationId: org } : {}),
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
		const totalReceitaAtual = revenueAggAtual._sum.totalValue ?? 0;

		const ticketMedioAtual =
			totalVendasAtual > 0
				? Number((totalReceitaAtual / totalVendasAtual).toFixed(2))
				: 0;

		const clientesNoPeriodo = await prisma.pedido.findMany({
			where: filtroAtualPedido,
			select: { customerId: true },
			distinct: ['customerId'],
		});
		const totalClientesUnicosAtual = clientesNoPeriodo.length;

		let novosClientesAtual = 0;
		if (org && org !== 'all') {
			//  — Versão COM filtro de organização, categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${start} AND ${end}
          ${Prisma.sql`AND p."organizationId" = ${org}`}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND NOT EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${start}
              ${Prisma.sql`AND p2."organizationId" = ${org}`}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          ) AND (
            SELECT COUNT(*)
            FROM "Pedido" p3
            WHERE p3."customerId" = p."customerId"
          ) = 1;
      `,
			);
			novosClientesAtual = Number(result?.cnt ?? 0);
		} else {
			//  — Versão SEM filtro de organização, mas COM categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${start} AND ${end}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND NOT EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${start}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          ) AND (
            SELECT COUNT(*)
            FROM "Pedido" p3
            WHERE p3."customerId" = p."customerId"
          ) = 1;
      `,
			);
			novosClientesAtual = Number(result?.cnt ?? 0);
		}

		let recorrentesAtual = 0;
		if (org && org !== 'all') {
			// — Versão COM filtro de organização, categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${start} AND ${end}
          ${Prisma.sql`AND p."organizationId" = ${org}`}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${start}
              ${Prisma.sql`AND p2."organizationId" = ${org}`}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          );
      `,
			);
			recorrentesAtual = Number(result?.cnt ?? 0);
		} else {
			// — Versão SEM filtro de organização, mas COM categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${start} AND ${end}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${start}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          );
      `,
			);
			recorrentesAtual = Number(result?.cnt ?? 0);
		}

		const revPorClienteAtual =
			totalClientesUnicosAtual > 0
				? Number((totalReceitaAtual / totalClientesUnicosAtual).toFixed(2))
				: 0;

		const filtroAntPedido = whereVenda(prevStart, prevEnd);

		const totalVendasAnt = await prisma.pedido.count({
			where: filtroAntPedido,
		});

		const revenueAggAnt = await prisma.saleItem.aggregate({
			_sum: { totalValue: true },
			where: {
				sale: {
					data_pedido: { gte: prevStart, lte: prevEnd },
					...(org && org !== 'all' ? { organizationId: org } : {}),
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
		const totalReceitaAnt = revenueAggAnt._sum.totalValue ?? 0;

		const ticketMedioAnt =
			totalVendasAnt > 0
				? Number((totalReceitaAnt / totalVendasAnt).toFixed(2))
				: 0;

		const clientesAnt = await prisma.pedido.findMany({
			where: filtroAntPedido,
			select: { customerId: true },
			distinct: ['customerId'],
		});
		const totalClientesUnicosAnt = clientesAnt.length;

		let novosClientesAnt = 0;
		if (org && org !== 'all') {
			// Com filtro de organização, categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${prevStart} AND ${prevEnd}
          ${Prisma.sql`AND p."organizationId" = ${org}`}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND NOT EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${prevStart}
              ${Prisma.sql`AND p2."organizationId" = ${org}`}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          );
      `,
			);
			novosClientesAnt = Number(result?.cnt ?? 0);
		} else {
			// Sem filtro de organização, mas COM categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${prevStart} AND ${prevEnd}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND NOT EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${prevStart}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          );
      `,
			);
			novosClientesAnt = Number(result?.cnt ?? 0);
		}

		let recorrentesAnt = 0;
		if (org && org !== 'all') {
			// Com filtro de organização, categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${prevStart} AND ${prevEnd}
          ${Prisma.sql`AND p."organizationId" = ${org}`}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${prevStart}
              ${Prisma.sql`AND p2."organizationId" = ${org}`}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          );
      `,
			);
			recorrentesAnt = Number(result?.cnt ?? 0);
		} else {
			// Sem filtro de organização, mas COM categoria e tipo de cliente
			const [result] = await prisma.$queryRaw<Array<{ cnt: string }>>(
				Prisma.sql`
        SELECT 
          COUNT(DISTINCT p."customerId") AS cnt
        FROM "Pedido" p
        WHERE 
          p."data_pedido" BETWEEN ${prevStart} AND ${prevEnd}
          ${
						customerType && customerType !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "Customer" c 
                WHERE c."id" = p."customerId"
                  AND c."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
              )`
							: Prisma.empty
					}
          ${
						category && category !== 'all'
							? Prisma.sql`AND EXISTS (
                SELECT 1
                FROM "SaleItem" si 
                JOIN "Product" pr ON pr."id" = si."product_id"
                WHERE si."sale_id" = p."id"
                  AND pr."sector" = ${category}
              )`
							: Prisma.empty
					}
          AND EXISTS (
            SELECT 1
            FROM "Pedido" p2
            WHERE 
              p2."customerId" = p."customerId"
              AND p2."data_pedido" < ${prevStart}
              ${
								customerType && customerType !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "Customer" c2
                    WHERE c2."id" = p2."customerId"
                      AND c2."person_type" = ${Prisma.raw(`'${customerType}'::"PersonType"`)}
                  )`
									: Prisma.empty
							}
              ${
								category && category !== 'all'
									? Prisma.sql`AND EXISTS (
                    SELECT 1
                    FROM "SaleItem" si2 
                    JOIN "Product" pr2 ON pr2."id" = si2."product_id"
                    WHERE si2."sale_id" = p2."id"
                      AND pr2."sector" = ${category}
                  )`
									: Prisma.empty
							}
          );
      `,
			);
			recorrentesAnt = Number(result?.cnt ?? 0);
		}

		const revPorClienteAnt =
			totalClientesUnicosAnt > 0
				? Number((totalReceitaAnt / totalClientesUnicosAnt).toFixed(2))
				: 0;

		function diffEPercentual(atual: number, anterior: number) {
			const diff = atual - anterior;
			const pct =
				anterior !== 0 ? Number(((diff / anterior) * 100).toFixed(2)) : null;
			return { diff, pct };
		}

		const faturamentoDiff = diffEPercentual(totalReceitaAtual, totalReceitaAnt);
		const ticketMedioDiff = diffEPercentual(ticketMedioAtual, ticketMedioAnt);
		const vendasDiff = diffEPercentual(totalVendasAtual, totalVendasAnt);
		const novosClientesDiff = diffEPercentual(
			novosClientesAtual,
			novosClientesAnt,
		);
		const recorrentesDiff = diffEPercentual(recorrentesAtual, recorrentesAnt);
		const revPorClienteDiff = diffEPercentual(
			revPorClienteAtual,
			revPorClienteAnt,
		);

		return NextResponse.json({
			ok: true,
			data: {
				current: {
					totalRevenue: totalReceitaAtual ?? 0,
					averageTicket: ticketMedioAtual ?? 0,
					totalSales: totalVendasAtual ?? 0,
					newCustomers: novosClientesAtual ?? 0,
					recurringCustomers: recorrentesAtual ?? 0,
					revenuePerCustomer: revPorClienteAtual ?? 0,
				},
				previous: {
					totalRevenue: totalReceitaAnt ?? 0,
					averageTicket: ticketMedioAnt ?? 0,
					totalSales: totalVendasAnt ?? 0,
					newCustomers: novosClientesAnt ?? 0,
					recurringCustomers: recorrentesAnt ?? 0,
					revenuePerCustomer: revPorClienteAnt ?? 0,
				},
				diff: {
					totalRevenue: faturamentoDiff.diff ?? 0,
					totalRevenuePct: faturamentoDiff.pct ?? 0,
					averageTicket: ticketMedioDiff.diff ?? 0,
					averageTicketPct: ticketMedioDiff.pct ?? 0,
					totalSales: vendasDiff.diff ?? 0,
					totalSalesPct: vendasDiff.pct ?? 0,
					newCustomers: novosClientesDiff.diff ?? 0,
					newCustomersPct: novosClientesDiff.pct ?? 0,
					recurringCustomers: recorrentesDiff.diff ?? 0,
					recurringCustomersPct: recorrentesDiff.pct ?? 0,
					revenuePerCustomer: revPorClienteDiff.diff ?? 0,
					revenuePerCustomerPct: revPorClienteDiff.pct ?? 0,
				},
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
