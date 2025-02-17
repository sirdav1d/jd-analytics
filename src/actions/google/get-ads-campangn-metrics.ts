/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { GoogleAdsApi } from 'google-ads-api';
import { refreshAccessTokenAction } from './refresh-token';

export async function getADSMetricsAction() {
	const { success, error } = await refreshAccessTokenAction();

	if (!success || error) {
		console.log(error);
		return {
			error: 'Erro ao buscar dados do Google ADS' + error,
			ok: false,
			data: null,
		};
	}

	const organization = await prisma.organization.findFirst();

	if (!organization || !organization.googleAccessToken) {
		return {
			error: 'Token de acesso ausente',
			ok: false,
			data: null,
		};
	}

	try {
		// Instancia o cliente da API Analytics Data (v1beta)
		const client = new GoogleAdsApi({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
		});

		const customer = client.Customer({
			customer_id: '825-112-2454', // ID do cliente
			refresh_token: organization.googleRefreshToken!, // O refresh token
		});

		const query = `
      SELECT 
        campaign.id, 
        campaign.name, 
        metrics.impressions, 
        metrics.clicks, 
        metrics.conversions
      FROM 
        campaign
      WHERE 
        segments.date DURING LAST_30_DAYS
    `;

		const response = await customer.query(query);

		if (!response || response.length === 0) {
			return {
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			};
		}

		const campaignData = response.map((campaign) => ({
			campaignId: campaign?.campaign?.id,
			campaignName: campaign.campaign?.name,
			impressions: campaign.metrics?.impressions,
			clicks: campaign.metrics?.clicks,
			conversions: campaign.metrics?.conversions,
		}));

		return {
			ok: true,
			data: campaignData,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			error: 'Erro ao buscar dados do Google ADS' + error,
			ok: false,
			data: null,
		};
	}
}
