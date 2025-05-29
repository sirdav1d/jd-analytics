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

export function CustomerComparisonChartComponent({
	data,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
}) {
	const isTablet = useIsTablet();
	const allData = use(data);

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

	const chartData = [
		{
			name: 'Novos',
			revenue: allData.data.salesByClientType[0].revenue,
			fill: `var(--color-Novos)`,
		},
		{
			name: 'Recorrentes',
			revenue: allData.data.salesByClientType[1].revenue,
			fill: `var(--color-Recorrentes)`,
		},
	];

	const chartConfig = {
		Novos: {
			label: 'Novos',
			color: 'hsl(var(--chart-1))',
		},
		Recorrentes: {
			label: 'Recorrentes',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;
	const totalVisitors = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl'>
					Novos Clientes vs. Recorrentes
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
							innerRadius={isTablet ? 70 : 80}
							outerRadius={isTablet ? 90 : 104}
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
