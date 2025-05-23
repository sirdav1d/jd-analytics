/** @format */

import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { Constraints, enums, GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';
import { parseISO, subMonths, format } from 'date-fns';

export async function GET(req: NextRequest) {
	const orgId = process.env.JD_CENTRO_ID;
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const campaignId = searchParams.get('campaignId') ?? 'all'; // Captura o ID da campanha
	try {
		const { refreshToken } = await getAuthenticatedClient(orgId!);

		const googleAdsClient = new GoogleAdsApi({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
		});
		const customer = googleAdsClient.Customer({
			customer_id: '2971952651',
			refresh_token: refreshToken,
			linked_customer_id: '8251122454',
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

		const [topCampaigns, currentData, previousData] = await Promise.all([
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

		return NextResponse.json({
			ok: true,
			data: { topCampaigns, dataADS: parsedMetrics },
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
