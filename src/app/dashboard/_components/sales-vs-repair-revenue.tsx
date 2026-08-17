/** @format */

'use client';

import {
	Area,
	AreaChart,
	CartesianGrid,
	LabelList,
	Line,
	LineChart,
	XAxis,
} from 'recharts';

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
import { getHistoryOrganizationSeries } from './organization-series';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SalesVsRepairRevenue({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();
	const chartMargin = isMobile
		? { top: 24, left: 8, right: 12, bottom: 8 }
		: { top: 20, right: 28, left: 28 };

	const series = getHistoryOrganizationSeries(allData, 'salesByOrg');

	if (!allData?.ok || !Array.isArray(allData?.data?.salesByOrg) || series.length === 0) {
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

	const chartConfig: ChartConfig = Object.fromEntries(
		series.map(({ dataKey, label, color }) => [dataKey, { label, color }]),
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl'>
					Vendas ao longo do tempo
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className='h-96 md:h-72 w-full'
					config={chartConfig}>
					{series.length === 1 ? (
						<AreaChart
							accessibilityLayer
							data={salesData}
							margin={chartMargin}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='period'
								tickLine={false}
								tickMargin={8}
								axisLine={false}
								fontSize={8}
								interval='preserveStartEnd'
								minTickGap={28}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator='dot' />}
							/>
							<defs>
								<linearGradient id='fill-single-sales' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.8} />
									<stop offset='95%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<Area
								dataKey={series[0].dataKey}
								name={series[0].label}
								type='natural'
								fill='url(#fill-single-sales)'
								fillOpacity={0.4}
								stroke={`var(--color-${series[0].dataKey})`}
								strokeWidth={2}
								dot={{ fill: `var(--color-${series[0].dataKey})` }}
								activeDot={{ r: 6 }}>
								<LabelList position='top' offset={12} className='fill-foreground' fontSize={10} formatter={(value: number) => value.toLocaleString('pt-BR')} />
							</Area>
						</AreaChart>
					) : (
						<LineChart
							accessibilityLayer
							margin={chartMargin}
							data={salesData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='period'
								tickLine={false}
								tickMargin={8}
								axisLine={false}
								fontSize={8}
								interval='preserveStartEnd'
								minTickGap={28}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator='dot' />}
							/>
							<ChartLegend
								content={<ChartLegendContent className='text-xs mt-5' />}
							/>
							{series.map(({ dataKey, label }) => (
								<Line
									key={dataKey}
									dataKey={dataKey}
									name={label}
									type='natural'
									strokeWidth={2}
									stroke={`var(--color-${dataKey})`}
									dot={{ fill: `var(--color-${dataKey})` }}
									activeDot={{ r: 6 }}>
									<LabelList
										position='top'
										offset={12}
										className='fill-foreground'
										fontSize={10}
										formatter={(value: number) => value.toLocaleString('pt-BR')}
									/>
								</Line>
							))}
						</LineChart>
					)}
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
