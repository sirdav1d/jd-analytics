// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { PieStore } from '@/app/dashboard/goals-result/_components/charts/pie-store';

const viewport = vi.hoisted(() => ({ isMobile: true }));
const captured = vi.hoisted(() => ({
	chartContainers: [] as Array<Record<string, unknown>>,
	radialBarCharts: [] as Array<Record<string, unknown>>,
}));

vi.mock('@/hooks/use-mobile', () => ({
	useIsMobile: () => viewport.isMobile,
}));

vi.mock('@/components/ui/chart', async () => {
	const React = await import('react');
	return {
		ChartContainer: ({ children, ...props }: Record<string, unknown>) => {
			captured.chartContainers.push(props);
			return <div>{children as React.ReactNode}</div>;
		},
		ChartTooltip: () => null,
		ChartTooltipContent: () => null,
	};
});

vi.mock('recharts', async () => {
	const React = await import('react');
	const passthrough = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
	return {
		Label: () => null,
		LabelList: () => null,
		PolarRadiusAxis: passthrough,
		RadialBar: passthrough,
		RadialBarChart: ({ children, ...props }: Record<string, unknown>) => {
			captured.radialBarCharts.push(props);
			return <>{children as React.ReactNode}</>;
		},
	};
});

beforeEach(() => {
	viewport.isMobile = true;
	captured.chartContainers.length = 0;
	captured.radialBarCharts.length = 0;
});

afterEach(cleanup);

describe('PieStore responsive geometry', () => {
	test('uses container-relative safe radii on mobile', () => {
		render(<PieStore companySummary={{ realizado: 500, meta: 1000 }} />);

		const chart = captured.radialBarCharts[0]!;
		expect(typeof chart.innerRadius).toBe('string');
		expect(typeof chart.outerRadius).toBe('string');
		expect(chart.innerRadius).toMatch(/^\d+%$/);
		expect(chart.outerRadius).toMatch(/^\d+%$/);
		expect(Number.parseInt(chart.outerRadius as string, 10)).toBeLessThanOrEqual(100);
	});

	test('preserves desktop radii and releases the mobile max width', () => {
		viewport.isMobile = false;
		render(<PieStore companySummary={{ realizado: 500, meta: 1000 }} />);

		expect(captured.radialBarCharts[0]?.innerRadius).toBe(128);
		expect(captured.radialBarCharts[0]?.outerRadius).toBe(200);
		expect(captured.chartContainers[0]?.className).toContain('max-w-[320px]');
		expect(captured.chartContainers[0]?.className).toContain('md:max-w-none');
	});
});
