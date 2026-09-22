import type { McpServer } from '@modelcontextprotocol/server';
import { assertActiveAdmin } from '@/lib/authorization';
import { McpPublicError } from '@/mcp/core/errors';
import { registerJdTool } from '@/mcp/core/register-tool';
import { emptyInputSchema, goalTrackingFiltersSchema } from '@/mcp/core/contracts';
import { getCommercialGoalTargets, getGoalsCurrent, getGoalTracking, getMarketingGoals } from '@/services/data-services/goals-shared-services';
import { z } from 'zod';

const goalsCurrentOutputSchema = z.object({
	commercial: z.object({
		currentRevenue: z.number().describe('Receita comercial realizada.'),
		revenueGoal: z.number().describe('Meta de receita.'),
		difference: z.number().describe('Diferença entre realizado e meta.'),
		percentage: z.number().describe('Percentual da meta atingido.'),
	}).strict(),
	roas: z.object({
		currentRoas: z.number().describe('ROAS realizado.'),
		roasTarget: z.number().describe('Meta de ROAS.'),
		difference: z.number().describe('Diferença entre ROAS realizado e meta.'),
		percentage: z.number().describe('Percentual da meta de ROAS atingido.'),
	}).strict(),
}).strict().describe('Metas comerciais e ROAS correntes do dashboard.');

const goalTrackingOutputSchema = z.object({
	ok: z.literal(true),
	overview: z.array(z.object({
		vendedor: z.string(),
		totalRevenue: z.number(),
		meta: z.number(),
		orderCount: z.number().int(),
		avgTicket: z.number(),
		forecast: z.number(),
		percentualDif: z.number(),
	}).strict()),
	timeSeries: z.array(z.object({ period: z.string(), revenue: z.number() }).strict()),
	companySummary: z.object({ meta: z.number(), realizado: z.number(), forecast: z.number(), diffPercent: z.number() }).strict(),
	error: z.null(),
}).strict().describe('Vendedores, série temporal e resumo empresarial do acompanhamento de metas.');

const goalEntrySchema = z.object({
	sellerId: z.string(),
	sellerName: z.string(),
	revenue: z.number(),
	realized: z.number(),
	month: z.string(),
}).strict();
const goalTargetsOutputSchema = z.object({
	ok: z.literal(true),
	error: z.null(),
	companyGoal: z.object({ meta: z.number(), realized: z.number(), remaining: z.number(), predicted: z.number() }).strict(),
	currentGoals: z.array(z.object({
		goalId: z.string(),
		sellerId: z.string(),
		sellerName: z.string(),
		monthRef: z.string(),
		revenue: z.number(),
		realized: z.number(),
	}).strict()),
	history: z.array(z.object({ month: z.string(), goals: z.array(goalEntrySchema) }).strict()),
}).strict().describe('Metas comerciais administrativas atuais e históricas.');

const marketingGoalSchema = z.object({
	id: z.string(),
	goalDateRef: z.string(),
	roas: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
	faturamento: z.number(),
	custo: z.number(),
	roasAtingido: z.number().nullable(),
}).strict();
const marketingGoalsOutputSchema = z.array(marketingGoalSchema).describe('Metas de ROAS administrativas com faturamento e custo apurados.');
const marketingScopeSchema = z.object({ scope: z.enum(['products', 'services']).default('products').describe('Conta Google Ads usada no cálculo das metas de marketing.') }).strict();

function unwrap<T>(result: { ok: boolean; data?: T | null; error?: string | null }) {
	if (!result.ok || result.data === null || result.data === undefined) throw new McpPublicError('UPSTREAM_UNAVAILABLE');

	return result.data;
}

export function registerGoalTools(server: McpServer) {
	registerJdTool(server, {
		name: 'jd_goals_current',
		title: 'Metas atuais',
		description: 'Retorna a comparação de metas comerciais e ROAS atualmente exibida pelo app.',
		inputSchema: emptyInputSchema,
		outputSchema: goalsCurrentOutputSchema,
		execute: async (_input, user) => {
			const result = await getGoalsCurrent(user);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_goal_tracking',
		title: 'Acompanhamento de metas',
		description: 'Retorna vendedores, série temporal e resumo empresarial do acompanhamento de metas.',
		inputSchema: goalTrackingFiltersSchema,
		outputSchema: goalTrackingOutputSchema,
		execute: async (input, user) => {
			return getGoalTracking(user, input);
		},
	});

	registerJdTool(server, {
		name: 'jd_commercial_goal_targets',
		title: 'Metas comerciais administrativas',
		description: 'Retorna metas comerciais correntes e históricas; exige usuário administrador ativo.',
		inputSchema: emptyInputSchema,
		outputSchema: goalTargetsOutputSchema,
		execute: async (_input, user) => {
			assertActiveAdmin(user);

			return getCommercialGoalTargets(user);
		},
	});

	registerJdTool(server, {
		name: 'jd_marketing_goals',
		title: 'Metas de marketing administrativas',
		description: 'Retorna metas de ROAS, custos e faturamento do app; exige usuário administrador ativo.',
		inputSchema: marketingScopeSchema,
		outputSchema: marketingGoalsOutputSchema,
		execute: async (input, user) => {
			assertActiveAdmin(user);

			return unwrap(await getMarketingGoals(user, input.scope));
		},
	});
}
