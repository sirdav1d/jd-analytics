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
	{ name: 'Jan', campangn1: 4000, campangn2: 1400, campangn3: 8000 },
	{ name: 'Fev', campangn1: 3000, campangn2: 1398, campangn3: 5210 },
	{ name: 'Mar', campangn1: 2000, campangn2: 9800, campangn3: 2990 },
	{ name: 'Abr', campangn1: 2780, campangn2: 3908, campangn3: 1000 },
	{ name: 'Mai', campangn1: 7890, campangn2: 4800, campangn3: 2181 },
	{ name: 'Jun', campangn1: 4390, campangn2: 6800, campangn3: 2500 },
];

const chartConfig = {
	campangn1: {
		label: 'Verão 2024',
		color: 'hsl(var(--chart-1))',
	},
	campangn2: {
		label: 'Black Friday 2024',
		color: 'hsl(var(--chart-2))',
	},
	campangn3: {
		label: 'Natal 2024',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function RevenueComponent() {
	return (
		<ChartContainer
			className='h-80 md:h-72 w-full'
			config={chartConfig}>
			<LineChart
				data={chartData}
				margin={{
					top: 28,
					left: 24,
					right: 24,
				}}>
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
				<ChartLegend
					content={
						<ChartLegendContent className=' text-xs pt-3 md:text-sm text-nowrap' />
					}
				/>
				<Line
					dataKey='campangn1'
					type='natural'
					stroke='var(--color-campangn1)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-campangn1)',
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
					dataKey='campangn2'
					type='natural'
					stroke='var(--color-campangn2)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-campangn2)',
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
				<Line
					dataKey='campangn3'
					type='natural'
					stroke='var(--color-campangn3)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-campangn3)',
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
