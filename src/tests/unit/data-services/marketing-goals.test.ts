import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
	const cache = new Map<string, Promise<unknown>>();
	const cacheOptions: Array<{ revalidate?: number; tags?: string[] }> = [];
	return {
		cache,
		cacheOptions,
		findMany: vi.fn(),
		queryRaw: vi.fn(),
		report: vi.fn(),
		getAuthenticatedClient: vi.fn(),
	};
});

vi.mock('next/cache', () => ({
	unstable_cache: (
		callback: (...args: string[]) => Promise<unknown>,
		keyParts: string[],
		options: { revalidate?: number; tags?: string[] },
	) => {
		mocks.cacheOptions.push(options);
		return (...args: string[]) => {
			const key = JSON.stringify([keyParts, args]);
			const existing = mocks.cache.get(key);
			if (existing) return existing;
			const value = callback(...args);
			mocks.cache.set(key, value);
			return value;
		};
	},
}));

vi.mock('@/lib/prisma', () => ({
	prisma: {
		roasGoal: { findMany: mocks.findMany },
		$queryRaw: mocks.queryRaw,
	},
}));

vi.mock('@/lib/google-authenticated-client', () => ({
	getAuthenticatedClient: mocks.getAuthenticatedClient,
}));

vi.mock('google-ads-api', () => ({
	GoogleAdsApi: class {
		Customer() {
			return { report: mocks.report };
		}
	},
}));

const timestamps = {
	createdAt: new Date('2026-01-01T00:00:00.000Z'),
	updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};
const goals = [
	{ ...timestamps, id: 'future', goalDateRef: new Date('2026-09-01T00:00:00.000Z'), roas: 9 },
	{ ...timestamps, id: 'current', goalDateRef: new Date('2026-08-01T00:00:00.000Z'), roas: 8 },
	{ ...timestamps, id: 'july', goalDateRef: new Date('2026-07-01T00:00:00.000Z'), roas: 7 },
	{ ...timestamps, id: 'june', goalDateRef: new Date('2026-06-01T00:00:00.000Z'), roas: 6 },
];

describe('marketing goals loaders', () => {
	beforeEach(() => {
		mocks.cache.clear();
		mocks.findMany.mockReset().mockResolvedValue(goals);
		mocks.queryRaw.mockReset().mockResolvedValue([
			{ month: '2026-06', revenue: 300 },
			{ month: '2026-07', revenue: 800 },
			{ month: '2026-08', revenue: 750 },
		]);
		mocks.getAuthenticatedClient.mockReset().mockResolvedValue({
			refreshToken: 'refresh-token',
		});
		mocks.report.mockReset().mockImplementation(async (query) => {
			if (query.from_date === '2026-06-01') {
				return [
					{ segments: { month: '2026-06-01' }, metrics: { cost_micros: 100_000_000 } },
					{ segments: { month: '2026-07-01' }, metrics: { cost_micros: 200_000_000 } },
				];
			}
			return [
				{ segments: { month: '2026-08-01' }, metrics: { cost_micros: 250_000_000 } },
			];
		});
		vi.stubEnv('JD_CENTRO_ID', 'org-id');
		vi.stubEnv('GOOGLE_CUSTOMER_ID_PRODUCTS', '123-456');
	});

	it('shares one historical and one current Google report across big numbers and history', async () => {
		const { createMarketingGoalLoaders } = await import(
			'@/services/data-services/get-marketing-goals'
		);
		const loaders = createMarketingGoalLoaders('products', new Date('2026-08-15T15:00:00.000Z'));

		const [bigNumbers, history] = await Promise.all([
			loaders.bigNumbers,
			loaders.history,
		]);

		expect(mocks.findMany).toHaveBeenCalledTimes(1);
		expect(mocks.queryRaw).toHaveBeenCalledTimes(1);
		expect(mocks.report).toHaveBeenCalledTimes(2);
		expect(mocks.report).toHaveBeenCalledWith({
			entity: 'customer',
			segments: ['segments.month'],
			metrics: ['metrics.cost_micros'],
			from_date: '2026-06-01',
			to_date: '2026-07-31',
		});
		expect(mocks.report).toHaveBeenCalledWith({
			entity: 'customer',
			segments: ['segments.month'],
			metrics: ['metrics.cost_micros'],
			from_date: '2026-08-01',
			to_date: '2026-08-15',
		});
		expect(bigNumbers).toEqual({
			ok: true,
			bigNumbers: { metaAtual: 8, roasAtingido: 3, roasPrevisto: 3 },
			error: null,
		});
		expect(history.data).toEqual([
			expect.objectContaining({ id: 'future', faturamento: 0, custo: 0, roasAtingido: null }),
			expect.objectContaining({ id: 'current', faturamento: 750, custo: 250, roasAtingido: 3 }),
			expect.objectContaining({ id: 'july', faturamento: 800, custo: 200, roasAtingido: 4 }),
			expect.objectContaining({ id: 'june', faturamento: 300, custo: 100, roasAtingido: 3 }),
		]);
	});

	it('reuses closed-month cache but refreshes the current month for each loader creation', async () => {
		const { createMarketingGoalLoaders } = await import(
			'@/services/data-services/get-marketing-goals'
		);
		const now = new Date('2026-08-15T15:00:00.000Z');
		const first = createMarketingGoalLoaders('products', now);
		await Promise.all([first.bigNumbers, first.history]);
		const second = createMarketingGoalLoaders('products', now);
		await Promise.all([second.bigNumbers, second.history]);

		expect(mocks.report.mock.calls.filter(([query]) => query.from_date === '2026-06-01')).toHaveLength(1);
		expect(mocks.report.mock.calls.filter(([query]) => query.from_date === '2026-08-01')).toHaveLength(2);
		expect(mocks.cacheOptions).toContainEqual({
			revalidate: 86_400,
			tags: ['marketing-goals-google-ads-history'],
		});
	});

	it('keeps zero-cost months nullable and never requests a future range', async () => {
		mocks.report.mockImplementation(async (query) =>
			query.from_date === '2026-06-01'
				? [{ segments: { month: '2026-07-01' }, metrics: { cost_micros: 0 } }]
				: [],
		);
		const { createMarketingGoalLoaders } = await import(
			'@/services/data-services/get-marketing-goals'
		);
		const { history } = createMarketingGoalLoaders(
			'products',
			new Date('2026-08-15T15:00:00.000Z'),
		);

		const result = await history;

		expect(result.data?.find((goal) => goal.id === 'future')).toMatchObject({
			faturamento: 0,
			custo: 0,
			roasAtingido: null,
		});
		expect(result.data?.find((goal) => goal.id === 'july')?.roasAtingido).toBeNull();
		expect(mocks.report.mock.calls.some(([query]) => query.from_date.startsWith('2026-09'))).toBe(false);
	});
});
