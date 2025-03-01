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

interface CostsComponentProps {
	impressions: number;
	clicks: number;
	cost_micros: number;
	conversions: number;
}
export function PerformanceComponent({
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

	return (
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
	);
}
