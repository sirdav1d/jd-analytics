import { z } from 'zod';

export const APP_READ_SERVICE_NAMES = [
	'commercialBigNumbers',
	'commercialRankings',
	'commercialSalesBy',
	'commercialOriginData',
	'resultsByOrganization',
	'goalsCurrent',
	'goalTracking',
	'commercialGoalTargets',
	'marketingGoals',
	'googleAdsData',
	'googleAnalyticsData',
	'googleTopAds',
	'googleTopKeywords',
	'marketingReport',
] as const;

const civilDateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/u)
	.describe('Data civil no formato YYYY-MM-DD, no fuso America/Sao_Paulo.');

export const periodFiltersSchema = z
	.object({
		startDate: civilDateSchema.describe('Primeiro dia do período, inclusive.'),
		endDate: civilDateSchema.describe('Último dia do período, inclusive.'),
	})
	.strict()
	.refine(({ startDate, endDate }) => startDate <= endDate, {
		message: 'startDate deve ser menor ou igual a endDate',
	});

export const commercialFiltersSchema = periodFiltersSchema.safeExtend({
	category: z.string().min(1).default('all').describe('Setor dos produtos.'),
	customerType: z.string().min(1).default('all').describe('Tipo de pessoa do cliente.'),
	org: z.string().min(1).default('all').describe('Organização da venda.'),
});

export const googleAdsFiltersSchema = periodFiltersSchema.safeExtend({
	scope: z.enum(['products', 'services']).default('products').describe('Escopo da conta Google Ads.'),
	campaignId: z.string().min(1).default('all').describe('Campanha ou all.'),
});

export const goalTrackingFiltersSchema = periodFiltersSchema;

export const marketingReportFiltersSchema = z
	.object({
		date: civilDateSchema.optional().describe('Data de referência.'),
		period: z.enum(['current-month', 'last-month']).optional().describe('Período do relatório.'),
	})
	.strict();

export type CommercialFilters = z.infer<typeof commercialFiltersSchema>;
export type PeriodFilters = z.infer<typeof periodFiltersSchema>;
export type GoogleAdsFilters = z.infer<typeof googleAdsFiltersSchema>;
export type GoalTrackingFilters = z.infer<typeof goalTrackingFiltersSchema>;
export type MarketingReportFilters = z.infer<typeof marketingReportFiltersSchema>;
