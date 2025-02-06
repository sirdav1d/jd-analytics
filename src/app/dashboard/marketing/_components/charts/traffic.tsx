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
import React from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';

const chartData = [
	{ name: 'Orgânico', value: 4000 },
	{ name: 'Pago', value: 3000 },
	{ name: 'Social', value: 2000 },
];

const chartConfig = {
	Orgânico: {
		label: 'Orgânico',
		color: 'hsl(var(--chart-1))',
	},
	Pago: {
		label: 'Pago',
		color: 'hsl(var(--chart-2))',
	},
	Social: {
		label: 'Social',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function TrafficComponent() {
	const totaltraffic = React.useMemo(() => {
		return chartData.reduce((acc, curr) => acc + curr.value, 0);
	}, []);

	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square max-h-[348px] [&_.recharts-pie-label-text]:fill-foreground'>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent />}
				/>
				<Pie
					data={chartData}
					dataKey='value'
					nameKey='name'
					innerRadius={70}
					label={({ percent }) => ` ${(percent * 100).toFixed(0)}%`}
					labelLine={false}>
					{chartData.map((entry, index) => (
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
											className='fill-foreground text-3xl font-bold'>
											{totaltraffic.toLocaleString()}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 24}
											className='fill-muted-foreground text-wrap'>
											Impressões
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
					className='text-sm'
				/>
			</PieChart>
		</ChartContainer>
	);
}
