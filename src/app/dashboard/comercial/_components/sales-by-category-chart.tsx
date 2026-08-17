/** @format */

'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import {
	getMobileCategoricalChartHeight,
	ResponsiveChartTick,
} from '@/components/ui/responsive-chart';
import { use } from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

const chartConfig = {
	revenue: { label: 'Faturamento' },
	ACESSORIOSOFFICE: {
		label: 'ACESSORIOS OFFICE',
		color: 'hsl(var(--chart-3))',
	},
	HARDWAREOFFICE: {
		label: 'HARDWARE OFFICE',
		color: 'hsl(var(--chart-2))',
	},
	ACESSORIOSGAMER: {
		label: 'ACESSORIOS GAMER',
		color: 'hsl(var(--chart-4))',
	},
	HARDWAREGAMER: {
		label: 'HARDWARE GAMER',
		color: 'hsl(var(--chart-1))',
	},
	GERAL: {
		label: 'GERAL',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SalesByCategoryChart({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();
	// const isTablet = useIsTablet();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const chartData: any[] | undefined = [];

	if (!allData.ok) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Sem dados encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	allData.data.salesByCategory?.map((item: any) => {
		return chartData.push({
			category: item.category,
			revenue: Number(item.revenue) ?? 0,
			fill: `var(--color-${item.category.replace(' ', '')})`,
		});
	});

	// const totalVisitors = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

	return (
		<Card className='h-full '>
			<CardHeader>
				<CardTitle className='text-base text-balance xl:text-xl'>
					Faturamento por Categoria
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square w-full max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'
					style={{
						height: isMobile
							? getMobileCategoricalChartHeight(chartData.length)
							: undefined,
					}}>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout='vertical'
						margin={
							isMobile
								? { top: 8, left: 0, right: 52, bottom: 24 }
								: { right: 60, left: -40 }
						}>
						<XAxis
							type='number'
							dataKey='revenue'
							hide
						/>
						<YAxis
							style={{ lineHeight: '40px' }}
							width={isMobile ? 112 : 180}
							fontSize={10}
							dataKey='category'
							type='category'
							tickLine={false}
							tickMargin={isMobile ? 8 : 12}
							axisLine={false}
							tick={
								isMobile ? <ResponsiveChartTick axis='y' labelWidth={104} /> : undefined
							}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<Bar
							fill='var(--color-desktop)'
							radius={5}
							dataKey='revenue'>
							<LabelList
								dataKey='revenue'
								position='right'
								fontWeight={600}
								offset={8}
								className='fill-foreground'
								formatter={(value: number) =>
									`${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' })}`
								}
								fontSize={11}
							/>
						</Bar>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<ChartLegend
							content={<ChartLegendContent nameKey='category' />}
							className='grid w-full grid-cols-2 gap-x-5 gap-y-2 whitespace-normal text-[10px] lg:grid-cols-3 lg:text-xs'
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
