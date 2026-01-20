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
export default function SellerComparisonMobile({
	data,
}: ISellerComparisonProps) {
	const allData = use(data);
	if (!allData?.ok || !Array.isArray(allData?.overview)) {
		if (allData && !allData.ok) {
			console.log(allData.error);
		}
		return (
			<div className='xl:hidden h-[780px] w-full flex items-center justify-center text-sm text-muted-foreground'>
				Sem dados encontrados
			</div>
		);
	}
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
			className='xl:hidden h-[780px] aspect-auto'>
			<BarChart
				accessibilityLayer
				layout='vertical'
				margin={{
					right: 16,
					left: -24,
				}}
				data={chartData}>
				<CartesianGrid
					horizontal={false}
					vertical={false}
				/>

				<YAxis
					dataKey='name'
					width={120}
					type='category'
					tickLine={false}
					tickMargin={10}
					style={{ textTransform: 'lowercase' }}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 10) + '...'}
				/>

				<XAxis
					dataKey='ticket'
					type='number'
					scale={'sqrt'}
					hide
				/>

				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend
					content={<ChartLegendContent className='md:text-sm  w-fit mx-auto' />}
				/>
				<Bar
					radius={4}
					layout='vertical'
					dataKey='sales'
					fill='var(--color-sales)'>
					<LabelList
						position={'right'}
						offset={12}
						className='fill-foreground font-semibold'
						fontSize={14}
					/>
				</Bar>
				<Bar
					radius={4}
					layout='vertical'
					dataKey='ticket'
					fill='var(--color-ticket)'>
					<LabelList
						position={'insideRight'}
						className='fill-foreground translate-x-5 font-semibold'
						fontSize={14}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
