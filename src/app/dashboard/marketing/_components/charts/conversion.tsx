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
	{ name: 'Orgânico', conversions: 200, cpa: 15 },
	{ name: 'Pago', conversions: 300, cpa: 25 },
	{ name: 'Social', conversions: 150, cpa: 20 },
	{ name: 'Direto', conversions: 100, cpa: 10 },
];

const chartConfig = {
	conversions: {
		label: 'Conversões',
		color: 'hsl(var(--chart-1))',
	},
	cpa: {
		label: 'Custo por Aquisição - CPA',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function ConversionsComponent() {
	return (
		<ChartContainer
			config={chartConfig}
			className='h-72 w-full'>
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
					dataKey='conversions'
					fill='var(--color-conversions)'
					>
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
					dataKey='cpa'
					fill='var(--color-cpa)'
				>
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
