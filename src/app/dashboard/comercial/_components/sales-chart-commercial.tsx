/** @format */

'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
	{ name: 'Jan', total: 15000 },
	{ name: 'Feb', total: 20000 },
	{ name: 'Mar', total: 18000 },
	{ name: 'Apr', total: 22000 },
	{ name: 'May', total: 25000 },
	{ name: 'Jun', total: 30000 },
];
const chartConfig = {
	total: {
		label: 'Vendas',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export function SalesChartComponent() {
	return (
		<ChartContainer className='h-72 w-full' config={chartConfig}>
			<BarChart
				accessibilityLayer
				data={chartData}
				margin={{
					top: 28,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='name'
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar
					dataKey='total'
					fill='var(--color-total)'
					radius={4}>
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
