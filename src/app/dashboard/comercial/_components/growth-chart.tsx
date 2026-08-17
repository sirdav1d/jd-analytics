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

const chartData = [
	{ name: 'Jan', total: 1900 },
	{ name: 'Feb', total: 2000 },
	{ name: 'Mar', total: 1900 },
	{ name: 'Apr', total: 2700 },
	{ name: 'May', total: 2100 },
	{ name: 'Jun', total: 2000 },
];
const chartConfig = {
	total: {
		label: 'Crescimento',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export function GrowthChartComponent() {
	const isMobile = useIsMobile();

	return (
		<ChartContainer
			className='h-80 min-w-0 w-full md:h-72'
			config={chartConfig}>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={
					isMobile
						? { top: 24, left: 8, right: 12, bottom: 8 }
						: { top: 28, left: 24, right: 24 }
				}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='name'
					tickLine={false}
					axisLine={false}
					tickMargin={12}
					interval={isMobile ? 'preserveStartEnd' : undefined}
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
					type='natural'
					fill='url(#fillDesktop)'
					fillOpacity={0.4}
					stroke='var(--color-total)'
					strokeWidth={2}
					dot={{
						fill: 'var(--color-total)',
					}}
					activeDot={{
						r: 6,
					}}>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={10}
						formatter={(val: number) => val.toLocaleString('pt-BR')}
					/>
				</Area>
			</AreaChart>
		</ChartContainer>
	);
}
