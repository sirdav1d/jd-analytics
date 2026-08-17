/** @format */

'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

const chartData = [
	{ browser: 'chrome', visitors: 187, fill: 'var(--color-chrome)' },
	{ browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
	{ browser: 'firefox', visitors: 275, fill: 'var(--color-firefox)' },
	{ browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
	{ browser: 'other', visitors: 90, fill: 'var(--color-other)' },
];

const chartConfig = {
	visitors: {
		label: 'Visitors',
	},
	chrome: {
		label: 'Chrome',
		color: 'hsl(var(--chart-1))',
	},
	safari: {
		label: 'Safari',
		color: 'hsl(var(--chart-2))',
	},
	firefox: {
		label: 'Firefox',
		color: 'hsl(var(--chart-3))',
	},
	edge: {
		label: 'Edge',
		color: 'hsl(var(--chart-4))',
	},
	other: {
		label: 'Other',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

export function ChartBarActive() {
	const isMobile = useIsMobile();

	return (
		<ChartContainer
			className='h-80 min-w-0 w-full overflow-hidden md:h-72'
			config={chartConfig}>
			<BarChart
				accessibilityLayer
				margin={
					isMobile
						? { top: 20, left: 8, right: 12, bottom: 8 }
						: undefined
				}
				data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='browser'
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) =>
						chartConfig[value as keyof typeof chartConfig]?.label
					}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar
					dataKey='visitors'
					strokeWidth={2}
					radius={8}
					activeIndex={2}
				/>
			</BarChart>
		</ChartContainer>
	);
}
