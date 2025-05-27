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
import { useIsTablet } from '@/hooks/use-mobile';
import { use } from 'react';
import { Label, Pie, PieChart } from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SalesByClient({ data }: { data: Promise<any> }) {
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

	const fisica = allData.data.salesByClient[0];

	const juridica = allData.data.salesByClient[1];

	const chartData = [
		{
			name: fisica.type,
			revenue: fisica?.revenue ?? 0,
			fill: `var(--color-${fisica.type})`,
		},
		{
			name: juridica.type,
			revenue: juridica?.revenue ?? 0,
			fill: `var(--color-${juridica.type})`,
		},
	];
	const totalVisitors = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

	const chartConfig = {
		revenue: { label: 'Faturamento' },
		FISICA: {
			label: 'Pessoa Física',
			color: 'hsl(var(--chart-1))',
		},
		JURIDICA: {
			label: 'Pessoa Jurídica',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Faturamento por Cliente
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
						<ChartLegend
							content={<ChartLegendContent nameKey='name' />}
							className='flex flex-wrap text-sm translate-y-3'
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
