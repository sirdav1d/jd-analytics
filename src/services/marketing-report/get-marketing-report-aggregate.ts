/** @format */

import { resolveGoogleAdsAccount, type GoogleAdsScope } from '@/lib/google-ads-account';
import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { prisma } from '@/lib/prisma';
import { GoogleAdsApi } from 'google-ads-api';
import { unstable_cache } from 'next/cache';

export type MarketingReportAggregate = {
	periodStart: string;
	periodEnd: string;
	investments: {
		meta: number;
		googleCentroProdutos: number;
		googleIcaraiServicos: number;
	};
	custoTotal: number;
	faturamentoTotal: number;
	roasGeral: number;
	formatted: {
		meta: string;
		googleCentroProdutos: string;
		googleIcaraiServicos: string;
		custoTotal: string;
		faturamentoTotal: string;
		roasGeral: string;
	};
	metaInvestmentRef: {
		id: string;
		periodStart: string;
		periodEnd: string;
		lastSyncAt: string;
	};
};

type ApiResponse<T> = { ok: true; data: T; error: null } | { ok: false; data: null; error: string };

function toIsoDate(value: Date) {
	return value.toISOString().split('T')[0];
}

function serializeError(value: unknown) {
	if (typeof value === 'string') {
		return value;
	}
	if (value instanceof Error) {
		return value.stack ?? value.message;
	}
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

function normalizeCustomerId(value: string) {
	return value.replaceAll(/\D/gu, '');
}

type GoogleAdsApiErrorPayload = {
	errors?: Array<{
		message?: string;
		error_code?: {
			authorization_error?: string;
		};
	}>;
	request_id?: string;
	requestId?: string;
};

function getGoogleAdsApiErrorPayload(value: unknown): GoogleAdsApiErrorPayload | null {
	const payload = (() => {
		if (typeof value === 'string') {
			try {
				return JSON.parse(value) as unknown;
			} catch {
				return null;
			}
		}
		return value;
	})();

	if (!payload || typeof payload !== 'object') return null;
	return payload as GoogleAdsApiErrorPayload;
}

function isGoogleAdsPermissionDenied(value: unknown) {
	const payload = getGoogleAdsApiErrorPayload(value);
	const firstError = payload?.errors?.[0];
	const code = firstError?.error_code?.authorization_error;

	if (code !== 'USER_PERMISSION_DENIED') return null;

	const requestId = payload?.request_id ?? payload?.requestId;
	const message = firstError?.message;

	return { requestId, message };
}

const MARKETING_REPORT_CACHE_TAG = 'marketing-report';

const brl = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

function formatBRL(value: number) {
	return brl.format(value).replaceAll('\u00a0', ' ');
}

function formatRoas(value: number) {
	const safeValue = Number.isFinite(value) ? value : 0;
	return safeValue.toLocaleString('pt-BR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

async function fetchGoogleCost(options: {
	scope: GoogleAdsScope;
	startDate: string;
	endDate: string;
}): Promise<number> {
	const orgId = process.env.JD_CENTRO_ID;
	if (!orgId) {
		throw new Error('JD_CENTRO_ID n\u00e3o configurado');
	}

	const { refreshToken } = await getAuthenticatedClient(orgId);
	const { customerId, managerId } = resolveGoogleAdsAccount(options.scope);

	const googleAdsClient = new GoogleAdsApi({
		client_id: process.env.GOOGLE_CLIENT_ID!,
		client_secret: process.env.GOOGLE_CLIENT_SECRET!,
		developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
	});

	const customer = googleAdsClient.Customer({
		customer_id: normalizeCustomerId(customerId),
		refresh_token: refreshToken,
		login_customer_id: managerId ? normalizeCustomerId(managerId) : undefined,
	});

	const rows = await customer.report({
		entity: 'customer',
		metrics: ['metrics.cost_micros'],
		from_date: options.startDate,
		to_date: options.endDate,
	});

	const costMicros = Number(rows?.[0]?.metrics?.cost_micros ?? 0);
	return costMicros / 1_000_000;
}

const getMarketingReportAggregateCached = unstable_cache(
	async (): Promise<MarketingReportAggregate> => {
		const metaInvestment = await prisma.metaInvestment.findFirst({
			orderBy: [{ periodEnd: 'desc' }, { lastSyncAt: 'desc' }],
		});

		if (!metaInvestment) {
			throw new Error('Nenhum investimento META encontrado');
		}

		const periodStart = toIsoDate(metaInvestment.periodStart);
		const periodEnd = toIsoDate(metaInvestment.periodEnd);

		const [googleCentroProdutos, googleIcaraiServicos] = await Promise.all([
			fetchGoogleCost({ scope: 'products', startDate: periodStart, endDate: periodEnd }),
			fetchGoogleCost({ scope: 'services', startDate: periodStart, endDate: periodEnd }),
		]);

		const faturamentoAgg = await prisma.saleItem.aggregate({
			_sum: { totalValue: true },
			where: {
				sale: {
					data_pedido: {
						gte: metaInvestment.periodStart,
						lte: metaInvestment.periodEnd,
					},
					OR: [
						{ Origin: { name: { contains: 'google', mode: 'insensitive' } } },
						{ Origin: { name: { contains: 'meta', mode: 'insensitive' } } },
					],
				},
			},
		});

		const faturamentoTotal = faturamentoAgg._sum.totalValue ?? 0;
		const meta = metaInvestment.totalInvestment;
		const custoTotal = meta + googleCentroProdutos + googleIcaraiServicos;
		const roasGeral = custoTotal === 0 ? 0 : faturamentoTotal / custoTotal;

		return {
			periodStart,
			periodEnd,
			investments: {
				meta,
				googleCentroProdutos,
				googleIcaraiServicos,
			},
			custoTotal,
			faturamentoTotal,
			roasGeral,
			formatted: {
				meta: formatBRL(meta),
				googleCentroProdutos: formatBRL(googleCentroProdutos),
				googleIcaraiServicos: formatBRL(googleIcaraiServicos),
				custoTotal: formatBRL(custoTotal),
				faturamentoTotal: formatBRL(faturamentoTotal),
				roasGeral: formatRoas(roasGeral),
			},
			metaInvestmentRef: {
				id: metaInvestment.id,
				periodStart,
				periodEnd,
				lastSyncAt: metaInvestment.lastSyncAt.toISOString(),
			},
		};
	},
	['marketing-report', 'current'],
	{ tags: [MARKETING_REPORT_CACHE_TAG], revalidate: false },
);

export async function getMarketingReportAggregate(): Promise<ApiResponse<MarketingReportAggregate>> {
	try {
		const data = await getMarketingReportAggregateCached();

		return {
			ok: true,
			data,
			error: null,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Erro desconhecido';
		if (message === 'Nenhum investimento META encontrado') {
			return { ok: false, data: null, error: message };
		}

		const permissionDenied = isGoogleAdsPermissionDenied(error);
		if (permissionDenied) {
			console.warn(
				'getMarketingReportAggregate Google Ads permission denied',
				permissionDenied.requestId ?? '',
			);
			return {
				ok: false,
				data: null,
				error: 'Sem permissão para acessar o Google Ads (verifique login_customer_id e permissões do usuário).',
			};
		}

		console.error('getMarketingReportAggregate', serializeError(error));
		return { ok: false, data: null, error: 'Erro ao agregar dados do relat\u00f3rio de marketing' };
	}
}
