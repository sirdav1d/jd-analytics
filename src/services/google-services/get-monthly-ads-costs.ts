/** @format */

import 'server-only';
import { resolveGoogleAdsAccount, type GoogleAdsScope } from '@/lib/google-ads-account';
import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { GoogleAdsApi } from 'google-ads-api';
import { unstable_cache } from 'next/cache';

export type MonthlyGoogleAdsCosts = Record<string, number>;

async function reportMonthlyGoogleAdsCosts(
	scope: GoogleAdsScope,
	fromDate: string,
	toDate: string,
): Promise<MonthlyGoogleAdsCosts> {
	const orgId = process.env.JD_CENTRO_ID;
	if (!orgId) throw new Error('JD_CENTRO_ID não configurado');

	const [{ refreshToken }, { customerId, managerId }] = await Promise.all([
		getAuthenticatedClient(orgId),
		Promise.resolve(resolveGoogleAdsAccount(scope)),
	]);
	const client = new GoogleAdsApi({
		client_id: process.env.GOOGLE_CLIENT_ID!,
		client_secret: process.env.GOOGLE_CLIENT_SECRET!,
		developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
	});
	const customer = client.Customer({
		customer_id: customerId,
		refresh_token: refreshToken,
		login_customer_id: managerId,
	});
	const rows = await customer.report({
		entity: 'customer',
		segments: ['segments.month'],
		metrics: ['metrics.cost_micros'],
		from_date: fromDate,
		to_date: toDate,
	});

	const costs: MonthlyGoogleAdsCosts = {};
	for (const row of rows) {
		const month = row.segments?.month?.slice(0, 7);
		if (!month) continue;
		costs[month] =
			(costs[month] ?? 0) + Number(row.metrics?.cost_micros ?? 0) / 1_000_000;
	}
	return costs;
}

export const getClosedMonthlyGoogleAdsCosts = unstable_cache(
	reportMonthlyGoogleAdsCosts,
	['marketing-goals-google-ads-monthly'],
	{
		revalidate: 86_400,
		tags: ['marketing-goals-google-ads-history'],
	},
);

export function getCurrentMonthlyGoogleAdsCosts(
	scope: GoogleAdsScope,
	fromDate: string,
	toDate: string,
) {
	return reportMonthlyGoogleAdsCosts(scope, fromDate, toDate);
}
