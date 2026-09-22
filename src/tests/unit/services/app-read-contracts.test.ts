import { describe, expect, it } from 'vitest';
import {
	APP_READ_SERVICE_NAMES,
	commercialFiltersSchema,
	periodFiltersSchema,
} from '@/services/app-read-contracts';

describe('contratos dos serviços de leitura do JD', () => {
	it('mantém somente o catálogo aprovado', () => {
		expect(APP_READ_SERVICE_NAMES).toEqual([
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
		]);
	});

	it('não aceita identidade como filtro comercial', () => {
		const parsed = commercialFiltersSchema.safeParse({
			startDate: '2026-09-01',
			endDate: '2026-09-21',
			category: 'all',
			customerType: 'all',
			org: 'all',
			userId: 'outro-usuario',
		});

		expect(parsed.success).toBe(false);
	});

	it('recusa período invertido', () => {
		expect(periodFiltersSchema.safeParse({
			startDate: '2026-09-21',
			endDate: '2026-09-01',
		}).success).toBe(false);
	});
});
