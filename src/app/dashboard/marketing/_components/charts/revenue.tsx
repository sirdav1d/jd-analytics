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
	{ name: 'Jan', Organico: 4000, Pago: 1400, Social: 8000 },
	{ name: 'Fev', Organico: 3000, Pago: 1398, Social: 5210 },
	{ name: 'Mar', Organico: 2000, Pago: 9800, Social: 2990 },
	{ name: 'Abr', Organico: 2780, Pago: 3908, Social: 1000 },
	{ name: 'Mai', Organico: 7890, Pago: 4800, Social: 2181 },
	{ name: 'Jun', Organico: 4390, Pago: 6800, Social: 2500 },
];

const chartConfig = {
	Organico: {
		label: 'Organico',
		color: 'hsl(var(--chart-1))',
	},
	Pago: {
		label: 'Pago',
		color: 'hsl(var(--chart-2))',
	},
	Social: {
		label: 'Social',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function RevenueComponent() {
	return (
		<ChartContainer config={chartConfig}>
			<LineChart
				data={chartData}
				margin={{
					top: 28,
					left: 28,
					right: 28,
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
				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
				<Line
					dataKey='Organico'
					type='natural'
					stroke='var(--color-Organico)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-Organico)',
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
					dataKey='Pago'
					type='natural'
					stroke='var(--color-Pago)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-Pago)',
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
					dataKey='Social'
					type='natural'
					stroke='var(--color-Social)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-Social)',
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
