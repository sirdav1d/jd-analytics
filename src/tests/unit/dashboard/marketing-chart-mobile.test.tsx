// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { cloneElement, type ReactElement } from 'react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { CampagnComponent } from '@/app/dashboard/marketing/_components/charts/campaings';
import { ConversionsComponent } from '@/app/dashboard/marketing/_components/charts/conversion';
import { TrafficComponent } from '@/app/dashboard/marketing/_components/charts/traffic';
import {
	getMobileCategoricalChartHeight,
	ResponsiveChartTick,
} from '@/components/ui/responsive-chart';

const captured = vi.hoisted(() => ({
	barCharts: [] as Array<Record<string, unknown>>,
	yAxes: [] as Array<Record<string, unknown>>,
	chartContainers: [] as Array<Record<string, unknown>>,
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
		ChartLegend: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
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
		CartesianGrid: () => null,
		LabelList: () => null,
		XAxis: () => null,
	};
});

const conversionMetric = { conversions: 1, sessions: 10 };

function renderTick(axis: Record<string, unknown>, value: string) {
	const tick = axis.tick as ReactElement;
	render(cloneElement(tick, { payload: { value } }));
}

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

describe('Marketing categorical charts on mobile', () => {
	test('keeps a complete campaign value in the responsive category tick', () => {
		const campaignName = 'Campanha Institucional Agosto 2026';
		render(
			<CampagnComponent
				data={[
					{
						campaign: { id: 1, name: campaignName, resource_name: 'campaign', status: 1 },
						metrics: { clicks: 1, conversions: 1, impressions: 1 },
					},
				]}
			/>,
		);

		const axis = captured.yAxes[0]!;
		expect(captured.barCharts[0]?.layout).toBe('vertical');
		expect(captured.barCharts[0]?.margin).toEqual({
			top: 16,
			left: 4,
			right: 16,
			bottom: 8,
		});
		expect(axis.width).toBe(104);
		expect(axis.tickFormatter).toBeUndefined();
		expect((axis.tick as ReactElement).type).toBe(ResponsiveChartTick);
		expect((axis.tick as ReactElement).props.width).toBe(96);
		expect((captured.chartContainers[0]?.style as { height?: number }).height).toBe(
			getMobileCategoricalChartHeight(1),
		);

		renderTick(axis, campaignName);
		const label = screen.getByTitle(campaignName);
		expect(label.textContent).toBe(campaignName);
	});

	test('uses the responsive tick with the full traffic category value', () => {
		render(
			<TrafficComponent
				Direto={1}
				Organico={1}
				Pago={1}
				Social={1}
				crossNetwork={1}
				nAtribuido={1}
				referral={1}
				shopping={1}
				video={1}
			/>,
		);

		const axis = captured.yAxes[0]!;
		expect(axis.tickFormatter).toBeUndefined();
		expect((axis.tick as ReactElement).type).toBe(ResponsiveChartTick);
		expect((captured.chartContainers[0]?.style as { height?: number }).height).toBe(
			getMobileCategoricalChartHeight(9),
		);

		renderTick(axis, 'Navegação Direta');
		expect(screen.getByTitle('Navegação Direta').textContent).toBe('Navegação Direta');
	});

	test('uses the responsive tick with the full conversion category value', () => {
		render(
			<ConversionsComponent
				Direto={conversionMetric}
				Organico={conversionMetric}
				Pago={conversionMetric}
				Social={conversionMetric}
				crossNetwork={conversionMetric}
				nAtribuido={conversionMetric}
				referral={conversionMetric}
				shopping={conversionMetric}
				video={conversionMetric}
			/>,
		);

		const axis = captured.yAxes[0]!;
		expect(axis.tickFormatter).toBeUndefined();
		expect((axis.tick as ReactElement).type).toBe(ResponsiveChartTick);
		expect((captured.chartContainers[0]?.style as { height?: number }).height).toBe(
			getMobileCategoricalChartHeight(9),
		);

		renderTick(axis, 'Pesquisa Orgânica');
		expect(screen.getByTitle('Pesquisa Orgânica').textContent).toBe('Pesquisa Orgânica');
	});
});
