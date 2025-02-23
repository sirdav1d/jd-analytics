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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/utils/format-currency';

export default function SellerComparison() {
	const chartConfig = {
		sales: {
			label: 'Vendas',
			color: 'hsl(var(--chart-1))',
		},
		revenue: {
			label: 'Faturamento',
			color: 'hsl(var(--chart-3))',
		},
		ticket: {
			label: 'Ticket Médio',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const chartData = [
		{
			name: 'Paulo',
			sales: 40,
			revenue: 12800,
			ticket: 320,
		},
		{
			name: 'Weliton',
			sales: 30,
			revenue: 12900,
			ticket: 430,
		},
		{
			name: 'Lucas',
			sales: 70,
			revenue: 19500,
			ticket: 278,
		},
		{
			name: 'Joyce',
			sales: 50,
			revenue: 13600,
			ticket: 272,
		},
	];

	return (
		<ChartContainer
			config={chartConfig}
			className='h-80 md:h-72 w-full'>
			<BarChart
				margin={{
					top: 28,
					right: 24,
				}}
				data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='name'
					tickMargin={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					scale={'sqrt'}
					hide
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
				<Bar
					radius={4}
					dataKey='sales'
					fill='var(--color-sales)'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					radius={4}
					dataKey='ticket'
					fill='var(--color-ticket)'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
				{/* <Bar
					radius={4}
					yAxisId='right'
					dataKey='revenue'
					fill='var(--color-revenue)'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar> */}
			</BarChart>
		</ChartContainer>
	);
}
