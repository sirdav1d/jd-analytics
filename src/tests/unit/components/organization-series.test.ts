import { describe, expect, it } from 'vitest';
import { getOrganizationSeries } from '@/app/dashboard/_components/organization-series';

function responseWithOrganizations(...organizations: unknown[]) {
	return {
		ok: true,
		data: {
			result: organizations.map((organization) => ({ organization })),
		},
	};
}

describe('getOrganizationSeries', () => {
	it('normalizes and colors distinct organization series in response order', () => {
		expect(
			getOrganizationSeries(
				responseWithOrganizations('JD Centro', 'JD Icaraí'),
			),
		).toEqual([
			{
				dataKey: 'jd_centro',
				label: 'JD Centro',
				color: 'hsl(var(--chart-1))',
			},
			{
				dataKey: 'jd_icaraí',
				label: 'JD Icaraí',
				color: 'hsl(var(--chart-2))',
			},
		]);
	});

	it('ignores duplicate, blank, non-string, and malformed rows', () => {
		expect(
			getOrganizationSeries(
				responseWithOrganizations(' JD Centro ', 'JD Centro', '', null),
			),
		).toEqual([
			{
				dataKey: 'jd_centro',
				label: 'JD Centro',
				color: 'hsl(var(--chart-1))',
			},
		]);
		expect(getOrganizationSeries({ ok: false, data: null })).toEqual([]);
		expect(getOrganizationSeries({ ok: true, data: { result: null } })).toEqual([]);
	});
});
