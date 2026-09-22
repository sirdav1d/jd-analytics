import 'server-only';

import { google } from 'googleapis';
import { GoogleAdsApi } from 'google-ads-api';
import { assertActiveUser, type AuthorizedUser } from '@/lib/authorization';
import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { resolveGoogleAdsAccount } from '@/lib/google-ads-account';
import { prisma } from '@/lib/prisma';
import { resolveCivilDateRange } from '@/services/data-services/civil-date-range';
import type { GoogleAdsFilters, PeriodFilters } from '@/services/app-read-contracts';
import { formatMetricsChannel } from '@/utils/format-channel-data-google';
import { formatMetrics } from '@/utils/format-static-data-google';
import { formatMetricsTraffic } from '@/utils/format-traffic-data-google';
import { generateBodyChannelAnalytics } from '@/utils/google/body-channel-analytics';
import { generateBodyStaticAnalytics } from '@/utils/google/body-static-analytics';
import { generateBodyTrafficAnalytics } from '@/utils/google/body-traffic-analytics';

export const googleAdsResponseSchema = { _type: 'google-ads' } as const;
export const googleAnalyticsResponseSchema = { _type: 'google-analytics' } as const;
export const googleTopAdsResponseSchema = { _type: 'google-top-ads' } as const;
export const googleTopKeywordsResponseSchema = { _type: 'google-top-keywords' } as const;

const GOOGLE_ADS_METRICS = ['ctr', 'impressions', 'clicks', 'cost_micros', 'conversions'] as const;
const STATIC_ANALYTICS_METRICS = [
	'sessions',
	'totalUsers',
	'bounceRate',
	'sessionConversionRate',
	'purchaseRevenue',
	'averageSessionDuration',
	'eventCount',
	'screenPageViews',
] as const;

type ServiceResponse<T> = { ok: true; data: T; error: null } | { ok: false; data: null; error: string };

async function executeGoogleRead<T>(user: AuthorizedUser, load: () => Promise<ServiceResponse<T>>): Promise<ServiceResponse<T>> {
	assertActiveUser(user);

	try {
		return await load();
	} catch {
		return { ok: false, data: null, error: 'Não foi possível consultar os dados do Google. Tente novamente.' };
	}
}

export function getGoogleAdsData(user: AuthorizedUser, filters: GoogleAdsFilters) {
	return executeGoogleRead(user, () => loadGoogleAdsData(filters));
}

export function getGoogleAnalyticsData(user: AuthorizedUser, filters: PeriodFilters) {
	return executeGoogleRead(user, () => loadGoogleAnalyticsData(filters));
}

export function getGoogleTopAds(user: AuthorizedUser, filters: GoogleAdsFilters) {
	return executeGoogleRead(user, () => loadGoogleTopAds(filters));
}

export function getGoogleTopKeywords(user: AuthorizedUser, filters: GoogleAdsFilters) {
	return executeGoogleRead(user, () => loadGoogleTopKeywords(filters));
}

function readMetric(metrics: unknown, key: string) {
	if (!metrics || typeof metrics !== 'object') return 0;
	const value = (metrics as Record<string, unknown>)[key];

	return Number(value ?? 0);
}

function metricComparison(currentMetrics: unknown, previousMetrics: unknown) {
	return Object.fromEntries(GOOGLE_ADS_METRICS.map((key) => {
		const current = readMetric(currentMetrics, key);
		const previous = readMetric(previousMetrics, key);

		return [key, {
			current,
			previous,
			diff: current - previous,
			percentChange: previous === 0 ? null : ((current - previous) / previous) * 100,
		}];
	}));
}

async function readGoogleOrders(start: Date, end: Date) {
	return prisma.pedido.findMany({
		where: {
			data_pedido: { gte: start, lte: end },
			Origin: { name: { contains: 'google', mode: 'insensitive' } },
		},
		include: { items: true },
	});
}

function ordersRevenue(orders: Array<{ items: Array<{ totalValue: number }> }>) {
	return orders.reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.totalValue, 0), 0);
}

