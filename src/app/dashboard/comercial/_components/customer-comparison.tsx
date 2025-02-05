/** @format */

'use client';

import { CartesianGrid, LabelList, Bar, BarChart, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
	{ month: 'Jan', novos: 30, recorrentes: 70 },
	{ month: 'Fev', novos: 40, recorrentes: 80 },
	{ month: 'Mar', novos: 35, recorrentes: 90 },
	{ month: 'Abr', novos: 50, recorrentes: 85 },
	{ month: 'Mai', novos: 45, recorrentes: 95 },
	{ month: 'Jun', novos: 60, recorrentes: 100 },
];
const chartConfig = {
	novos: {
		label: 'Novos',
		color: 'hsl(var(--chart-1))',
	},
	recorrentes: {
		label: 'Recorrentes',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function CustomerComparisonChartComponent() {
	return (
		<ChartContainer config={chartConfig}>
			<BarChart
				accessibilityLayer
				data={chartData}
				margin={{
					top: 28,
					left: 28,
					right: 28,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='month'
					tickLine={false}
					axisLine={false}
					tickMargin={12}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
				<Bar
					dataKey='novos'
					type='natural'
					fill='var(--color-novos)'
					stroke='var(--color-novos)'
					strokeWidth={2}>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					dataKey='recorrentes'
					type='natural'
					fill='var(--color-recorrentes)'
					stroke='var(--color-recorrentes)'
					strokeWidth={2}>
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
