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
import { Label, Pie, PieChart } from 'recharts';

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
			category: item.category.replace(' ', ''),
			revenue: Number(item.revenue) ?? 0,
			fill: `var(--color-${item.category.replace(' ', '')})`,
		});
	});

	const totalVisitors = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

	return (
		<Card className='h-full'>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Faturamento por Categoria
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square w-full max-h-[380px] [&_.recharts-pie-label-text]:fill-foreground'>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<Pie
							data={chartData}
							dataKey='revenue'
							offset={2}
							textAnchor='top'
							nameKey='category'
							label={({ payload, ...props }) => {
								return (
									<text
										fontSize={isMobile ? 10 : 11}
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
							innerRadius={72}
							outerRadius={94}
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
							content={<ChartLegendContent nameKey='category' />}
							className='grid grid-cols-2 lg:grid-cols-3 text-nowrap translate-y-4 lg:translate-y-1 mx-auto w-fit text-[11px] mt-3 gap-2 lg:gap-4'
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
