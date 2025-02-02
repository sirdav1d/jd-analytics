/** @format */

'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from '@/components/ui/chart';
const chartData = [
	{ month: 'January', vendas: 186, servicos: 80 },
	{ month: 'February', vendas: 305, servicos: 200 },
	{ month: 'March', vendas: 237, servicos: 120 },
	{ month: 'April', vendas: 73, servicos: 190 },
	{ month: 'May', vendas: 209, servicos: 130 },
	{ month: 'June', vendas: 214, servicos: 140 },
];

const chartConfig = {
	vendas: {
		label: 'Vendas',
		color: 'hsl(var(--chart-1))',
	},
	servicos: {
		label: 'Serviços',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function SalesVsRepairRevenue() {
	return (
		<ChartContainer config={chartConfig}>
			<BarChart
				accessibilityLayer
				data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='month'
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend content={<ChartLegendContent className='text-sm' />} />
				<Bar
					dataKey='vendas'
					fill='var(--color-vendas)'
					radius={4}>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					dataKey='servicos'
					fill='var(--color-servicos)'
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
