/** @format */

import { resolveGoogleAdsAccount } from '@/lib/google-ads-account';
import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { prisma } from '@/lib/prisma';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const scopeParam = req.nextUrl.searchParams.get('scope');
		const { customerId, managerId } = resolveGoogleAdsAccount(scopeParam);
		const roasGoals = await prisma.roasGoal.findMany({
			orderBy: { goalDateRef: 'desc' },
		});
		if (!roasGoals.length) {
			return NextResponse.json(
				{ ok: false, error: 'Nenhuma meta encontrada', data: null },
				{ status: 404 },
			);
		}

		const orgId = process.env.JD_CENTRO_ID!;
		const { refreshToken } = await getAuthenticatedClient(orgId);

		const googleAdsClient = new GoogleAdsApi({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
		});

		const customer = googleAdsClient.Customer({
			customer_id: customerId,
			refresh_token: refreshToken,
			linked_customer_id: managerId,
		});

		const results = await Promise.all(
			roasGoals.map(async (goal) => {
				const start = startOfMonth(goal.goalDateRef);
				const end = endOfMonth(goal.goalDateRef);

				// 1. Busca faturamento de pedidos com origem Google
				const pedidos = await prisma.pedido.findMany({
					where: {
						data_pedido: {
							gte: start,
							lte: end,
						},
						Origin: {
							name: {
								contains: 'google',
								mode: 'insensitive',
							},
						},
					},
					include: {
						items: true,
					},
				});

				const faturamento = pedidos.reduce((total, pedido) => {
					const somaPedido = pedido.items.reduce(
						(sum, item) => sum + item.totalValue,
						0,
					);
					return total + somaPedido;
				}, 0);

				// 2. Busca custo do Google Ads
				const data = await customer.report({
					entity: 'customer',
					metrics: ['metrics.cost_micros'],
					from_date: start.toISOString().split('T')[0],
					to_date: end.toISOString().split('T')[0],
				});

				const custoMicros = data?.[0]?.metrics?.cost_micros ?? 0;

				const custo = custoMicros / 1_000_000;

				// 3. Cálculo de ROAS real
				const roasAtingido = custo === 0 ? null : faturamento / custo;

				return {
					...goal,
					faturamento,
					custo,
					roasAtingido,
				};
			}),
		);

		// Dados para os bigNumbers (usando o mês mais recente)
		const roasMaisRecente = results[0]; // ordenado por goalDateRef desc

		const hoje = new Date();
		const inicioMes = startOfMonth(hoje);

		// Faturamento e custo do mês atual
		const pedidosAtuais = await prisma.pedido.findMany({
			where: {
				data_pedido: {
					gte: inicioMes,
					lte: hoje,
				},
				Origin: {
					name: {
						contains: 'google',
						mode: 'insensitive',
					},
				},
			},
			include: {
				items: true,
			},
		});

		const faturamentoAtual = pedidosAtuais.reduce((total, pedido) => {
			const soma = pedido.items.reduce((sum, item) => sum + item.totalValue, 0);
			return total + soma;
		}, 0);

		const dataAtual = await customer.report({
			entity: 'customer',
			metrics: ['metrics.cost_micros'],
			from_date: inicioMes.toISOString().split('T')[0],
			to_date: hoje.toISOString().split('T')[0],
		});

		const custoAtualMicros = dataAtual?.[0]?.metrics?.cost_micros ?? 0;
		const custoAtual = custoAtualMicros / 1_000_000;

		const roasPrevisto =
			custoAtual === 0 ? null : faturamentoAtual / custoAtual;

		return NextResponse.json({
			ok: true,
			data: results,
			bigNumbers: {
				metaAtual: roasMaisRecente?.roas ?? null,
				roasAtingido: roasMaisRecente?.roasAtingido ?? null,
				roasPrevisto: roasPrevisto ?? null,
			},
			error: null,
		});
	} catch (error) {
		console.error('Erro ao buscar ROAS goals:', error);
		return NextResponse.json(
			{ ok: false, error: 'Erro ao buscar metas de ROAS', data: null },
			{ status: 500 },
		);
	}
}
