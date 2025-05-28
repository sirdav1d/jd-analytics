/** @format */

'use client';

import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function SalesChartComponent() {
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
			label: 'Faturamento',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance xl:text-xl'>
					Faturamento por Período
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className='h-72 w-full'
					config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 28,
							left: 36,
							right: 36,
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
						<defs>
							<linearGradient
								id='fillDesktop'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='5%'
									stopColor='var(--color-total)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--color-total)'
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<Area
							dataKey='total'
							fillOpacity={0.4}
							dot={{
								fill: 'var(--color-total)',
							}}
							activeDot={{
								r: 6,
							}}
							fill='url(#fillDesktop)'
							stroke='var(--color-total)'
							strokeWidth={2}
							type={'natural'}
							radius={4}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground'
								fontSize={10}
								formatter={(val: number) =>
									val.toLocaleString('pt-BR', {
										style: 'currency',
										currency: 'brl',
									})
								}
							/>
						</Area>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
