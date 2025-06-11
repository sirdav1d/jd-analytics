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
					className='mx-auto aspect-square w-full max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout='vertical'
						margin={{
							right: isMobile ? 60 : 48,
							left: isMobile ? -32 : -20,
						}}>
						<XAxis
							type='number'
							dataKey='revenue'
							hide
						/>
						<YAxis
							style={{ lineHeight: '40px' }}
							width={180}
							fontSize={10}
							dataKey='category'
							type='category'
							tickLine={false}
							tickMargin={isMobile ? 8 : 12}
							axisLine={false}
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
							className='grid grid-cols-2 lg:grid-cols-3 text-nowrap translate-y-4 lg:translate-y-2 mx-auto w-fit text-[10px] lg:text-xs gap-y-2 gap-x-5  '
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
