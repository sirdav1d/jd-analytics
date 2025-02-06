/** @format */

'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
	{ name: 'Verão 2023', impressions: 10000, clicks: 5000, conversions: 500 },
	{
		name: 'Black Friday',
		impressions: 16000,
		clicks: 10000,
		conversions: 1000,
	},
	{ name: 'Natal', impressions: 15000, clicks: 7500, conversions: 750 },
];

const chartConfig = {
	impressions: {
		label: 'Impressões',
		color: 'hsl(var(--chart-1))',
	},
	clicks: {
		label: 'Cliques',
		color: 'hsl(var(--chart-2))',
	},
	conversions: {
		label: 'Conversões',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function CampagnComponent() {
	return (
		<ChartContainer
			config={chartConfig}
			className='w-full h-80'>
			<BarChart
				margin={{
					top: 28,
				}}
				data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='name'
					tickMargin={12}
					tickLine={false}
					axisLine={false}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
				<Bar
					radius={4}
					yAxisId='right'
					dataKey='impressions'
					fill='var(--color-impressions)'
					name='Impressões'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					radius={4}
					yAxisId='right'
					dataKey='clicks'
					fill='var(--color-clicks)'
					name='Cliques'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					radius={4}
					yAxisId='right'
					dataKey='conversions'
					fill='var(--color-conversions)'
					name='Conversões'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
