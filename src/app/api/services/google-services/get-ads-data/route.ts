/** @format */

import { resolveGoogleAdsAccount } from '@/lib/google-ads-account';
import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { resolveCivilDateRange } from '@/services/data-services/civil-date-range';
import { Constraints, enums, GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';
import { parseISO, subMonths, format } from 'date-fns';
import { prisma } from '@/lib/prisma';

const GOOGLE_ADS_METRIC_KEYS = [
	'ctr',
	'impressions',
	'clicks',
	'cost_micros',
	'conversions',
] as const;

type GoogleAdsMetricKey = (typeof GOOGLE_ADS_METRIC_KEYS)[number];

function readMetric(
	metrics: Partial<Record<GoogleAdsMetricKey, unknown>> | null | undefined,
	key: GoogleAdsMetricKey,
) {
	const value = metrics?.[key];
	const parsed =
		typeof value === 'number' ? value : Number.parseFloat(String(value ?? 0));
	return Number.isFinite(parsed) ? parsed : 0;
}

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
			login_customer_id: managerId,
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
		const currentRange = resolveCivilDateRange(startDate, endDate);
		const previousRange = resolveCivilDateRange(previousStart, previousEnd);

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
						gte: currentRange.start,
						lte: currentRange.end,
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
						gte: previousRange.start,
						lte: previousRange.end,
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

		const parsedMetrics = Object.fromEntries(
			GOOGLE_ADS_METRIC_KEYS.map((key) => {
				const curr = readMetric(currentMetrics, key);
				const prev = readMetric(previousMetrics, key);

				return [key, {
				current: curr,
				previous: prev,
				diff: curr - prev,
				percentChange: prev === 0 ? null : ((curr - prev) / prev) * 100,
				}] as const;
			}),
		);

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
