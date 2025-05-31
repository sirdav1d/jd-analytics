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
import React from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';

interface ComparisonProps {
	title: string;
}
export default function ComparisonUnit({ title }: ComparisonProps) {
	const customerData = React.useMemo(
		() => [
			{ name: 'centro', value: 390000 },
			{ name: 'icarai', value: 130000 },
		],
		[],
	);

	const chartConfig = {
		centro: {
			label: 'JD Centro',
			color: 'hsl(var(--chart-1))',
		},
		icarai: {
			label: 'JD Icaraí',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const totalSales = React.useMemo(() => {
		return customerData.reduce((acc, curr) => acc + curr.value, 0);
	}, [customerData]);

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl'>
					{title}
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
							data={customerData}
							dataKey='value'
							nameKey='name'
							innerRadius={88}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
							labelLine={false}>
							{customerData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={`var(--color-${entry.name})`}
								/>
							))}
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
													{totalSales.toLocaleString('pt-br', {
														style: 'currency',
														currency: 'brl',
														notation: 'compact',
													})}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'>
													Faturamento
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey='name' />}
							className='text-xs '
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
