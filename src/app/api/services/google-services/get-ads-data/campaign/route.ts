/** @format */

import { client } from '@/lib/google-ads-client';
import { refreshAccessToken } from '@/lib/refresh-token';
import { Constraints } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const { refreshToken, success, error } = await refreshAccessToken();
	if (!success || !refreshToken) {
		return NextResponse.json({
			ok: false,
			data: null,
			error: 'Erro ao atualizar o token de acesso: ' + error,
		});
	}

	try {
		const searchParams = req.nextUrl.searchParams;
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');
		const campaignId = searchParams.get('campaignId') ?? 'all'; // Captura o ID da campanha

		const campaignConstraints: Constraints = [];

		if (campaignId && campaignId !== 'all') {
			campaignConstraints.push({
				key: 'campaign.id',
				op: '=',
				val: campaignId,
			});
		}

		const customer = client.Customer({
			customer_id: '2971952651', // ID do cliente
			refresh_token: refreshToken, // O refresh token
			login_customer_id: '8251122454',
		});

		const topCampaigns = await customer.report({
			entity: 'campaign',
			attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
			metrics: [
				'metrics.impressions',
				'metrics.clicks',
				'metrics.all_conversions',
			],
			constraints: [
				{
					key: 'campaign.status',
					op: '=',
					val: 'ENABLED',
				},
				...campaignConstraints,
			],
			order: [{ field: 'metrics.all_conversions', sort_order: 'DESC' }],
			limit: 5,
			from_date: startDate!,
			to_date: endDate!,
		});

		console.log('Top Campaigns:', topCampaigns);
		// Verifica se há dados antes de retornar
		if (!topCampaigns) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			ok: true,
			data: topCampaigns,
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
