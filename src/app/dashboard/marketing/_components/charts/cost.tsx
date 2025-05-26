/** @format */

'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/utils/format-currency';

const chartConfigCost = {
	cpm: {
		label: 'CPM',
		color: 'hsl(var(--chart-1))',
	},
	cpc: {
		label: 'CPC',
		color: 'hsl(var(--chart-2))',
	},
	cpa: {
		label: 'CPA',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

interface CostsComponentProps {
	impressions: number;
	clicks: number;
	cost_micros: number;
	conversions: number;
}
export function CostsComponent({
	clicks,
	conversions,
	cost_micros,
	impressions,
}: CostsComponentProps) {
	const milImpressions = impressions / 1000;
	const costNormalize = cost_micros / 1000000;

	const chartDataCost = [
		{
			cpm: impressions === 0 ? 0 : costNormalize / milImpressions,
			cpc: clicks == 0 ? 0 : costNormalize / clicks,
			cpa: conversions == 0 ? 0 : costNormalize / conversions,
		},
	];
	return (
		<ChartContainer
			className='h-80 md:h-72 w-full'
			config={chartConfigCost}>
			<BarChart
				accessibilityLayer
				layout='vertical'
				margin={{
					right: 80,
				}}
				data={chartDataCost}>
				<CartesianGrid horizontal={false} />
				<YAxis
					dataKey='cpm'
					tickMargin={12}
					type='category'
					tickLine={false}
					axisLine={false}
					hide
				/>
				<XAxis
					dataKey='cpm'
					type='number'
					scale={'sqrt'}
					hide
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>

				<Bar
					radius={4}
					dataKey='cpm'
					layout='vertical'
					fill='var(--color-cpm)'>
					<LabelList
						dataKey={'cpm'}
						position='right'
						offset={8}
						className='fill-foreground'
						fontSize={10}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
				<Bar
					radius={4}
					dataKey='cpc'
					layout='vertical'
					fill='var(--color-cpc)'>
					<LabelList
						dataKey={'cpc'}
						position='right'
						offset={8}
						className='fill-foreground'
						fontSize={10}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
				<Bar
					radius={4}
					dataKey='cpa'
					layout='vertical'
					fill='var(--color-cpa)'>
					<LabelList
						dataKey={'cpa'}
						position='right'
						offset={8}
						className='fill-foreground'
						fontSize={10}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
				<ChartLegend
					content={
						<ChartLegendContent className='translate-x-10  md:translate-x-0 w-fit mx-auto' />
					}
				/>
			</BarChart>
		</ChartContainer>
	);
}
