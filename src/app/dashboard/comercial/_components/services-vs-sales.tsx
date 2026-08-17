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
import { useIsMobile } from '@/hooks/use-mobile';
import { use } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ServicesVsSales({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();

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

	const revenueByType = new Map<string, number>(
		(allData.data.salesByItemType ?? []).map(
			(item: { type: string; revenue: number }) => [item.type, item.revenue],
		),
	);

	const chartData = [
		{
			id: 'service',
			name: 'Serviço',
			value: revenueByType.get('Serviço') ?? 0,
			fill: 'var(--color-Serviço)',
		},
		{
			id: 'product',
			name: 'Produto',
			value: revenueByType.get('Produto') ?? 0,
			fill: 'var(--color-Produto)',
		},
	];

	const chartConfig = {
		value: { label: 'Faturamento' },
		Serviço: {
			label: 'Serviços',
			color: 'hsl(var(--chart-1))',
		},
		Produto: {
			label: 'Produtos',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const totalVisitors = chartData.reduce((acc, curr) => acc + curr.value, 0);

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
					className='mx-auto h-[300px] w-full max-w-[320px] md:max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<Pie
							data={chartData}
							dataKey='value'
							nameKey='name'
							label={({ payload, ...props }) => {
								return (
									<text
										fontSize={12}
										fontWeight={600}
										cx={props.cx}
										cy={props.cy}
										x={props.x}
										y={props.y + 8}
										textAnchor={'middle'}
										dominantBaseline={props.dominantBaseline}
										fill='hsla(var(--foreground))'>
										{payload.value.toLocaleString('pt-br', {
											style: 'currency',
											currency: 'brl',
											notation: 'compact',
										})}
									</text>
								);
							}}
							bias={-40}
							labelLine={false}
							innerRadius={isMobile ? 72 : 80}
							outerRadius={isMobile ? 96 : 104}
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
						<ChartLegend
							content={<ChartLegendContent nameKey='name' />}
							className='flex flex-wrap justify-center whitespace-normal'
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
