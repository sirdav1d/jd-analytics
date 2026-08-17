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
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { use } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { getOrganizationSeries } from './organization-series';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RevenueChart({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();
	const series = getOrganizationSeries(allData);

	if (!allData?.ok || !Array.isArray(allData?.data?.revenueByOrg) || series.length === 0) {
		if (allData && !allData.ok) {
			console.log(allData.error);
		}
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
	const chartConfig: ChartConfig = Object.fromEntries(
		series.map(({ dataKey, label, color }) => [dataKey, { label, color }]),
	);
	const formatRevenue = (value: number) =>
		value.toLocaleString('pt-br', {
			style: 'currency',
			currency: 'brl',
			notation: 'compact',
		});

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
					{series.length === 1 ? (
						<AreaChart
							accessibilityLayer
							data={chartData}
							margin={{ top: 20, left: 28, right: 28 }}>
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
							<defs>
								<linearGradient id='fill-single-revenue' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.8} />
									<stop offset='95%' stopColor={`var(--color-${series[0].dataKey})`} stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<Area
								dataKey={series[0].dataKey}
								type='natural'
								fill='url(#fill-single-revenue)'
								fillOpacity={0.4}
								stroke={`var(--color-${series[0].dataKey})`}
								strokeWidth={2}
								dot={{ fill: `var(--color-${series[0].dataKey})` }}
								activeDot={{ r: 6 }}>
								<LabelList
									position='top'
									offset={12}
									className='fill-foreground text-nowrap text-start'
									fontSize={10}
									formatter={formatRevenue}
								/>
							</Area>
						</AreaChart>
					) : (
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{ top: 20, left: 28, right: 28 }}>
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
							{series.map(({ dataKey }) => (
								<Line
									key={dataKey}
									dataKey={dataKey}
									type='natural'
									stroke={`var(--color-${dataKey})`}
									strokeWidth={2}
									dot={{ fill: `var(--color-${dataKey})` }}
									activeDot={{ r: 6 }}>
									<LabelList
										position='top'
										offset={12}
										className='fill-foreground text-nowrap text-start'
										fontSize={10}
										formatter={formatRevenue}
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
