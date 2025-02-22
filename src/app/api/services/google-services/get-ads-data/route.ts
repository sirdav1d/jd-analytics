/** @format */

import { refreshAccessTokenAction } from '@/actions/google/refresh-token';
import { prisma } from '@/lib/prisma';
import { enums, GoogleAdsApi } from 'google-ads-api';
import { NextResponse } from 'next/server';

export async function GET() {
	const { success, error } = await refreshAccessTokenAction();

	if (!success || error) {
		console.log(error);
		return NextResponse.json({
			error: 'Erro ao buscar dados do Google ADS' + error,
			ok: false,
			data: null,
		});
	}

	const organization = await prisma.organization.findFirst();

	if (!organization || !organization.googleAccessToken) {
		return NextResponse.json({
			error: 'Token de acesso ausente',
			ok: false,
			data: null,
		});
	}

	try {
		// Instancia o cliente da API Analytics Data (v1beta)
		const client = new GoogleAdsApi({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
		});

		const customer = client.Customer({
			customer_id: '2971952651', // ID do cliente
			refresh_token: organization.googleRefreshToken!, // O refresh token
			login_customer_id: '8251122454',
		});

		const campaigns = await customer.report({
			entity: 'campaign',
			attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
			metrics: ['metrics.impressions', 'metrics.clicks', 'metrics.conversions'],
			constraints: [
				{
					key: 'campaign.status',
					op: '=',
					val: enums.CampaignStatus.ENABLED,
				},
			],
		});

		// Verifica se há dados antes de retornar
		if (!campaigns || campaigns.length === 0) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		// const campaignData = response.map((campaign) => ({
		// 	campaignId: campaign?.campaign?.id,
		// 	campaignName: campaign.campaign?.name,
		// 	impressions: campaign.metrics?.impressions,
		// 	clicks: campaign.metrics?.clicks,
		// 	conversions: campaign.metrics?.conversions,
		// }));

		return NextResponse.json({
			ok: true,
			data: campaigns,
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
