import type { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { McpPublicError } from '@/mcp/core/errors';
import { registerJdTool } from '@/mcp/core/register-tool';
import { googleAdsFiltersSchema, marketingReportFiltersSchema, periodFiltersSchema } from '@/mcp/core/contracts';
import { getAuthenticatedMarketingReport } from '@/services/marketing-report/get-marketing-report-aggregate';
import { getGoogleAdsData, getGoogleAnalyticsData, getGoogleTopAds, getGoogleTopKeywords } from '@/services/google-services/shared-operations';

const googleMetricSchema = z.object({
	current: z.number(),
	previous: z.number(),
	diff: z.number(),
	percentChange: z.number().nullable(),
}).strict();

const googleScalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const googleMetricsSchema = z.record(z.string(), googleScalarSchema);

const googleCampaignOutputSchema = z.object({
	campaign: z.object({
		id: googleScalarSchema.optional(),
		name: z.string().optional(),
		status: googleScalarSchema.optional(),
		resource_name: z.string().optional(),
	}).passthrough().optional(),
	metrics: googleMetricsSchema.optional(),
}).passthrough();

const googleAdOutputSchema = z.object({
	ad_group_ad: z.object({
		status: googleScalarSchema.optional(),
		ad: z.object({
			id: googleScalarSchema.optional(),
			name: z.string().optional(),
			resource_name: z.string().optional(),
			responsive_search_ad: z.object({
				headlines: z.array(z.object({
					text: z.string().optional(),
					asset_performance_label: googleScalarSchema.optional(),
				}).passthrough()),
			}).passthrough().optional(),
			smart_campaign_ad: z.object({
				headlines: z.array(z.object({
					text: z.string().optional(),
				}).passthrough()).optional(),
			}).passthrough().optional(),
		}).passthrough().optional(),
	}).passthrough().optional(),
	metrics: googleMetricsSchema.optional(),
}).passthrough();

const googleKeywordOutputSchema = z.object({
	ad_group_criterion: z.object({
		status: googleScalarSchema.optional(),
		keyword: z.object({ text: z.string().optional() }).passthrough().optional(),
	}).passthrough().optional(),
	campaign: z.object({ status: googleScalarSchema.optional() }).passthrough().optional(),
	metrics: googleMetricsSchema.optional(),
}).passthrough();

const analyticsComparisonSchema = z.object({
	valorAtual: z.number(),
	valorAnterior: z.number(),
	diferenca: z.number(),
	percentual: z.string(),
}).strict();

const analyticsChannelSchema = z.record(z.string(), z.object({
	conversions: z.number(),
	sessions: z.number(),
}).strict());

const analyticsOutputSchema = z.array(z.union([
	z.record(z.string(), analyticsComparisonSchema),
	z.record(z.string(), z.number()),
	analyticsChannelSchema,
	analyticsComparisonSchema,
]));

const googleAdsOutputSchema = z.object({
	topCampaigns: z.array(googleCampaignOutputSchema),
	dataADS: z.record(z.string(), googleMetricSchema),
	roas: z.object({ current: z.number(), previous: z.number(), diff: z.number(), percentChange: z.number() }).strict(),
}).strict().describe('Métricas normalizadas do Google Ads e ROAS do app.');
const googleAnalyticsOutputSchema = analyticsOutputSchema.describe('Métricas normalizadas do Google Analytics e faturamento Google do app.');
const googleTopAdsOutputSchema = z.array(googleAdOutputSchema).describe('Anúncios principais do Google Ads com métricas e criativos.');
const googleTopKeywordsOutputSchema = z.array(googleKeywordOutputSchema).describe('Palavras-chave principais do Google Ads com métricas.');
const marketingReportOutputSchema = z.object({
	periodStart: z.string(),
	periodEnd: z.string(),
	investments: z.object({ meta: z.number(), googleCentroProdutos: z.number(), googleIcaraiServicos: z.number() }).strict(),
	custoTotal: z.number(),
	faturamentoTotal: z.number(),
	roasGeral: z.number(),
	formatted: z.object({
		meta: z.string(),
		googleCentroProdutos: z.string(),
		googleIcaraiServicos: z.string(),
		custoTotal: z.string(),
		faturamentoTotal: z.string(),
		roasGeral: z.string(),
	}).strict(),
	metaInvestmentRef: z.object({ id: z.string(), periodStart: z.string(), periodEnd: z.string(), lastSyncAt: z.string() }).strict(),
}).strict().describe('Investimentos, faturamento e ROAS do relatório de marketing autenticado.');

function unwrap<T>(result: { ok: boolean; data: T | null }) {
	if (!result.ok || result.data === null) throw new McpPublicError('UPSTREAM_UNAVAILABLE');

	return result.data;
}

export function registerMarketingTools(server: McpServer) {
	registerJdTool(server, {
		name: 'jd_google_ads_data',
		title: 'Dados do Google Ads',
		description: 'Retorna as métricas de Google Ads e ROAS calculadas pela operação do app.',
		inputSchema: googleAdsFiltersSchema,
		outputSchema: googleAdsOutputSchema,
		openWorld: true,
		execute: async (input, user) => {
			const result = await getGoogleAdsData(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_google_analytics_data',
		title: 'Dados do Google Analytics',
		description: 'Retorna as métricas de Analytics e faturamento Google usadas pelo app.',
		inputSchema: periodFiltersSchema,
		outputSchema: googleAnalyticsOutputSchema,
		openWorld: true,
		execute: async (input, user) => {
			const result = await getGoogleAnalyticsData(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_google_top_ads',
		title: 'Principais anúncios Google',
		description: 'Retorna os cinco anúncios principais da conta Google Ads selecionada.',
		inputSchema: googleAdsFiltersSchema,
		outputSchema: googleTopAdsOutputSchema,
		openWorld: true,
		execute: async (input, user) => {
			const result = await getGoogleTopAds(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_google_top_keywords',
		title: 'Principais palavras-chave Google',
		description: 'Retorna as cinco palavras-chave principais da conta Google Ads selecionada.',
		inputSchema: googleAdsFiltersSchema,
		outputSchema: googleTopKeywordsOutputSchema,
		openWorld: true,
		execute: async (input, user) => {
			const result = await getGoogleTopKeywords(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_marketing_report',
		title: 'Relatório de marketing',
		description: 'Retorna o mesmo agregado autenticado de investimento, faturamento e ROAS do app.',
		inputSchema: marketingReportFiltersSchema,
		outputSchema: marketingReportOutputSchema,
		execute: async (input, user) => {
			const result = await getAuthenticatedMarketingReport(user, input);

			return unwrap(result);
		},
	});
}
