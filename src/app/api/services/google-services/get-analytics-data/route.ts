/** @format */

import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { formatMetricsChannel } from '@/utils/format-channel-data-google';
import { formatMetrics } from '@/utils/format-static-data-google';
import { formatMetricsTraffic } from '@/utils/format-traffic-data-google';
import { generateBodyChannelAnalytics } from '@/utils/google/body-channel-analytics';
import { generateBodyStaticAnalytics } from '@/utils/google/body-static-analytics';
import { generateBodyTrafficAnalytics } from '@/utils/google/body-traffic-analytics';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import {
	format,
	subDays,
	differenceInCalendarDays,
	startOfDay,
	endOfDay,
} from 'date-fns';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
	const propertyId = '295260064';

	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');

	if (!startDate || !endDate) {
		return NextResponse.json({
			error: 'Parametros de URL não encontrados',
			ok: false,
			data: null,
		});
	}

	const diffInDays = differenceInCalendarDays(
		new Date(`${endDate}T00:00:00`),
		new Date(`${startDate}T00:00:00`),
	);

	const previousStartDate = format(
		subDays(new Date(`${startDate}T00:00:00`), diffInDays + 1),
		'yyyy-MM-dd',
	);
	const previousEndDate = format(
		subDays(new Date(`${endDate}T00:00:00`), diffInDays + 1),
		'yyyy-MM-dd',
	);

	try {
		const orgId = process.env.JD_CENTRO_ID;

		const { oauth2Client } = await getAuthenticatedClient(orgId!);

		await oauth2Client.getAccessToken();

		const analytics = google.analyticsdata('v1beta').properties;

		const [staticBody, staticBodyPrevious, trafficBody, channelBody] = [
			generateBodyStaticAnalytics({
				startDate,
				endDate,
			}),
			generateBodyStaticAnalytics({
				startDate: previousStartDate,
				endDate: previousEndDate,
			}),
			generateBodyTrafficAnalytics({
				startDate,
				endDate,
			}),
			generateBodyChannelAnalytics({
				startDate,
				endDate,
			}),
		];

		const [
			responseStatic,
			resStaticPrevious,
			responseTraffic,
			responseChannel,
		] = await Promise.all([
			analytics.runReport({
				property: `properties/${propertyId}`,
				requestBody: staticBody,
				auth: oauth2Client,
			}),
			analytics.runReport({
				property: `properties/${propertyId}`,
				requestBody: staticBodyPrevious,
				auth: oauth2Client,
			}),
			analytics.runReport({
				property: `properties/${propertyId}`,
				requestBody: trafficBody,
				auth: oauth2Client,
			}),
			analytics.runReport({
				property: `properties/${propertyId}`,
				requestBody: channelBody,
				auth: oauth2Client,
			}),
		]);

		const [dataStatic, dataStaticPrevious, dataTraffic, dataChannel] = [
			responseStatic.data,
			resStaticPrevious.data,
			responseTraffic?.data,
			responseChannel?.data,
		];

		if (!dataStatic || !dataTraffic || !dataChannel || !dataStaticPrevious) {
			return NextResponse.json({
				error: 'Erro ao buscar dados do Google Analytics',
				ok: false,
				data: null,
			});
		}

		const [staticMetrics, staticPrevious, trafficMetrics, channelMetrics] = [
			formatMetrics(dataStatic),
			formatMetrics(dataStaticPrevious),
			formatMetricsTraffic(dataTraffic),
			formatMetricsChannel(dataChannel),
		];

		const staticComparison = Object.keys(staticMetrics).reduce(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(acc: Record<string, any>, key) => {
				const currentVal = parseFloat(staticMetrics[key] ?? '0') || 0;
				const previousVal = parseFloat(staticPrevious[key] ?? '0') || 0;
				const difference = currentVal - previousVal;
				const percentChange =
					previousVal !== 0
						? ((difference / previousVal) * 100).toFixed(2)
						: null;

				acc[key] = {
					valorAtual: currentVal,
					valorAnterior: previousVal,
					diferenca: difference,
					percentual: percentChange ? `${percentChange}%` : 'N/A',
				};

				return acc;
			},
			{},
		);

		const [pedidosAtual, pedidosAnterior] = await Promise.all([
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
				include: {
					items: true,
				},
			}),
			prisma.pedido.findMany({
				where: {
					data_pedido: {
						gte: startOfDay(new Date(previousStartDate)),
						lte: endOfDay(new Date(previousEndDate)),
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
			}),
		]);

		function calcularTotal(pedidos: typeof pedidosAtual) {
			return pedidos.reduce((total, pedido) => {
				const totalPedido = pedido.items.reduce(
					(sum, item) => sum + item.totalValue,
					0,
				);
				return total + totalPedido;
			}, 0);
		}

		const valorAtual = calcularTotal(pedidosAtual);
		const valorAnterior = calcularTotal(pedidosAnterior);
		const diferenca = valorAtual - valorAnterior;
		const percentual =
			valorAnterior !== 0
				? `${((diferenca / valorAnterior) * 100).toFixed(2)}%`
				: 'N/A';

		const faturamentoGoogle = {
			valorAtual,
			valorAnterior,
			diferenca,
			percentual,
		};

		return NextResponse.json({
			ok: true,
			data: [
				staticComparison,
				trafficMetrics,
				channelMetrics,
				faturamentoGoogle,
			],
			error: null,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			error: 'Erro ao buscar dados do Google Analytics' + error,
			ok: false,
			data: null,
		});
	}
}
