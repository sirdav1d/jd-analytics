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

		const dataADS = await customer.report({
			entity: 'customer',
			metrics: [
				'metrics.ctr',
				'metrics.impressions',
				'metrics.clicks',
				'metrics.cost_micros',
				'metrics.conversions',
			],
			...campaignConstraints,
			from_date: startDate!,
			to_date: endDate!,
		});

		const metrics = dataADS[0].metrics;

		// Verifica se há dados antes de retornar
		if (!dataADS || dataADS.length === 0) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			ok: true,
			data: metrics,
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
