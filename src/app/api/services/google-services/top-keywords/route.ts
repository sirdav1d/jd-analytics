/** @format */

import { resolveGoogleAdsAccount } from '@/lib/google-ads-account';
import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { Constraints, GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const orgId = process.env.JD_CENTRO_ID;
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const campaignId = searchParams.get('campaignId') ?? 'all'; // Captura o ID da campanha
	try {
		const scopeParam = searchParams.get('scope');
		const { customerId, managerId } = resolveGoogleAdsAccount(scopeParam);
		const { refreshToken } = await getAuthenticatedClient(orgId!);

		const googleAdsClient = new GoogleAdsApi({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
		});
		const customer = googleAdsClient.Customer({
			customer_id: customerId,
			refresh_token: refreshToken,
			linked_customer_id: managerId,
		});

		const campaignConstraints: Constraints = [];

		if (campaignId && campaignId !== 'all') {
			campaignConstraints.push({
				key: 'campaign.id',
				op: '=',
				val: campaignId,
			});
		}

		const topKeyWords = await customer.report({
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
		});

		// Verifica se há dados antes de retornar
		if (!topKeyWords) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			ok: true,
			data: topKeyWords,
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
