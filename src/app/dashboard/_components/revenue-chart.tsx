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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { use } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RevenueChart({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();

	if (!allData?.ok || !allData?.data?.revenueByOrg) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance xl:text-xl'>
						Sem dados encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	const chartData = allData.data.revenueByOrg;
	const chartConfig = {
		jd_centro: {
			label: 'JD Centro',
			color: 'hsl(var(--chart-1))',
		},
		jd_icaraí: {
			label: 'JD Icaraí',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl'>
					Faturamento por Unidade
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className='w-full h-96 md:72'>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 20,
							left: 28,
							right: 28,
						}}>
						<CartesianGrid vertical={false} />
						{isMobile ? null : (
							<XAxis
								dataKey='period'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								fontSize={8}
							/>
						)}

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='dot' />}
						/>
						<ChartLegend
							content={<ChartLegendContent className='text-xs mt-8' />}
						/>
						<Line
							dataKey='jd_centro'
							type='natural'
							stroke='var(--color-jd_centro)'
							strokeWidth={2}
							dot={{
								fill: 'var(--color-jd_centro)',
							}}
							activeDot={{
								r: 6,
							}}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground text-nowrap text-start'
								fontSize={10}
								formatter={(value: number) =>
									value.toLocaleString('pt-br', {
										style: 'currency',
										currency: 'brl',
										notation: 'compact',
									})
								}
							/>
						</Line>
						<Line
							dataKey='jd_icaraí'
							type='natural'
							stroke='var(--color-jd_icaraí)'
							strokeWidth={2}
							dot={{
								fill: 'var(--color-jd_icaraí)',
							}}
							activeDot={{
								r: 6,
							}}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground'
								fontSize={10}
								formatter={(value: number) =>
									value.toLocaleString('pt-br', {
										style: 'currency',
										currency: 'brl',
										notation: 'compact',
									})
								}
							/>
						</Line>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
