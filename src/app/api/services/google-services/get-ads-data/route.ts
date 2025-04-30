/** @format */

import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { Constraints, enums, GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

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

		const [topCampaigns, dataADS] = await Promise.all([
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
		]);

		// Verifica se há dados antes de retornar
		if (!dataADS || !topCampaigns) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		const metrics = dataADS.length > 0 ? dataADS[0].metrics : null;

		return NextResponse.json({
			ok: true,
			data: [topCampaigns, metrics],
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
