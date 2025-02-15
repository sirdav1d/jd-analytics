/** @format */

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	const startDate = searchParams?.get('startDate') || '60daysAgo';
	const endDate = searchParams?.get('endDate') || 'today';
	const channelFilter = searchParams.get('channel');

	console.log({ channel: channelFilter });

	try {
		const organization = await prisma.organization.findFirst();
		const propertyId = '465499652';

		if (!organization || !organization.googleAccessToken || !propertyId) {
			return NextResponse.json(
				{ error: 'Token de acesso ou ID da propriedade ausente', ok: false },
				{ status: 401 },
			);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const bodytraffic: any = {
			dateRanges: [{ startDate: startDate, endDate: endDate }],
			metrics: [
				{ name: 'totalUsers' }, // Usuários
			],
			dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const bodyStatic: any = {
			dateRanges: [{ startDate: startDate, endDate: endDate }],
			metrics: [
				{ name: 'sessions' }, // Sessões
				{ name: 'totalUsers' }, // Usuários
				{ name: 'bounceRate' }, // Taxa de rejeição
				{ name: 'sessionConversionRate' }, // Taxa de conversão do site
				{ name: 'purchaseRevenue' }, // ecommerce faturamento
				{ name: 'averageSessionDuration' }, //duração média de sessão
				{ name: 'eventCount' }, // Conversões
				{ name: 'screenPageViews' }, // Total de visualizações de página
			],
		};
		//Se o usuário escolheu um canal específico, adicionamos um filtro
		if (channelFilter && channelFilter !== null && channelFilter !== 'all') {
			bodyStatic.dimensionFilter = {
				filter: {
					fieldName: 'sessionDefaultChannelGrouping',
					stringFilter: { matchType: 'EXACT', value: channelFilter },
				},
			};
			bodytraffic.dimensionFilter = {
				filter: {
					fieldName: 'sessionDefaultChannelGrouping',
					stringFilter: { matchType: 'EXACT', value: channelFilter },
				},
			};
		}

		const responseStatic = await fetch(
			`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${organization.googleAccessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bodyStatic),
			},
		);

		const responsetraffic = await fetch(
			`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${organization.googleAccessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bodytraffic),
			},
		);

		if (!responseStatic.ok || !responsetraffic.ok) {
			console.log(responseStatic, responsetraffic);

			return NextResponse.json({
				error: 'Erro ao buscar dados do Google Analytics',
				ok: false,
				data: null,
			});
		}

		const data = await responseStatic.json();
		const formattedMetrics: { [key: string]: string | null } = {};
		if (data?.metricHeaders && data?.rows && data.rows.length > 0) {
			const headers = data.metricHeaders;
			const firstRow = data.rows[0];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			headers.forEach((header: any, index: number) => {
				formattedMetrics[header.name] =
					firstRow.metricValues[index]?.value || null;
			});
		}

		const dataTraffic = await responsetraffic.json();
		const userByChannel: { [key: string]: number } = {
			'Organic Search': 0,
			'Paid Search': 0,
			Social: 0,
			Direct: 0,
			Other: 0,
		};

		if (
			dataTraffic?.metricHeaders &&
			dataTraffic?.rows &&
			dataTraffic.rows.length > 0
		) {
			// Processando os usuários por canal
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			dataTraffic.rows.forEach((row: any) => {
				const channel = row.dimensionValues[0]?.value || 'Outros';
				const totalUsers = row.metricValues[0]?.value || 0;

				// Convertendo o valor para inteiro, para somar corretamente
				if (channel && totalUsers) {
					userByChannel[channel] =
						(userByChannel[channel] || 0) + parseInt(totalUsers, 10);
				}
			});
		}

		console.log(formattedMetrics);

		return NextResponse.json({
			ok: true,
			data: [formattedMetrics, userByChannel],
			error: null,
		});
	} catch (error) {
		return NextResponse.json({ error: error, ok: false, data: null });
	}
}
