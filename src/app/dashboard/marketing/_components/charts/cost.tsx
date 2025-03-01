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

const chartConfig = {
	impressions: {
		label: 'Impressões',
		color: 'hsl(var(--chart-1))',
	},
	clicks: {
		label: 'Cliques',
		color: 'hsl(var(--chart-2))',
	},
	conversions: {
		label: 'Conversões',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

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
	const chartData = [
		{
			impressions: impressions ?? 0,
			clicks: clicks ?? 0,
			conversions: conversions ?? 0,
			totalCost: cost_micros ?? 0,
		},
	];

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
		<div className='flex flex-col w-full xl:flex-row items-center gap-5 h-full justify-center'>
			<ChartContainer
				className='h-80 md:h-72 w-full'
				config={chartConfig}>
				<BarChart
					accessibilityLayer
					layout='vertical'
					margin={{
						right: 80,
					}}
					data={chartData}>
					<CartesianGrid horizontal={false} />
					<YAxis
						type='category'
						hide
					/>
					<XAxis
						dataKey='impressions'
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
						dataKey='impressions'
						layout='vertical'
						fill='var(--color-impressions)'>
						<LabelList
							dataKey={'impressions'}
							position='right'
							offset={8}
							className='fill-foreground'
							fontSize={10}
							formatter={(value: number) => value.toLocaleString('pt-BR')}
						/>
					</Bar>
					<Bar
						radius={4}
						dataKey='clicks'
						layout='vertical'
						fill='var(--color-clicks)'>
						<LabelList
							dataKey={'clicks'}
							position='right'
							offset={8}
							className='fill-foreground'
							fontSize={10}
							formatter={(value: number) => value.toLocaleString('pt-BR')}
						/>
					</Bar>
					<Bar
						radius={4}
						dataKey='conversions'
						layout='vertical'
						fill='var(--color-conversions)'>
						<LabelList
							dataKey={'conversions'}
							position='right'
							offset={8}
							className='fill-foreground'
							fontSize={10}
							formatter={(value: number) => value.toLocaleString('pt-BR')}
						/>
					</Bar>
					<ChartLegend content={<ChartLegendContent />} />
				</BarChart>
			</ChartContainer>
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
					<ChartLegend content={<ChartLegendContent />} />
				</BarChart>
			</ChartContainer>
		</div>
	);
}