async function loadGoogleAdsData(
	filters: GoogleAdsFilters,
): Promise<ServiceResponse<Record<string, unknown>>> {
	const range = resolveCivilDateRange(filters.startDate, filters.endDate);
	const previousRange = resolveCivilDateRange(range.previousStartDate, range.previousEndDate);
	const orgId = process.env.JD_CENTRO_ID;

	if (!orgId) throw new Error('JD_CENTRO_ID não configurado');

	const { refreshToken } = await getAuthenticatedClient(orgId);
	if (!refreshToken) return { ok: false, data: null, error: 'Refresh Token não encontrado' };
	const { customerId, managerId } = resolveGoogleAdsAccount(filters.scope);
	const client = new GoogleAdsApi({
		client_id: process.env.GOOGLE_CLIENT_ID ?? '',
		client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
		developer_token: process.env.GOOGLE_DEVELOPER_TOKEN ?? '',
	});
	const customer = client.Customer({ customer_id: customerId, refresh_token: refreshToken, login_customer_id: managerId });
	const campaignConstraints = filters.campaignId === 'all'
		? []
		: [{ key: 'campaign.id', op: '=', val: filters.campaignId }];
	const [topCampaigns, currentData, previousData, currentOrders, previousOrders] = await Promise.all([
		customer.report({
			entity: 'campaign',
			attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
			metrics: ['metrics.impressions', 'metrics.clicks', 'metrics.conversions'],
			constraints: [{ key: 'campaign.status', op: '=', val: 'ENABLED' }, ...campaignConstraints] as never,
			order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
			limit: 5,
			from_date: filters.startDate,
			to_date: filters.endDate,
		}),
		customer.report({ entity: 'customer', metrics: GOOGLE_ADS_METRICS.map((metric) => `metrics.${metric}`) as never, constraints: campaignConstraints as never, from_date: filters.startDate, to_date: filters.endDate }),
		customer.report({ entity: 'customer', metrics: GOOGLE_ADS_METRICS.map((metric) => `metrics.${metric}`) as never, constraints: campaignConstraints as never, from_date: range.previousStartDate, to_date: range.previousEndDate }),
		readGoogleOrders(range.start, range.end),
		readGoogleOrders(previousRange.start, previousRange.end),
	]);
	const currentMetrics = currentData[0]?.metrics;
	const previousMetrics = previousData[0]?.metrics;
	const currentCost = readMetric(currentMetrics, 'cost_micros') / 1_000_000;
	const previousCost = readMetric(previousMetrics, 'cost_micros') / 1_000_000;
	const currentRevenue = ordersRevenue(currentOrders);
	const previousRevenue = ordersRevenue(previousOrders);
	const currentRoas = currentCost === 0 ? 0 : currentRevenue / currentCost;
	const previousRoas = previousCost === 0 ? 0 : previousRevenue / previousCost;

	return {
		ok: true,
		data: {
			topCampaigns,
			dataADS: metricComparison(currentMetrics, previousMetrics),
			roas: {
				current: currentRoas,
				previous: previousRoas,
				diff: currentRoas - previousRoas,
				percentChange: previousRoas === 0 ? 0 : ((currentRoas - previousRoas) / previousRoas) * 100,
			},
		},
		error: null,
	};
}

async function loadGoogleAnalyticsData(
	filters: PeriodFilters,
): Promise<ServiceResponse<unknown[]>> {
	const range = resolveCivilDateRange(filters.startDate, filters.endDate);
	const { oauth2Client } = await getAuthenticatedClient(process.env.JD_CENTRO_ID ?? '');
	await oauth2Client.getAccessToken();
	const analytics = google.analyticsdata('v1beta').properties;
	const currentBodies = {
		static: generateBodyStaticAnalytics({ startDate: filters.startDate, endDate: filters.endDate }),
		traffic: generateBodyTrafficAnalytics({ startDate: filters.startDate, endDate: filters.endDate }),
		channel: generateBodyChannelAnalytics({ startDate: filters.startDate, endDate: filters.endDate }),
	};
	const previousStatic = generateBodyStaticAnalytics({ startDate: range.previousStartDate, endDate: range.previousEndDate });
	const [staticResponse, previousStaticResponse, trafficResponse, channelResponse] = await Promise.all([
		analytics.runReport({ property: 'properties/295260064', requestBody: currentBodies.static, auth: oauth2Client }),
		analytics.runReport({ property: 'properties/295260064', requestBody: previousStatic, auth: oauth2Client }),
		analytics.runReport({ property: 'properties/295260064', requestBody: currentBodies.traffic, auth: oauth2Client }),
		analytics.runReport({ property: 'properties/295260064', requestBody: currentBodies.channel, auth: oauth2Client }),
	]);
	const staticMetrics = formatMetrics(staticResponse.data);
	const previousMetrics = formatMetrics(previousStaticResponse.data);
	const trafficMetrics = formatMetricsTraffic(trafficResponse.data);
	const channelMetrics = formatMetricsChannel(channelResponse.data);
	const staticComparison = Object.fromEntries(STATIC_ANALYTICS_METRICS.map((key) => {
		const current = Number(staticMetrics[key] ?? 0) || 0;
		const previous = Number(previousMetrics[key] ?? 0) || 0;
		const difference = current - previous;

		return [key, {
			valorAtual: current,
			valorAnterior: previous,
			diferenca: difference,
			percentual: previous === 0 ? 'N/A' : `${((difference / previous) * 100).toFixed(2)}%`,
		}];
	}));
	const [currentOrders, previousOrders] = await Promise.all([
		readGoogleOrders(range.start, range.end),
		readGoogleOrders(range.previousStart, range.previousEnd),
	]);
	const currentRevenue = ordersRevenue(currentOrders);
	const previousRevenue = ordersRevenue(previousOrders);
	const difference = currentRevenue - previousRevenue;

	return {
		ok: true,
		data: [
			staticComparison,
			trafficMetrics,
			channelMetrics,
			{
				valorAtual: currentRevenue,
				valorAnterior: previousRevenue,
				diferenca: difference,
				percentual: previousRevenue === 0 ? 'N/A' : `${((difference / previousRevenue) * 100).toFixed(2)}%`,
			},
		],
		error: null,
	};
}

