// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RevenueChart from '@/app/dashboard/_components/revenue-chart';

const current = vi.hoisted(() => ({
	response: {} as unknown,
	config: {} as Record<string, { label?: string }>,
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
	LineChart: ({ children }: { children?: ReactNode }) => (
		<div data-testid='line-chart'>{children}</div>
	),
	Line: ({ children, dataKey }: { children?: ReactNode; dataKey: string }) => (
		<div data-testid='line-series' data-key={dataKey}>{children}</div>
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
	return {
		ok: true,
		data: {
			result: organizations.map((organization) => ({ organization })),
			revenueByOrg: [
				{ period: '2026-08-01', jd_centro: 266, jd_icaraí: 150 },
			],
		},
	};
}

beforeEach(() => {
	current.config = {};
});

afterEach(cleanup);

describe('RevenueChart', () => {
	it('renders one area without a legend and keeps the organization tooltip label', () => {
		current.response = responseWithOrganizations('JD Centro');
		render(createElement(RevenueChart, { data: Promise.resolve(null) }));

		expect(screen.getByText('Faturamento por Unidade')).not.toBeNull();
		expect(screen.getByTestId('area-chart')).not.toBeNull();
		expect(screen.getByTestId('area-series').getAttribute('data-key')).toBe('jd_centro');
		expect(screen.queryByTestId('line-chart')).toBeNull();
		expect(screen.queryByTestId('chart-legend')).toBeNull();
		expect(current.config.jd_centro.label).toBe('JD Centro');
	});

	it('renders one line per organization and the legend for multiple organizations', () => {
		current.response = responseWithOrganizations('JD Centro', 'JD Icaraí');
		render(createElement(RevenueChart, { data: Promise.resolve(null) }));

		expect(screen.getByTestId('line-chart')).not.toBeNull();
		expect(screen.getAllByTestId('line-series').map((line) => line.getAttribute('data-key'))).toEqual([
			'jd_centro',
			'jd_icaraí',
		]);
		expect(screen.getByTestId('chart-legend')).not.toBeNull();
		expect(screen.queryByTestId('area-chart')).toBeNull();
	});

	it('renders the empty state without a chart when no series is usable', () => {
		current.response = responseWithOrganizations();
		render(createElement(RevenueChart, { data: Promise.resolve(null) }));

		expect(screen.getByText('Sem dados encontrados')).not.toBeNull();
		expect(screen.queryByTestId('chart-container')).toBeNull();
	});
});
