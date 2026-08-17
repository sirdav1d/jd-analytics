// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SalesVsRepairRevenue } from '@/app/dashboard/_components/sales-vs-repair-revenue';

const current = vi.hoisted(() => ({
	response: {} as unknown,
	config: {} as Record<string, { label?: string }>,
	chartData: [] as Array<Record<string, unknown>>,
}));

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();
	return { ...actual, use: () => current.response };
});

vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => false }));

vi.mock('recharts', () => ({
	AreaChart: ({ children }: { children?: ReactNode }) => (
		<div data-testid='area-chart'>{children}</div>
	),
	Area: ({ children, dataKey }: { children?: ReactNode; dataKey: string }) => (
		<div data-testid='area-series' data-key={dataKey}>{children}</div>
	),
	LineChart: ({
		children,
		data,
	}: {
		children?: ReactNode;
		data?: Array<Record<string, unknown>>;
	}) => {
		current.chartData = data ?? [];
		return <div data-testid='line-chart'>{children}</div>;
	},
	Line: ({ children, dataKey, name }: { children?: ReactNode; dataKey: string; name?: string }) => (
		<div data-testid='line-series' data-key={dataKey} data-name={name}>{children}</div>
	),
	CartesianGrid: () => null,
	LabelList: () => null,
	XAxis: () => null,
}));

vi.mock('@/components/ui/chart', () => ({
	ChartContainer: ({
		children,
		config,
	}: {
		children?: ReactNode;
		config: Record<string, { label?: string }>;
	}) => {
		current.config = config;
		return <div data-testid='chart-container'>{children}</div>;
	},
	ChartLegend: () => <div data-testid='chart-legend' />,
	ChartLegendContent: () => null,
	ChartTooltip: () => null,
	ChartTooltipContent: () => null,
}));

function responseWithOrganizations(...organizations: string[]) {
	const historyOrganizations = organizations.map((organization, index) => ({
		organization,
		organizationId: `org-${index + 1}`,
	}));
	return {
		ok: true,
		data: {
			result: historyOrganizations,
			historyOrganizations,
			salesByOrg: [
				{ period: '2026-08-01', 'org-1': 3, 'org-2': 2 },
			],
		},
	};
}

beforeEach(() => {
	current.config = {};
	current.chartData = [];
});

afterEach(cleanup);

describe('SalesVsRepairRevenue', () => {
	it('renders one area without a legend and keeps the organization tooltip label', () => {
		current.response = responseWithOrganizations('JD Centro');
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getByText('Vendas por unidade')).not.toBeNull();
		expect(screen.getByTestId('area-chart')).not.toBeNull();
		expect(screen.getByTestId('area-series').getAttribute('data-key')).toBe('org-1');
		expect(screen.queryByTestId('line-chart')).toBeNull();
		expect(screen.queryByTestId('chart-legend')).toBeNull();
		expect(current.config['org-1'].label).toBe('JD Centro');
	});

	it('renders one line per organization and the legend for multiple organizations', () => {
		current.response = responseWithOrganizations('JD Centro', 'JD Icaraí');
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getByTestId('line-chart')).not.toBeNull();
		expect(screen.getAllByTestId('line-series').map((line) => line.getAttribute('data-key'))).toEqual([
			'org-1',
			'org-2',
		]);
		expect(screen.getByTestId('chart-legend')).not.toBeNull();
		expect(screen.queryByTestId('area-chart')).toBeNull();
		expect(screen.getAllByTestId('line-series').map((line) => line.getAttribute('data-name'))).toEqual([
			'JD Centro',
			'JD Icaraí',
		]);
	});

	it('uses the organizations present in sales history to show names and legend', () => {
		current.response = {
			ok: true,
			data: {
				result: [
					{ organization: 'JD Centro', organizationId: 'org-1' },
				],
				historyOrganizations: [
					{ organization: 'JD Centro', organizationId: 'org-1' },
					{ organization: 'JD Icaraí', organizationId: 'org-2' },
				],
				salesByOrg: [
					{ period: '2026-08-01', 'org-1': 3, 'org-2': 2 },
				],
			},
		};
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getByTestId('line-chart')).not.toBeNull();
		expect(screen.getByTestId('chart-legend')).not.toBeNull();
		expect(screen.getAllByTestId('line-series').map((line) => line.getAttribute('data-name'))).toEqual([
			'JD Centro',
			'JD Icaraí',
		]);
	});

	it('renders distinct history series for colliding and punctuated organization labels', () => {
		current.response = {
			ok: true,
			data: {
				result: [
					{ organization: 'Loja A B', organizationId: 'org-space' },
					{ organization: 'Loja A_B', organizationId: 'org-underscore' },
					{ organization: 'Ótica & Café', organizationId: 'org-punctuation' },
				],
				historyOrganizations: [
					{ organization: 'Loja A B', organizationId: 'org-space' },
					{ organization: 'Loja A_B', organizationId: 'org-underscore' },
					{ organization: 'Ótica & Café', organizationId: 'org-punctuation' },
				],
				salesByOrg: [
					{
						period: '2026-08-01',
						'org-space': 3,
						'org-underscore': 2,
						'org-punctuation': 1,
					},
				],
			},
		};
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getAllByTestId('line-series').map((line) => line.getAttribute('data-key'))).toEqual([
			'org-space',
			'org-underscore',
			'org-punctuation',
		]);
		expect(current.config['org-space'].label).toBe('Loja A B');
		expect(current.config['org-underscore'].label).toBe('Loja A_B');
		expect(current.config['org-punctuation'].label).toBe('Ótica & Café');
		expect(current.chartData).toEqual([
			{
				period: '2026-08-01',
				'org-space': 3,
				'org-underscore': 2,
				'org-punctuation': 1,
			},
		]);
	});

	it('renders the empty state without a chart when no series is usable', () => {
		current.response = responseWithOrganizations();
		render(createElement(SalesVsRepairRevenue, { data: Promise.resolve(null) }));

		expect(screen.getByText('Sem dados encontrados')).not.toBeNull();
		expect(screen.queryByTestId('chart-container')).toBeNull();
	});
});
