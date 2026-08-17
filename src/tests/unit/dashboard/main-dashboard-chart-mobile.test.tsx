// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ComparisonUnit from '@/app/dashboard/_components/comparison-unit';

const current = vi.hoisted(() => ({
	response: {} as { ok: boolean; data: { result: Array<Record<string, unknown>> } },
	isMobile: false,
	chartContainers: [] as Array<Record<string, unknown>>,
	pies: [] as Array<Record<string, unknown>>,
}));

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();
	return { ...actual, use: () => current.response };
});

vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => current.isMobile }));

vi.mock('@/components/ui/chart', () => ({
	ChartContainer: ({ children, ...props }: { children?: ReactNode }) => {
		current.chartContainers.push(props);
		return <div>{children}</div>;
	},
	ChartLegend: () => null,
	ChartLegendContent: () => null,
	ChartTooltip: () => null,
	ChartTooltipContent: () => null,
}));

vi.mock('recharts', () => ({
	PieChart: ({ children }: { children?: ReactNode }) => <>{children}</>,
	Pie: ({ children, ...props }: { children?: ReactNode }) => {
		current.pies.push(props);
		return <>{children}</>;
	},
	Cell: () => null,
	Label: () => null,
}));

beforeEach(() => {
	current.response = {
		ok: true,
		data: {
			result: [
				{ organization: 'JD Centro', revenue: 100, salesCount: 3, newCustomers: 2 },
				{ organization: 'JD Icaraí', revenue: 200, salesCount: 5, newCustomers: 4 },
			],
		},
	};
	current.isMobile = false;
	current.chartContainers = [];
	current.pies = [];
});

afterEach(cleanup);

describe('ComparisonUnit mobile layout', () => {
	test('contains the comparison donut and reduces its radii and labels on mobile', () => {
		current.isMobile = true;
		render(<ComparisonUnit data={Promise.resolve(null)} title='Faturamento por unidade' type='revenue' />);

		expect(current.chartContainers[0]?.className).toBe(
			'mx-auto h-[280px] min-w-0 w-full max-w-[320px] md:aspect-square md:max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground',
		);
		expect(current.pies[0]?.innerRadius).toBe(64);
		expect(current.pies[0]?.outerRadius).toBe(86);
		expect(current.pies[0]?.fontSize).toBe(10);
	});

	test('preserves the desktop comparison donut dimensions', () => {
		render(<ComparisonUnit data={Promise.resolve(null)} title='Faturamento por unidade' type='revenue' />);

		expect(current.pies[0]?.innerRadius).toBe(72);
		expect(current.pies[0]?.outerRadius).toBe(94);
		expect(current.pies[0]?.fontSize).toBe(12);
	});
});
