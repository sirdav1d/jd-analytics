import type { McpServer } from '@modelcontextprotocol/server';
import { McpPublicError } from '@/mcp/core/errors';
import { registerJdTool } from '@/mcp/core/register-tool';
import { commercialFiltersSchema, periodFiltersSchema } from '@/mcp/core/contracts';
import {
	getCommercialBigNumbers,
	getCommercialOriginData,
	getCommercialRankings,
	getCommercialSalesBy,
	getResultsByOrganization,
} from '@/services/data-services/shared-read-services';
import { z } from 'zod';

const periodSummarySchema = z.object({
	totalRevenue: z.number().describe('Receita total do período.'),
	averageTicket: z.number().describe('Ticket médio do período.'),
	totalSales: z.number().int().describe('Quantidade de vendas.'),
	newCustomers: z.number().int().describe('Clientes novos.'),
	recurringCustomers: z.number().int().describe('Clientes recorrentes.'),
	revenuePerCustomer: z.number().describe('Receita média por cliente.'),
}).strict();

const bigNumbersOutputSchema = z.object({
	current: periodSummarySchema,
	previous: periodSummarySchema,
	diff: z.record(z.string(), z.number()).describe('Diferenças absolutas e percentuais por indicador.'),
}).strict().describe('Indicadores comerciais atuais, anteriores e suas diferenças.');

const sellerRankingSchema = z.object({
	posicao: z.number().int().describe('Posição do vendedor; empates compartilham a mesma posição.'),
	name: z.string().describe('Nome do vendedor.'),
	sales: z.number().int().describe('Quantidade de pedidos.'),
	revenue: z.number().describe('Receita atribuída ao vendedor.'),
	avgTicket: z.number().describe('Ticket médio do vendedor.'),
}).strict();

const productRankingSchema = z.object({
	posicao: z.number().int().describe('Posição do produto; empates compartilham a mesma posição.'),
	name: z.string().describe('Descrição do produto.'),
	code: z.string().describe('Código externo do produto.'),
	sales: z.number().describe('Unidades vendidas.'),
	revenue: z.number().describe('Receita do produto.'),
}).strict();

const customerRankingSchema = z.object({
	posicao: z.number().int().describe('Posição do cliente; empates compartilham a mesma posição.'),
	name: z.string().describe('Nome do cliente.'),
	code: z.string().describe('Código externo do cliente.'),
	purchases: z.number().int().describe('Quantidade de compras.'),
	revenue: z.number().describe('Receita do cliente.'),
}).strict();

const rankingsOutputSchema = z.object({
	sellers: z.array(sellerRankingSchema),
	products: z.array(productRankingSchema),
	topCustomers: z.array(customerRankingSchema),
}).strict().describe('Rankings de vendedores, produtos e clientes.');

const salesByOutputSchema = z.object({
	salesByClient: z.array(z.object({ type: z.string(), revenue: z.number() }).strict()),
	salesByCategory: z.array(z.object({ category: z.string(), revenue: z.number() }).strict()),
	SalesByPayment: z.array(z.object({ method: z.string(), revenue: z.number() }).strict()),
	salesByItemType: z.array(z.object({ type: z.string(), revenue: z.number() }).strict()),
	salesByClientType: z.array(z.object({ type: z.string(), clients: z.number().int(), revenue: z.number() }).strict()),
	revenueOverTime: z.array(z.object({ label: z.string(), revenue: z.number() }).strict()),
}).strict().describe('Séries comerciais por cliente, categoria, pagamento, tipo e período.');

const originRowSchema = z.object({ origin: z.string(), fill: z.string() }).strict();
const originOutputSchema = z.object({
	revenueByOrigin: z.array(originRowSchema.extend({ revenue: z.number() })),
	salesCountByOrigin: z.array(originRowSchema.extend({ sales_count: z.number().int() })),
	avgTicketByOrigin: z.array(originRowSchema.extend({ avg_ticket: z.number() })),
}).strict().describe('Receita, vendas e ticket médio por origem comercial.');

const organizationResultSchema = z.object({
	organizationId: z.string(),
	organization: z.string(),
	revenue: z.number(),
	salesCount: z.number().int(),
	newCustomers: z.number().int(),
}).strict();
const organizationOutputSchema = z.object({
	result: z.array(organizationResultSchema),
	historyOrganizations: z.array(z.object({ organizationId: z.string(), organization: z.string() }).strict()),
	revenueByOrg: z.array(z.record(z.string(), z.union([z.number(), z.string()]))),
	salesByOrg: z.array(z.record(z.string(), z.union([z.number(), z.string()]))),
}).strict().describe('Resultado e séries históricas agrupadas por organização.');

function unwrap<T>(result: { ok: boolean; data: T | null }) {
	if (!result.ok || result.data === null) throw new McpPublicError('UPSTREAM_UNAVAILABLE');

	return result.data;
}

export function registerCommercialTools(server: McpServer) {
	registerJdTool(server, {
		name: 'jd_commercial_big_numbers',
		title: 'Indicadores comerciais',
		description: 'Retorna os mesmos indicadores exibidos no dashboard comercial para o período e filtros informados.',
		inputSchema: commercialFiltersSchema,
		outputSchema: bigNumbersOutputSchema,
		execute: async (input, user) => {
			const result = await getCommercialBigNumbers(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_commercial_rankings',
		title: 'Rankings comerciais',
		description: 'Retorna rankings de vendedores, produtos e clientes, mantendo a mesma regra de empate do serviço do dashboard.',
		inputSchema: commercialFiltersSchema,
		outputSchema: rankingsOutputSchema,
		execute: async (input, user) => {
			const result = await getCommercialRankings(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_commercial_sales_by',
		title: 'Vendas por dimensão',
		description: 'Retorna as mesmas séries de vendas por cliente, categoria, pagamento, tipo de item, recorrência e período.',
		inputSchema: commercialFiltersSchema,
		outputSchema: salesByOutputSchema,
		execute: async (input, user) => {
			const result = await getCommercialSalesBy(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_commercial_origin_data',
		title: 'Vendas por origem',
		description: 'Retorna receita, quantidade e ticket médio agrupados pela origem comercial do dashboard.',
		inputSchema: commercialFiltersSchema,
		outputSchema: originOutputSchema,
		execute: async (input, user) => {
			const result = await getCommercialOriginData(user, input);

			return unwrap(result);
		},
	});

	registerJdTool(server, {
		name: 'jd_results_by_organization',
		title: 'Resultados por organização',
		description: 'Retorna histórico de receita e vendas por organização para o período informado.',
		inputSchema: periodFiltersSchema,
		outputSchema: organizationOutputSchema,
		execute: async (input, user) => {
			const result = await getResultsByOrganization(user, input);

			return unwrap(result);
		},
	});
}
