/** @format */

import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { Constraints, GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	interface TopAdIdRow {
		'ad_group_ad.ad.id': string;
		metrics: { conversions: number };
	}

	const orgId = process.env.JD_CENTRO_ID;
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const campaignId = searchParams.get('campaignId') ?? 'all'; // Captura o ID da campanha
	try {
		console.time('auth');
		const { refreshToken } = await getAuthenticatedClient(orgId!);
		console.timeEnd('auth');

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

		console.time('report-top-ads');
		const topAdIdsResults = await customer.report<TopAdIdRow[]>({
			entity: 'ad_group_ad',
			attributes: ['ad_group_ad.ad.id'],
			metrics: ['metrics.conversions'],
			constraints: [
				{ key: 'ad_group_ad.status', op: '=', val: 'ENABLED' },
				...campaignConstraints,
			],
			order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
			limit: 5,
			from_date: startDate!,
			to_date: endDate!,
		});

		const topAdIds = topAdIdsResults.map((r) => r['ad_group_ad.ad.id']);
		const topAds = await customer.report({
			entity: 'ad_group_ad',
			attributes: [
				'ad_group_ad.ad.id',
				'ad_group_ad.ad.name',
				'ad_group_ad.ad.responsive_search_ad.headlines',
			],
			metrics: ['metrics.impressions', 'metrics.clicks', 'metrics.conversions'],
			constraints: [
				{ key: 'ad_group_ad.status', op: '=', val: 'ENABLED' },
				{ key: 'ad_group_ad.ad.id', op: 'IN', val: topAdIds.join(',') },
			],
		});
		console.timeEnd('report-top-ads');

		// Verifica se há dados antes de retornar
		if (!topAds || topAds.length === 0) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			ok: true,
			data: topAds,
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
