/** @format */

'use client';

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

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
		label: 'Crescimento',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export function GrowthChartComponent() {
	return (
		<ChartContainer config={chartConfig}>
			<LineChart
				accessibilityLayer
				data={chartData}
				margin={{
					top: 28,
					left: 28,
					right: 28,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='name'
					tickLine={false}
					axisLine={false}
					tickMargin={12}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<Line
					dataKey='total'
					type='natural'
					fill='var(--color-total)'
					fillOpacity={0.4}
					stroke='var(--color-total)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-total)',
					}}
					activeDot={{
						r: 6,
					}}>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Line>
			</LineChart>
		</ChartContainer>
	);
}
