/** @format */

import { resolveGoogleAdsAccount } from '@/lib/google-ads-account';
import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { Constraints, enums, GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';
import { parseISO, subMonths, format, startOfDay, endOfDay } from 'date-fns';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
	const orgId = process.env.JD_CENTRO_ID;
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const campaignId = searchParams.get('campaignId') ?? 'all'; // Captura o ID da campanha
	const scopeParam = searchParams.get('scope');
	try {
		const { customerId, managerId } = resolveGoogleAdsAccount(scopeParam);
		const { refreshToken } = await getAuthenticatedClient(orgId!);

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

		const campaignConstraints: Constraints = [];

		if (campaignId && campaignId !== 'all') {
			campaignConstraints.push({
				key: 'campaign.id',
				op: '=',
				val: campaignId,
			});
		}

		if (!startDate || !endDate) {
			return NextResponse.json({
				error: 'Parâmetros de data inválidos',
				ok: false,
				data: null,
			});
		}
		const previousStart = format(
			subMonths(parseISO(startDate), 1),
			'yyyy-MM-dd',
		);
		const previousEnd = format(subMonths(parseISO(endDate), 1), 'yyyy-MM-dd');

		const [
			topCampaigns,
			currentData,
			previousData,
			pedidosAtual,
			pedidosAnterior,
		] = await Promise.all([
			customer.report({
				entity: 'campaign',
				attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
				metrics: [
					'metrics.impressions',
					'metrics.clicks',
					'metrics.conversions',
				],
				constraints: [
					{ 'campaign.status': enums.CampaignStatus.ENABLED },
					...campaignConstraints,
				],
				order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
				limit: 5,
				from_date: startDate!,
				to_date: endDate!,
			}),
			customer.report({
				entity: 'customer',
				metrics: [
					'metrics.ctr',
					'metrics.impressions',
					'metrics.clicks',
					'metrics.cost_micros',
					'metrics.conversions',
				],
				constraints: [...campaignConstraints],
				from_date: startDate!,
				to_date: endDate!,
			}),
			customer.report({
				entity: 'customer',
				metrics: [
					'metrics.ctr',
					'metrics.impressions',
					'metrics.clicks',
					'metrics.cost_micros',
					'metrics.conversions',
				],
				constraints: [...campaignConstraints],
				from_date: previousStart,
				to_date: previousEnd,
			}),
			prisma.pedido.findMany({
				where: {
					data_pedido: {
						gte: startOfDay(new Date(startDate)),
						lte: endOfDay(new Date(endDate)),
					},
					Origin: {
						name: {
							contains: 'google',
							mode: 'insensitive',
						},
					},
				},
				include: { items: true },
			}),
			prisma.pedido.findMany({
				where: {
					data_pedido: {
						gte: startOfDay(new Date(previousStart)),
						lte: endOfDay(new Date(previousEnd)),
					},
					Origin: {
						name: {
							contains: 'google',
							mode: 'insensitive',
						},
					},
				},
				include: { items: true },
			}),
		]);

		// Verifica se há dados antes de retornar
		if (!currentData || !topCampaigns) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		const currentMetrics =
			currentData.length > 0 ? currentData[0].metrics : null;
		const previousMetrics =
			previousData.length > 0 ? previousData[0].metrics : null;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const parsedMetrics: { [key: string]: any } = {};
		for (const key in currentMetrics) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const curr = parseFloat((currentMetrics as any)[key]);
			const prev = parseFloat(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				previousMetrics ? ((previousMetrics as any)[key] ?? '0') : '0',
			);

			parsedMetrics[key] = {
				current: curr,
				previous: prev,
				diff: curr - prev,
				percentChange: prev === 0 ? null : ((curr - prev) / prev) * 100,
			};
		}

		function calcularTotal(pedidos: typeof pedidosAtual) {
			return pedidos.reduce((total, pedido) => {
				const totalPedido = pedido.items.reduce(
					(sum, item) => sum + item.totalValue,
					0,
				);
				return total + totalPedido;
			}, 0);
		}

		const receitaAtual = calcularTotal(pedidosAtual);
		const receitaAnterior = calcularTotal(pedidosAnterior);
		const custoAtual =
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			parseFloat((currentMetrics?.cost_micros as any) ?? 0) / 1000000;
		const custoAnterior =
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			parseFloat((previousMetrics?.cost_micros as any) ?? 0) / 1000000;

		const roasAtual = custoAtual === 0 ? 0 : receitaAtual / custoAtual;
		const roasAnterior =
			custoAnterior === 0 ? 0 : receitaAnterior / custoAnterior;

		const roas = {
			current: roasAtual,
			previous: roasAnterior,
			diff:
				roasAtual !== null && roasAnterior !== null
					? roasAtual - roasAnterior
					: 0,
			percentChange:
				roasAnterior && roasAnterior !== 0 && roasAtual !== null
					? ((roasAtual - roasAnterior) / roasAnterior) * 100
					: 0,
		};

		return NextResponse.json({
			ok: true,
			data: { topCampaigns, dataADS: parsedMetrics, roas },
			error: null,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			error: 'Erro ao buscar dados do Google ADS' + JSON.stringify(error),
			ok: false,
			data: null,
		});
	}
}
