// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { RevenueByOrigin } from '@/app/dashboard/comercial/_components/revenue-by-origin';
import { SalesChartComponent } from '@/app/dashboard/comercial/_components/sales-chart-commercial';
import { SalesByCategoryChart } from '@/app/dashboard/comercial/_components/sales-by-category-chart';
import { getMobileCategoricalChartHeight } from '@/components/ui/responsive-chart';

const resolvedData = vi.hoisted(() => ({
	ok: true,
	data: {
		revenueByOrigin: [
			{ origin: 'Balcão', revenue: 170, fill: 'var(--color-Balcão)' },
			{ origin: 'Comercial Ativo', revenue: 250, fill: 'var(--color-Comercial_Ativo)' },
		],
		salesByCategory: [
			{ category: 'ACESSORIOS OFFICE', revenue: 170 },
			{ category: 'HARDWARE GAMER', revenue: 250 },
		],
		revenueOverTime: [{ label: 'Janeiro', revenue: 170 }],
	},
}));

const captured = vi.hoisted(() => ({
	barCharts: [] as Array<Record<string, unknown>>,
	yAxes: [] as Array<Record<string, unknown>>,
	chartContainers: [] as Array<Record<string, unknown>>,
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
		ChartTooltip: () => null,
		ChartTooltipContent: () => null,
		ChartLegend: () => null,
		ChartLegendContent: () => null,
	};
});

vi.mock('recharts', async () => {
	const React = await import('react');
	const passthrough = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
	return {
		BarChart: ({ children, ...props }: Record<string, unknown>) => {
			captured.barCharts.push(props);
			return <>{children as React.ReactNode}</>;
		},
		YAxis: (props: Record<string, unknown>) => {
			captured.yAxes.push(props);
			return null;
		},
		Bar: passthrough,
		Area: passthrough,
		AreaChart: () => null,
		CartesianGrid: () => null,
		LabelList: () => null,
		XAxis: () => null,
	};
});

beforeEach(() => {
	captured.barCharts.length = 0;
	captured.yAxes.length = 0;
	captured.chartContainers.length = 0;
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation(() => ({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})),
	});
});

describe('Comercial categorical charts on mobile', () => {
	test('gives origin labels enough room without creating horizontal overflow', () => {
		render(<RevenueByOrigin data={Promise.resolve(null)} />);

		expect(captured.barCharts[0]?.layout).toBe('vertical');
		expect(captured.barCharts[0]?.margin).toEqual({
			top: 16,
			left: 4,
			right: 16,
			bottom: 8,
		});
		expect(captured.yAxes[0]?.width).toBe(104);
		expect(captured.yAxes[0]?.tick).toBeTruthy();
		expect(
		(captured.chartContainers[0]?.style as { height?: number }).height,
		).toBe(getMobileCategoricalChartHeight(2));
	});

	test('uses the category chart mobile axis and item-count height policy', () => {
		render(<SalesByCategoryChart data={Promise.resolve(null)} />);

		expect(captured.barCharts[0]?.layout).toBe('vertical');
		expect(captured.barCharts[0]?.margin).toEqual({
			top: 8,
			left: 0,
			right: 52,
			bottom: 24,
		});
		expect(captured.yAxes[0]?.width).toBe(112);
		expect(captured.yAxes[0]?.tick).toBeTruthy();
		expect(
		(captured.chartContainers[0]?.style as { height?: number }).height,
		).toBe(getMobileCategoricalChartHeight(2));
	});
});

test('keeps the commercial sales chart compact at the desktop breakpoint', () => {
	render(<SalesChartComponent data={Promise.resolve(null)} />);

	expect(captured.chartContainers[0]?.className).toContain('lg:h-72');
});
