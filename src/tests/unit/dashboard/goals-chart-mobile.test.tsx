// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { cloneElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SellerComparison from '@/app/dashboard/goals-result/_components/charts/seller-comparison-desktop';
import SellerComparisonMobile from '@/app/dashboard/goals-result/_components/charts/seller-comparison-mobile';
import {
	getMobileCategoricalChartHeight,
	ResponsiveChartTick,
} from '@/components/ui/responsive-chart';

const sellerName = 'VENDEDOR COM NOME COMPLETO';

const resolvedData = vi.hoisted(() => ({
	ok: true,
	overview: [
		{
			vendedor: 'VENDEDOR COM NOME COMPLETO',
			totalRevenue: 1000,
			orderCount: 10,
			avgTicket: 100,
			meta: 2000,
			percentualDif: 50,
			forecast: 1500,
		},
	],
	timeSeries: [],
	companySummary: { meta: 2000, realizado: 1000, forecast: 1500, diffPercent: 50 },
}));

const captured = vi.hoisted(() => ({
	barCharts: [] as Array<Record<string, unknown>>,
	chartContainers: [] as Array<Record<string, unknown>>,
	xAxes: [] as Array<Record<string, unknown>>,
	yAxes: [] as Array<Record<string, unknown>>,
}));

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();
	return { ...actual, use: () => resolvedData };
});

vi.mock('@/components/ui/chart', async () => {
	const React = await import('react');
	return {
		ChartContainer: ({ children, ...props }: Record<string, unknown>) => {
			captured.chartContainers.push(props);
			return <div>{children as React.ReactNode}</div>;
		},
		ChartLegend: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
		ChartLegendContent: () => null,
		ChartTooltip: () => null,
		ChartTooltipContent: () => null,
	};
});

vi.mock('recharts', async () => {
	const React = await import('react');
	const passthrough = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
	return {
		Bar: passthrough,
		BarChart: ({ children, ...props }: Record<string, unknown>) => {
			captured.barCharts.push(props);
			return <>{children as React.ReactNode}</>;
		},
		CartesianGrid: () => null,
		LabelList: () => null,
		XAxis: (props: Record<string, unknown>) => {
			captured.xAxes.push(props);
			return null;
		},
		YAxis: (props: Record<string, unknown>) => {
			captured.yAxes.push(props);
			return null;
		},
	};
});

function renderTick(axis: Record<string, unknown>, value: unknown) {
	const tick = axis.tick as ReactElement;
	render(<svg>{cloneElement(tick, { payload: { value } })}</svg>);
}

function getChartSellerName() {
	const chartData = captured.barCharts[0]?.data as Array<{ name: unknown }>;
	return chartData[0]?.name;
}

beforeEach(() => {
	cleanup();
	captured.barCharts.length = 0;
	captured.chartContainers.length = 0;
	captured.xAxes.length = 0;
	captured.yAxes.length = 0;
});

describe('Goals seller comparison ticks', () => {
	test('passes the complete seller name to the mobile responsive tick', () => {
		render(<SellerComparisonMobile data={Promise.resolve(resolvedData)} />);

		const axis = captured.yAxes[0]!;
		expect(captured.barCharts[0]?.layout).toBe('vertical');
		expect(captured.barCharts[0]?.margin).toEqual({
			top: 16,
			left: 4,
			right: 16,
			bottom: 8,
		});
		expect(axis.width).toBe(104);
		expect((captured.chartContainers[0]?.style as { height?: number }).height).toBe(
			getMobileCategoricalChartHeight(1),
		);
		expect(axis.tickFormatter).toBeUndefined();
		expect((axis.tick as ReactElement).type).toBe(ResponsiveChartTick);

		const chartSellerName = getChartSellerName();
		expect(chartSellerName).toBe(sellerName);
		renderTick(axis, chartSellerName);
		expect(screen.getByTitle(sellerName).textContent).toBe(sellerName);
		expect(screen.queryByText(`${sellerName.slice(0, 10)}...`)).toBeNull();
	});

	test('passes the complete seller name to the desktop responsive tick', () => {
		render(<SellerComparison data={Promise.resolve(resolvedData)} />);

		const axis = captured.xAxes[0]!;
		expect(captured.barCharts[0]?.layout).toBeUndefined();
		expect(axis.tickFormatter).toBeUndefined();
		expect((axis.tick as ReactElement).type).toBe(ResponsiveChartTick);

		const chartSellerName = getChartSellerName();
		expect(chartSellerName).toBe(sellerName);
		renderTick(axis, chartSellerName);
		expect(screen.getByTitle(sellerName).textContent).toBe(sellerName);
		expect(screen.queryByText(`${sellerName.slice(0, 12)}...`)).toBeNull();
	});
});
