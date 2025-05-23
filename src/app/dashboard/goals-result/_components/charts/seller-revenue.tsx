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
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { IGoalTracking } from '@/services/data-services/types';
import { formatCurrency } from '@/utils/format-currency';
import { normalizeVendedor } from '@/utils/normalize-name-vendor';
import { normalizeVendedorLabel } from '@/utils/normalize-name-vendor-label';
import { use } from 'react';

interface ISellerRevenueProps {
	data: Promise<IGoalTracking>;
}

export default function SellerRevenue({ data }: ISellerRevenueProps) {
	const sellerData = use(data);
	const isMobile = useIsMobile();
	const config = sellerData.overview.map((item, index) => {
		return {
			[normalizeVendedor(item.vendedor)]: {
				label: normalizeVendedorLabel(item.vendedor),
				color: `hsl(var(--chart-${index + 1}))`,
			},
		};
	});

	const chartData = sellerData.overview.map((item) => {
		return {
			name: normalizeVendedor(item.vendedor),
			revenue: item.totalRevenue,
			fill: `var(--color-${normalizeVendedor(item.vendedor)})`,
		};
	});

	const chartConfig = {
		revenue: {
			label: 'Faturamento',
		},
		...config.reduce((acc, curr) => {
			return { ...acc, ...curr };
		}, {}),
	} satisfies ChartConfig;

	return (
		<ChartContainer
			config={chartConfig}
			className={'h-[480px] md:h-96 w-full'}>
			<BarChart
				accessibilityLayer
				layout='vertical'
				margin={{
					right: isMobile ? 80 : 92,
					left: -18,
				}}
				data={chartData}>
				<CartesianGrid
					horizontal={false}
					vertical={isMobile ? false : true}
				/>
				<YAxis
					width={isMobile ? 120 : 148}
					dataKey='name'
					tickMargin={8}
					type='category'
					tickLine={false}
					axisLine={false}
					fontSize={12}
					style={{ textTransform: 'lowercase' }}
					tickFormatter={(value) =>
						isMobile
							? chartConfig[value as keyof typeof chartConfig]?.label.slice(
									0,
									9,
								) + '...'
							: chartConfig[value as keyof typeof chartConfig]?.label.slice(
									0,
									16,
								) + '...'
					}
				/>
				<XAxis
					dataKey='revenue'
					scale='sqrt'
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
					fill='var(--color-fill)'
					layout='vertical'>
					<LabelList
						dataKey={'revenue'}
						position='right'
						offset={8}
						className='fill-foreground'
						fontSize={isMobile ? 10 : 12}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
