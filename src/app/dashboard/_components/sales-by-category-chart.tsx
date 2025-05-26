/** @format */

'use client';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from '@/components/ui/chart';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

const chartData = [
	{ name: 'Computadores', value: 400, fill: 'var(--color-Computadores)' },
	{ name: 'Computadore2s', value: 100, fill: 'var(--color-Computadore2s)' },
	{ name: 'Computadore3s', value: 200, fill: 'var(--color-Computadore3s)' },
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
	Computadore2s: {
		label: 'Computadores',
		color: 'hsl(var(--chart-4))',
	},
	Computadore3s: {
		label: 'Computadores',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

export function SalesByCategoryChart() {
	const isMobile = useIsMobile();
	const totalVisitors = React.useMemo(() => {
		return chartData.reduce((acc, curr) => acc + curr.value, 0);
	}, []);
	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square w-full max-h-[298px] [&_.recharts-pie-label-text]:fill-foreground'>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent />}
				/>
				<Pie
					data={chartData}
					dataKey='value'
					nameKey='name'
					
					label={{ fontSize: '12px' }}
					labelLine={false}
					innerRadius={isMobile ? 80 : 68}
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
							className='text-xs'
						/>
					}
					className='flex flex-wrap'
				/>
			</PieChart>
		</ChartContainer>
	);
}
