/** @format */

'use client';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

const chartData = [
	{ name: 'Computadores', value: 400, fill: 'var(--color-Computadores)' },
	{ name: 'Upgrades', value: 300, fill: 'var(--color-Upgrades)' },
	{ name: 'Reparos', value: 300, fill: 'var(--color-Reparos)' },
];

const chartConfig = {
	Upgrades: {
		label: 'Upgrades',
		color: 'hsl(var(--chart-1))',
	},
	Reparos: {
		label: 'Serviços',
		color: 'hsl(var(--chart-2))',
	},
	Computadores: {
		label: 'Computadores',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function SalesByCategoryChart() {
	const totalVisitors = React.useMemo(() => {
		return chartData.reduce((acc, curr) => acc + curr.value, 0);
	}, []);
	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square max-h-72 [&_.recharts-pie-label-text]:fill-foreground'>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent />}
				/>
				<Pie
					data={chartData}
					dataKey='value'
					nameKey='name'
					label={{ fontSize: '14px' }}
					labelLine={false}
					innerRadius={60}
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
											className='fill-foreground text-3xl font-bold'>
											{totalVisitors.toLocaleString()}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 24}
											className='fill-muted-foreground'>
											Vendas
										</tspan>
									</text>
								);
							}
						}}
					/>
				</Pie>
				<ChartLegend
					content={
						<ChartLegendContent
							nameKey='name'
							className='md:text-sm'
						/>
					}
					className='-translate-y-2  gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-sm'
				/>
			</PieChart>
		</ChartContainer>
	);
}
