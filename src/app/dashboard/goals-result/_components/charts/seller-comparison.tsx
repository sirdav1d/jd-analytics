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
import { IOverview } from '@/services/data-services/types';
import { formatCurrency } from '@/utils/format-currency';
import { normalizeVendedorLabel } from '@/utils/normalize-name-vendor-label';

interface SellerComparisonProps {
	sellerData: IOverview[];
}

export default function SellerComparison({
	sellerData,
}: SellerComparisonProps) {
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

	const chartData = sellerData.map((item) => {
		return {
			name: normalizeVendedorLabel(item.vendedor),
			ticket: item.avgTicket,
			sales: item.orderCount,
		};
	});

	return (
		<ChartContainer
			config={chartConfig}
			className='h-80 md:h-72 w-full'>
			<BarChart
				accessibilityLayer
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
					tickFormatter={(value: string) => value.slice(4, 18) + '...'}
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
			</BarChart>
		</ChartContainer>
	);
}
