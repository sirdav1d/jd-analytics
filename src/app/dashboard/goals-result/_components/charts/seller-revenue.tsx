/** @format */

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
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/utils/format-currency';

export default function SellerRevenue() {
	const chartConfig = {
		revenue: {
			label: 'Faturamento',
		},
		Paulo: {
			label: 'Paulo',
			color: 'hsl(var(--chart-1))',
		},
		Weliton: {
			label: 'Weliton',
			color: 'hsl(var(--chart-2))',
		},
		Lucas: {
			label: 'Lucas',
			color: 'hsl(var(--chart-3))',
		},
		Joyce: {
			label: 'Joyce',
			color: 'hsl(var(--chart-4))',
		},
	} satisfies ChartConfig;

	const chartData = [
		{
			name: 'Paulo',
			sales: 40,
			revenue: 12800,
			ticket: 320,
			fill: 'var(--color-Paulo)',
		},
		{
			name: 'Weliton',
			sales: 30,
			revenue: 12900,
			ticket: 430,
			fill: 'var(--color-Weliton)',
		},
		{
			name: 'Lucas',
			sales: 70,
			revenue: 19500,
			ticket: 278,
			fill: 'var(--color-Lucas)',
		},
		{
			name: 'Joyce',
			sales: 50,
			revenue: 13600,
			ticket: 272,
			fill: 'var(--color-Joyce)',
		},
	];

	return (
		<ChartContainer
			config={chartConfig}
			className='h-80 md:h-72 w-full'>
			<BarChart
				accessibilityLayer
				layout='vertical'
				margin={{
					right: 80
				}}
				data={chartData}>
				<CartesianGrid horizontal={false} />
				<YAxis
					dataKey='name'
					tickMargin={12}
					type='category'
					tickLine={false}
					axisLine={false}
					hide
				/>
				<XAxis
					dataKey='revenue'
					type='number'
					hide
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>

				<Bar
					radius={4}
					dataKey='revenue'
					layout='vertical'
					fill='var(--color-fill)'>
					<LabelList
						dataKey={'name'}
						position='insideLeft'
						offset={12}
						className='fill-[--color-label]'
						fontSize={14}
						fontWeight={700}
					/>
					<LabelList
						dataKey={'revenue'}
						position='right'
						offset={10}
						className='fill-foreground'
						fontSize={12}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
