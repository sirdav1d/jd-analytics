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
import React, { use } from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';

interface ComparisonProps {
	title: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
	type: string;
}
export default function ComparisonUnit({ title, data, type }: ComparisonProps) {
	const allData = use(data);

	if (!allData.ok) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-xl'>
						Dados não encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}
	const customerData = allData.data.result;

	const chartConfig = {
		revenue: {
			label: 'Faturamento',
		},
		salesCount: {
			label: 'Nº de Vendas',
		},
		newCustomers: {
			label: 'Total de Novos Clientes',
		},
		'JD Centro': {
			label: 'JD Centro',
			color: 'hsl(var(--chart-1))',
		},
		'JD Icaraí': {
			label: 'JD Icaraí',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const totalRevenue = customerData.reduce(
		(acc: number, curr: { revenue: number }) => acc + curr.revenue,
		0,
	);

	const totalSales = customerData.reduce(
		(acc: number, curr: { salesCount: number }) => acc + curr.salesCount,
		0,
	);

	const totalClients = customerData.reduce(
		(acc: number, curr: { newCustomers: number }) => acc + curr.newCustomers,
		0,
	);

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
							dataKey={type}
							nameKey='organization'
							fontSize={12}
							innerRadius={84}
							label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
							labelLine={false}>
							{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
							{customerData.map((_: any, index: number) => (
								<Cell
									key={`cell-${index}-${type}`}
									fill={`hsl(var(--chart-${index + 1}))`}
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
													className='fill-foreground text-2xl font-bold'>
													{type == 'revenue'
														? totalRevenue.toLocaleString('pt-br', {
																style: 'currency',
																currency: 'brl',
																notation: 'compact',
															})
														: type == 'salesCount'
															? totalSales.toLocaleString('pt-br')
															: totalClients.toLocaleString('pt-br')}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className='fill-muted-foreground'>
													{type == 'revenue'
														? 'Faturamento'
														: type == 'salesCount'
															? 'Total de Vendas'
															: 'Novos Clientes'}
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
