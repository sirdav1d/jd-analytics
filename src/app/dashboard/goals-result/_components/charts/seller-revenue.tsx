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
import { formatCurrency } from '@/utils/format-currency';
import { IOverview } from '@/services/data-services/types';
import { normalizeVendedor } from '@/utils/normalize-name-vendor';
import { normalizeVendedorLabel } from '@/utils/normalize-name-vendor-label';
import { useIsMobile } from '@/hooks/use-mobile';

interface SellerRevenueProps {
	sellerData: IOverview[];
}

export default function SellerRevenue({ sellerData }: SellerRevenueProps) {
	const isMobile = useIsMobile();
	const config = sellerData.map((item, index) => {
		return {
			[normalizeVendedor(item.vendedor)]: {
				label: normalizeVendedorLabel(item.vendedor),
				color: `hsl(var(--chart-${index + 1}))`,
			},
		};
	});

	const chartData = sellerData.map((item) => {
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
			className='h-80 w-full'>
			<BarChart
				accessibilityLayer
				layout='vertical'
				margin={{
					right: isMobile ? 76 : 92,
					left: -12,
				}}
				data={chartData}>
				<CartesianGrid horizontal={false} />
				<YAxis
					width={isMobile ? 80 : 188}
					dataKey='name'
					tickMargin={8}
					type='category'
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) =>
						isMobile
							? chartConfig[value as keyof typeof chartConfig]?.label.slice(
									4,
									12,
								) + '...'
							: chartConfig[value as keyof typeof chartConfig]?.label.slice(
									4,
									22,
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
