import { describe, expect, it } from 'vitest';
import { getOrganizationSeries } from '@/app/dashboard/_components/organization-series';

type OrganizationRow = {
	organization: unknown;
	organizationId: unknown;
};

function responseWithOrganizations(...organizations: OrganizationRow[]) {
	return {
		ok: true,
		data: {
			result: organizations,
		},
	};
}

describe('getOrganizationSeries', () => {
	it('normalizes and colors distinct organization series in response order', () => {
		expect(
			getOrganizationSeries(
				responseWithOrganizations(
					{ organization: 'JD Centro', organizationId: 'org-centro' },
					{ organization: 'JD Icaraí', organizationId: 'org-icarai' },
				),
			),
		).toEqual([
			{
				dataKey: 'org-centro',
				label: 'JD Centro',
				color: 'hsl(var(--chart-1))',
			},
			{
				dataKey: 'org-icarai',
				label: 'JD Icaraí',
				color: 'hsl(var(--chart-2))',
			},
		]);
	});

	it('ignores duplicate, blank, non-string, and malformed rows', () => {
		expect(
			getOrganizationSeries(
				responseWithOrganizations(
					{ organization: ' JD Centro ', organizationId: 'org-centro' },
					{ organization: 'JD Centro', organizationId: 'org-centro' },
					{ organization: '', organizationId: 'org-empty-label' },
					{ organization: null, organizationId: 'org-invalid-label' },
					{ organization: 'JD Icaraí', organizationId: '' },
				),
			),
		).toEqual([
			{
				dataKey: 'org-centro',
				label: 'JD Centro',
				color: 'hsl(var(--chart-1))',
			},
		]);
		expect(getOrganizationSeries({ ok: false, data: null })).toEqual([]);
		expect(getOrganizationSeries({ ok: true, data: { result: null } })).toEqual([]);
	});

	it('keeps colliding and punctuated labels distinct by organization identity', () => {
		expect(
			getOrganizationSeries(
				responseWithOrganizations(
					{ organization: 'Loja A B', organizationId: 'org-space' },
					{ organization: 'Loja A_B', organizationId: 'org-underscore' },
					{ organization: 'Ótica & Café', organizationId: 'org-punctuation' },
				),
			),
		).toEqual([
			{
				dataKey: 'org-space',
				label: 'Loja A B',
				color: 'hsl(var(--chart-1))',
			},
			{
				dataKey: 'org-underscore',
				label: 'Loja A_B',
				color: 'hsl(var(--chart-2))',
			},
			{
				dataKey: 'org-punctuation',
				label: 'Ótica & Café',
				color: 'hsl(var(--chart-3))',
			},
		]);
	});
});
