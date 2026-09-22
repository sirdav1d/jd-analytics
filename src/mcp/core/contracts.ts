import { z } from 'zod';
import {
	APP_READ_SERVICE_NAMES,
	commercialFiltersSchema,
	googleAdsFiltersSchema,
	goalTrackingFiltersSchema,
	marketingReportFiltersSchema,
	periodFiltersSchema,
} from '@/services/app-read-contracts';

export const MCP_TOOL_NAMES = [
	'jd_commercial_big_numbers',
	'jd_commercial_rankings',
	'jd_commercial_sales_by',
	'jd_commercial_origin_data',
	'jd_results_by_organization',
	'jd_goals_current',
	'jd_goal_tracking',
	'jd_commercial_goal_targets',
	'jd_marketing_goals',
	'jd_google_ads_data',
	'jd_google_analytics_data',
	'jd_google_top_ads',
	'jd_google_top_keywords',
	'jd_marketing_report',
] as const;

export { APP_READ_SERVICE_NAMES };
export { commercialFiltersSchema, googleAdsFiltersSchema, goalTrackingFiltersSchema, marketingReportFiltersSchema, periodFiltersSchema };

export const emptyInputSchema = z.object({}).strict().describe('Esta operação não recebe filtros adicionais.');

const toolErrorSchema = z.object({
	code: z.enum(['UNAUTHENTICATED', 'FORBIDDEN', 'INVALID_ARGUMENT', 'RATE_LIMITED', 'QUERY_TIMEOUT', 'UPSTREAM_UNAVAILABLE', 'INTERNAL_ERROR']).describe('Código público e estável do erro.'),
	message: z.string().describe('Mensagem segura para exibição ao cliente.'),
}).describe('Erro público quando ok é falso.');

const toolMetaSchema = z.object({
	timezone: z.literal('America/Sao_Paulo'),
	currency: z.literal('BRL'),
	rowCount: z.number().int().min(0),
}).describe('Metadados da execução.');

export function createToolOutputSchema<T extends z.ZodType>(dataSchema: T) {
	return z.object({
		ok: z.boolean(),
		requestId: z.string().uuid(),
		data: dataSchema.nullable(),
		meta: toolMetaSchema,
		error: toolErrorSchema.optional(),
	}).describe('Envelope padronizado de resposta do JD Analytics MCP.');
}
