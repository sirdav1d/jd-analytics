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
import { use } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SalesChartComponent({ data }: { data: Promise<any> }) {
	const allData = use(data);

	const chartData = allData.data.revenueOverTime;
	const chartConfig = {
		revenue: {
			label: 'Faturamento',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	const isMobile = useIsMobile();
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance xl:text-xl'>
					Faturamento por Período
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className='h-80 lg:h-72 w-full'
					config={chartConfig}>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 28,
							left:  36,
							right: 36,
						}}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='label'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							fontSize={isMobile ? 0 : 8}
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
									stopColor='var(--color-revenue)'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='var(--color-revenue)'
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<Area
							dataKey='revenue'
							fillOpacity={0.4}
							dot={{
								fill: 'var(--color-revenue)',
							}}
							activeDot={{
								r: 6,
							}}
							fill='url(#fillDesktop)'
							stroke='var(--color-revenue)'
							strokeWidth={2}
							type={isMobile ? 'monotone' : 'natural'}
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
										notation: 'compact',
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
