/** @format */

import { prisma } from '@/lib/prisma';
import { Constraints, GoogleAdsApi } from 'google-ads-api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const refreshToken = await prisma.organization.findFirst({
		select: { googleRefreshToken: true },
	});

	if (!refreshToken) {
		return NextResponse.json({
			error: 'Refresh Token não encontrado',
			ok: false,
			data: null,
		});
	}

	try {
		const searchParams = req.nextUrl.searchParams;
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');
		const campaignId = searchParams.get('campaignId') ?? 'all'; // Captura o ID da campanha

		const googleAdsClient = new GoogleAdsApi({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
		});
		const customer = googleAdsClient.Customer({
			customer_id: '2971952651',
			refresh_token: refreshToken.googleRefreshToken!,
			login_customer_id: '8251122454',
		});

		const campaignConstraints: Constraints = [];

		if (campaignId && campaignId !== 'all') {
			campaignConstraints.push({
				key: 'campaign.id',
				op: '=',
				val: campaignId,
			});
		}

		// Montar cláusula WHERE do GAQL
		const where: string[] = [`ad_group_ad.status = 'ENABLED'`];
		if (campaignId !== 'all') {
			where.push(`campaign.id = ${campaignId}`);
		}
		where.push(`segments.date BETWEEN '${startDate}' AND '${endDate}'`);

		const query = `
      SELECT
        ad_group_ad.ad.id,
        ad_group_ad.ad.name,
        ad_group_ad.status,
        ad_group_ad.ad.responsive_search_ad.headlines,
        ad_group_ad.ad.smart_campaign_ad.headlines,
        metrics.ctr,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.engagements,
        metrics.all_conversions
      FROM ad_group_ad
      WHERE ${where.join('\n        AND ')}
      ORDER BY metrics.conversions DESC
      LIMIT 5
    `;

		console.time('query-top-ads');
		const result = await customer.query(query);

		console.timeEnd('query-top-ads');

		// Verifica se há dados antes de retornar
		if (!result || result.length === 0) {
			return NextResponse.json({
				error: 'Nenhum dado encontrado para os anúncios',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			ok: true,
			data: result,
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
