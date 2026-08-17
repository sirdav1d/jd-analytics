// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ComparisonUnitSection from '@/app/dashboard/_components/comparison-unit-section';

vi.mock('@/app/dashboard/_components/comparison-unit', () => ({
	default: ({ title }: { title: string }) => <span>{title}</span>,
}));

function dataWithOrganizations(...organizations: string[]) {
	return Promise.resolve({
		ok: true,
		data: {
			result: organizations.map((organization) => ({
				organization,
				organizationId: `org-${organization}`,
				revenue: 100,
				salesCount: 2,
				newCustomers: 1,
			})),
			revenueByOrg: [],
			salesByOrg: [],
		},
		error: null,
	});
}

describe('ComparisonUnitSection', () => {
	it('does not render the block for one organization', async () => {
		const section = await ComparisonUnitSection({
			data: dataWithOrganizations('JD Centro'),
		});

		expect(section).toBeNull();
	});

	it('counts duplicate rows from one organization only once', async () => {
		const section = await ComparisonUnitSection({
			data: dataWithOrganizations('JD Centro', 'JD Centro'),
		});

		expect(section).toBeNull();
	});

	it('renders all three charts for two distinct organizations', async () => {
		const section = await ComparisonUnitSection({
			data: dataWithOrganizations('JD Centro', 'JD Icaraí'),
		});

		expect(section).not.toBeNull();
		render(section);
		expect(screen.getByText('Faturamento por unidade')).not.toBeNull();
		expect(screen.getByText('Total de vendas por unidade')).not.toBeNull();
		expect(screen.getByText('Novos Clientes')).not.toBeNull();
	});

	it.each([
		{ ok: false, data: null, error: 'Falha' },
		{ ok: true, data: { result: null }, error: null },
	])('does not render the block for an unusable response', async (response) => {
		const section = await ComparisonUnitSection({
			data: Promise.resolve(response),
		});

		expect(section).toBeNull();
	});
});