async function loadGoogleTopAds(
	filters: GoogleAdsFilters,
): Promise<ServiceResponse<unknown[]>> {
	const orgId = process.env.JD_CENTRO_ID;
	if (!orgId) throw new Error('JD_CENTRO_ID não configurado');
	const { refreshToken } = await getAuthenticatedClient(orgId);
	if (!refreshToken) return { ok: false, data: null, error: 'Refresh Token não encontrado' };
	const { customerId, managerId } = resolveGoogleAdsAccount(filters.scope);
	const client = new GoogleAdsApi({ client_id: process.env.GOOGLE_CLIENT_ID ?? '', client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '', developer_token: process.env.GOOGLE_DEVELOPER_TOKEN ?? '' });
	const customer = client.Customer({ customer_id: customerId, refresh_token: refreshToken, login_customer_id: managerId });
	const constraints: Array<string | null> = [
		"ad_group_ad.status = 'ENABLED'",
		filters.campaignId === 'all' ? null : `campaign.id = ${filters.campaignId}`,
		`segments.date BETWEEN '${filters.startDate}' AND '${filters.endDate}'`,
	].filter((value): value is string => Boolean(value));
	const result = await customer.query(`SELECT ad_group_ad.ad.id, ad_group_ad.ad.name, ad_group_ad.status, ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.smart_campaign_ad.headlines, metrics.ctr, metrics.impressions, metrics.clicks, metrics.conversions, metrics.engagements, metrics.all_conversions FROM ad_group_ad WHERE ${constraints.join(' AND ')} ORDER BY metrics.conversions DESC LIMIT 5`);

	return { ok: true, data: result, error: null };
}

async function loadGoogleTopKeywords(
	filters: GoogleAdsFilters,
): Promise<ServiceResponse<unknown[]>> {
	const orgId = process.env.JD_CENTRO_ID;
	if (!orgId) throw new Error('JD_CENTRO_ID não configurado');
	const { refreshToken } = await getAuthenticatedClient(orgId);
	if (!refreshToken) return { ok: false, data: null, error: 'Refresh Token não encontrado' };
	const { customerId, managerId } = resolveGoogleAdsAccount(filters.scope);
	const client = new GoogleAdsApi({ client_id: process.env.GOOGLE_CLIENT_ID ?? '', client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '', developer_token: process.env.GOOGLE_DEVELOPER_TOKEN ?? '' });
	const customer = client.Customer({ customer_id: customerId, refresh_token: refreshToken, login_customer_id: managerId });
	const result = await customer.report({
		entity: 'keyword_view',
		attributes: ['ad_group_criterion.keyword.text', 'ad_group_criterion.status', 'campaign.status'],
		metrics: ['metrics.ctr', 'metrics.impressions', 'metrics.clicks', 'metrics.conversions'],
		constraints: [
			{ key: 'campaign.status', op: '=', val: 'ENABLED' },
			{ key: 'ad_group_criterion.status', op: '=', val: 'ENABLED' },
			...(filters.campaignId === 'all' ? [] : [{ key: 'campaign.id', op: '=', val: filters.campaignId }]),
		] as never,
		order: [{ field: 'metrics.conversions', sort_order: 'DESC' }],
		limit: 5,
		from_date: filters.startDate,
		to_date: filters.endDate,
	});

	return { ok: true, data: result, error: null };
}
