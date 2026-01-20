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
	if (!sellerData?.ok || !Array.isArray(sellerData?.overview)) {
		if (sellerData && !sellerData.ok) {
			console.log(sellerData.error);
		}
		return (
			<div className='h-[480px] md:h-96 w-full flex items-center justify-center text-sm text-muted-foreground'>
				Sem dados encontrados
			</div>
		);
	}
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
					right: isMobile ? 20 : 92,
					left: isMobile ? -32 : -10,
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
						position={`${isMobile ? 'insideRight' : 'right'}`}
						offset={8}
						className='fill-foreground font-semibold translate-x-5 md:translate-x-0'
						fontSize={isMobile ? 14 : 12}
						formatter={(value: number) => formatCurrency(value)}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
