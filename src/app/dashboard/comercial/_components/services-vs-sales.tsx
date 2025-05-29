/** @format */

'use client';

import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsTablet } from '@/hooks/use-mobile';
import { use } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ServicesVsSales({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isTablet = useIsTablet();

	if (!allData.ok) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance xl:text-xl'>
						Sem dados encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	console.log(allData.data.salesByItemType[1]?.type);
	const chartData = [
		{
			name: allData.data.salesByItemType[0]?.type ?? '',
			revenue: allData.data.salesByItemType[0]?.revenue ?? 0,
			fill: `var(--color-${allData.data.salesByItemType[0]?.type})`,
		},
		{
			name: allData.data.salesByItemType[1]?.type ?? '',
			revenue: allData.data.salesByItemType[1]?.revenue ?? 0,
			fill: `var(--color-${allData.data.salesByItemType[1]?.type})`,
		},
	];

	const chartConfig = {
		revenue: { label: 'Faturamento' },
		Serviço: {
			label: 'Serviços',
			color: 'hsl(var(--chart-1))',
		},
		Produto: {
			label: 'Produtos',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const totalVisitors = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl'>
					Serviços vs. Produtos
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square w-full max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<Pie
							data={chartData}
							dataKey='revenue'
							nameKey='name'
							label={({ payload, ...props }) => {
								return (
									<text
										fontSize={isTablet ? 10 : 12}
										fontWeight={600}
										cx={props.cx}
										cy={props.cy}
										x={props.x}
										y={props.y + 8}
										textAnchor={props.textAnchor}
										dominantBaseline={props.dominantBaseline}
										fill='hsla(var(--foreground))'>
										{payload.revenue.toLocaleString('pt-br', {
											style: 'currency',
											currency: 'brl',
											notation: 'compact',
										})}
									</text>
								);
							}}
							labelLine={false}
							innerRadius={isTablet ? 68 : 80}
							outerRadius={isTablet ? 84 : 104}
							strokeWidth={4}>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor='middle'
												dominantBaseline='middle'>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className='fill-foreground text-xl font-bold'>
													{totalVisitors.toLocaleString('pt-br', {
														style: 'currency',
														currency: 'brl',
														notation: 'compact',
													})}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'>
													Faturamento Total
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
						<ChartLegend content={<ChartLegendContent nameKey='name' />} />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
