/** @format */

import { createGoogleAdsCustomer } from '@/lib/google-ads-client';
import { Constraints } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
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

		const customer = await createGoogleAdsCustomer();

		const topCampaigns = await customer.report({
			entity: 'campaign',
			attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
			metrics: ['metrics.impressions', 'metrics.clicks', 'metrics.conversions'],
			constraints: [
				{
					key: 'campaign.status',
					op: '=',
					val: 'ENABLED',
				},
				...campaignConstraints,
			],
			order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
			limit: 5,
			from_date: startDate!,
			to_date: endDate!,
		});

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
