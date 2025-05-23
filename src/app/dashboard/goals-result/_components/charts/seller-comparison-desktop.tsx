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
import { IGoalTracking } from '@/services/data-services/types';
import { formatCurrency } from '@/utils/format-currency';
import { normalizeVendedorLabel } from '@/utils/normalize-name-vendor-label';
import { use } from 'react';

interface ISellerComparisonProps {
	data: Promise<IGoalTracking>;
}
export default function SellerComparison({ data }: ISellerComparisonProps) {
	const allData = use(data);
	const chartConfig = {
		sales: {
			label: 'Vendas',
			color: 'hsl(var(--chart-1))',
		},
		ticket: {
			label: 'Ticket Médio',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const chartData = allData.overview.map((item) => {
		return {
			name: normalizeVendedorLabel(item.vendedor),
			ticket: item.avgTicket,
			sales: item.orderCount,
		};
	});

	return (
		<ChartContainer
			config={chartConfig}
			className='hidden aspect-auto xl:block h-80 xl:w-full '>
			<BarChart
				accessibilityLayer
				margin={{
					top: 28,
					right: 24,
					left: 0,
				}}
				data={chartData}>
				<CartesianGrid vertical={false} />

				<YAxis
					scale={'sqrt'}
					hide
				/>

				<XAxis
					dataKey='name'
					tickMargin={12}
					tickLine={false}
					style={{ textTransform: 'lowercase' }}
					axisLine={false}
					tickFormatter={(value: string) => value.slice(0, 12) + '...'}
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
						position={'top'}
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
						offset={12}
						position={'top'}
						className='fill-foreground'
						fontSize={12}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
