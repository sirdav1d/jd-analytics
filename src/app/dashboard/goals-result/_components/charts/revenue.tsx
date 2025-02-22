/** @format */

'use client';

import { Area, AreaChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/utils/format-currency';
const chartData = [
	{ month: 'January', desktop: 186 },
	{ month: 'February', desktop: 305 },
	{ month: 'March', desktop: 237 },
	{ month: 'April', desktop: 73 },
	{ month: 'May', desktop: 209 },
	{ month: 'June', desktop: 214 },
];

const chartConfig = {
	desktop: {
		label: 'Faturamento',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export function Revenue() {
	return (
		<ChartContainer
			className='h-80 md:h-72 w-full'
			config={chartConfig}>
			<AreaChart
				accessibilityLayer
				data={chartData}
				margin={{
					left: 32,
					right: 32,
					top: 28,
				}}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='month'
					tickLine={false}
					axisLine={false}
					tickMargin={8}
					tickFormatter={(value) => value.slice(0, 3)}
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
							stopColor='var(--color-desktop)'
							stopOpacity={0.8}
						/>
						<stop
							offset='95%'
							stopColor='var(--color-desktop)'
							stopOpacity={0.1}
						/>
					</linearGradient>
					<linearGradient
						id='fillMobile'
						x1='0'
						y1='0'
						x2='0'
						y2='1'>
						<stop
							offset='5%'
							stopColor='var(--color-mobile)'
							stopOpacity={0.8}
						/>
						<stop
							offset='95%'
							stopColor='var(--color-mobile)'
							stopOpacity={0.1}
						/>
					</linearGradient>
				</defs>
				<Area
					dataKey='desktop'
					type='natural'
					fill='url(#fillDesktop)'
					fillOpacity={0.4}
					stroke='var(--color-desktop)'
					stackId='a'>
					<LabelList
						dataKey='desktop'
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={10}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Area>
			</AreaChart>
		</ChartContainer>
	);
}
