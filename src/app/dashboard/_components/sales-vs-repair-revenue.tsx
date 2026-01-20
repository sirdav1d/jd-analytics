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
import { use } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SalesVsRepairRevenue({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();

	if (!allData?.ok || !allData?.data?.salesByOrg) {
		if (allData && !allData.ok) {
			console.log(allData.error);
		}
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-xl'>
						Sem dados encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	const salesData = allData.data.salesByOrg;

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
					Vendas por unidade
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className='h-96 md:h-72 w-full'
					config={chartConfig}>
					<LineChart
						accessibilityLayer
						margin={{ top: 20, right: 28, left: 28 }}
						data={salesData}>
						<CartesianGrid vertical={false} />
						{isMobile ? null : (
							<XAxis
								dataKey='period'
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								fontSize={8}
							/>
						)}
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='dot' />}
						/>
						<ChartLegend
							content={<ChartLegendContent className='text-xs mt-5' />}
						/>
						<Line
							dataKey='jd_centro'
							dot={{
								fill: 'var(--color-jd_centro)',
							}}
							activeDot={{
								r: 6,
							}}
							type='natural'
							strokeWidth={2}
							stroke='var(--color-jd_centro)'
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
							dataKey='jd_icaraí'
							type='natural'
							dot={{
								fill: 'var(--color-jd_icaraí)',
							}}
							activeDot={{
								r: 6,
							}}
							strokeWidth={2}
							stroke='var(--color-jd_icaraí)'
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
