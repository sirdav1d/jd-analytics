/** @format */

'use client';

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const salesData = [
	{ name: 'Jan', centro: 1800, icarai: 1200 },
	{ name: 'Feb', centro: 2000, icarai: 1000 },
	{ name: 'Mar', centro: 1400, icarai: 2950 },
	{ name: 'Apr', centro: 2200, icarai: 1580 },
	{ name: 'May', centro: 2500, icarai: 1900 },
	{ name: 'Jun', centro: 3000, icarai: 1780 },
];

const chartConfig = {
	centro: {
		label: 'JD Centro',
		color: 'hsl(var(--chart-1))',
	},
	icarai: {
		label: 'JD Icaraí',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function SalesVsRepairRevenue() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Vendas por unidade
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className='h-72 w-full'
					config={chartConfig}>
					<LineChart
						accessibilityLayer
						margin={{ top: 28, right: 40, left: 40 }}
						data={salesData}>
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
							content={<ChartTooltipContent indicator='dot' />}
						/>
						<ChartLegend content={<ChartLegendContent className='text-xs' />} />
						<Line
							dataKey='centro'
							dot={{
								fill: 'var(--color-centro)',
							}}
							activeDot={{
								r: 6,
							}}
							type='natural'
							strokeWidth={2}
							stroke='var(--color-centro)'
							radius={4}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground'
								fontSize={10}
								formatter={(val: number) => val.toLocaleString('pt-BR')}
							/>
						</Line>
						<Line
							dataKey='icarai'
							type='natural'
							dot={{
								fill: 'var(--color-icarai)',
							}}
							activeDot={{
								r: 6,
							}}
							strokeWidth={2}
							stroke='var(--color-icarai)'
							radius={4}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground'
								fontSize={10}
								formatter={(val: number) => val.toLocaleString('pt-BR')}
							/>
						</Line>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
