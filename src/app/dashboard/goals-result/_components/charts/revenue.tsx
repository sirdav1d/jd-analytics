/** @format */

'use client';

import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { IGoalTracking } from '@/services/data-services/types';
import { formatCurrency } from '@/utils/format-currency';
import { use } from 'react';

interface IRevenueProps {
	data: Promise<IGoalTracking>;
}

export function Revenue({ data }: IRevenueProps) {
	const allData = use(data);
	const chartConfig = {
		revenue: {
			label: 'Faturamento',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	const isMobile = useIsMobile();
	const chartData = allData.timeSeries;
	return (
		<ChartContainer
			className='h-80 w-full '
			config={chartConfig}>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: isMobile ? 12 : 40,
					right: isMobile ? 12 : 40,
					top: 20,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='period'
					fontSize={9}
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tick={isMobile ? false : true}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
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
					type='natural'
					fill='url(#fillDesktop)'
					dot={{
						fill: 'var(--color-revenue)',
					}}
					activeDot={{
						r: 6,
					}}
					fillOpacity={0.4}
					stroke='var(--color-revenue)'
					stackId='a'>
					<LabelList
						dataKey='revenue'
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={isMobile ? 8 : 10}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Area>
			</AreaChart>
		</ChartContainer>
	);
}
