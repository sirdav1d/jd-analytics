/** @format */

'use client';

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from '@/components/ui/chart';
const chartData = [
	{ name: 'Jan', sales: 4000, growth: 2400 },
	{ name: 'Feb', sales: 3000, growth: 1398 },
	{ name: 'Mar', sales: 2000, growth: 9800 },
	{ name: 'Apr', sales: 2780, growth: 3908 },
	{ name: 'May', sales: 1890, growth: 4800 },
	{ name: 'Jun', sales: 2390, growth: 3800 },
	{ name: 'Jul', sales: 3490, growth: 4300 },
];
const chartConfig = {
	sales: {
		label: 'Vendas',
		color: 'hsl(var(--chart-1))',
	},
	growth: {
		label: 'Crescimento',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export default function SalesChart() {
	return (
		<ChartContainer config={chartConfig}>
			<LineChart
				accessibilityLayer
				data={chartData}
				margin={{
					top: 20,
					left: 16,
					right: 16,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='name'
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend content={<ChartLegendContent className='text-sm' />} />
				<Line
					dataKey='sales'
					type='natural'
					stroke='var(--color-sales)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-sales)',
					}}
					activeDot={{
						r: 6,
					}}>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground text-nowrap text-start'
						fontSize={10}
					/>
				</Line>
				<Line
					dataKey='growth'
					type='natural'
					stroke='var(--color-growth)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-growth)',
					}}
					activeDot={{
						r: 6,
					}}>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={10}
					/>
				</Line>
			</LineChart>
		</ChartContainer>
	);
}
