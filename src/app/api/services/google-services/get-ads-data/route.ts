/** @format */

import { prisma } from '@/lib/prisma';
import { GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	// const { success, error } = await refreshAccessTokenAction();

	// if (!success || error) {
	// 	console.log(error);
	// 	return NextResponse.json({
	// 		error: 'Erro ao buscar dados do Google ADS' + error,
	// 		ok: false,
	// 		data: null,
	// 	});
	// }

	const organization = await prisma.organization.findFirst();

	if (!organization || !organization.googleAccessToken) {
		return NextResponse.json({
			error: 'Token de acesso ausente',
			ok: false,
			data: null,
		});
	}

	try {
		const searchParams = req.nextUrl.searchParams;
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');
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
					val: 'ENABLED',
				},
			],
			order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
			limit: 5,
			from_date: startDate!,
			to_date: endDate!,
		});

		const topAds = await customer.report({
			entity: 'ad_group_ad',
			attributes: [
				'ad_group_ad.ad.id',
				'ad_group_ad.ad.name',
				'ad_group_ad.status',
				'ad_group_ad.ad.responsive_search_ad.headlines',
			],
			metrics: [
				'metrics.ctr',
				'metrics.impressions',
				'metrics.clicks',
				'metrics.conversions',
			],
			constraints: [
				{
					key: 'ad_group_ad.status',
					op: '=',
					val: 'ENABLED',
				},
			],
			order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
			limit: 5,
			from_date: startDate!,
			to_date: endDate!,
		});

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
			],
			order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
			limit: 5,
			from_date: startDate!,
			to_date: endDate!,
		});

		const dataADS = await customer.report({
			entity: 'customer',
			metrics: [
				'metrics.ctr',
				'metrics.impressions',
				'metrics.clicks',
				'metrics.cost_micros',
			],
			from_date: startDate!,
			to_date: endDate!,
		});

		const metrics = dataADS[0].metrics;

		// Verifica se há dados antes de retornar
		if (!campaigns || campaigns.length === 0) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para as campanhas',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			ok: true,
			data: [campaigns, topAds, topKeyWords, metrics],
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
