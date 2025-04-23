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
		
		const [topAds, topKeyWords] = await Promise.all([
			customer.report({
				entity: 'ad_group_ad',
				attributes: [
					'ad_group_ad.ad.id',
					'ad_group_ad.ad.name',
					'ad_group_ad.status',
					'ad_group_ad.ad.responsive_search_ad.headlines',
					'ad_group_ad.ad.smart_campaign_ad.headlines',
				],
				metrics: [
					'metrics.ctr',
					'metrics.impressions',
					'metrics.clicks',
					'metrics.conversions',
					'metrics.engagements',
					'metrics.all_conversions',
				],
				constraints: [
					{
						key: 'ad_group_ad.status',
						op: '=',
						val: 'ENABLED',
					},
					...campaignConstraints,
				],
				order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
				limit: 5,
				from_date: startDate!,
				to_date: endDate!,
			}),
			customer.report({
				entity: 'keyword_view',
				attributes: [
					'ad_group_criterion.keyword.text',
					'ad_group_criterion.status', // Status da palavra-chave
					'campaign.status',
				],
				metrics: [
					'metrics.ctr',
					'metrics.impressions',
					'metrics.clicks',
					'metrics.conversions',
				],
				constraints: [
					{
						key: 'campaign.status',
						op: '=',
						val: 'ENABLED',
					},
					{
						key: 'ad_group_criterion.status',
						op: '=',
						val: 'ENABLED',
					},
					...campaignConstraints,
				],
				order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
				limit: 5,
				from_date: startDate!,
				to_date: endDate!,
			}),
		]);
		

		// Verifica se há dados antes de retornar
		if (!topAds) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			ok: true,
			data: [topAds, topKeyWords],
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
