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
import { formatCurrency } from '@/utils/format-currency';
import React from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';

const chartConfig = {
	Atingido: {
		label: 'Atingido',
		color: 'hsl(var(--chart-1))',
	},
	Restante: {
		label: 'Restante',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

export function PieStore() {
	const chartData = [
		{ name: 'Atingido', value: 80 },
		{ name: 'Restante', value: 40 },
	];
	const totaltraffic = 158;

	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square max-h-[288px] [&_.recharts-pie-label-text]:fill-foreground'>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent />}
				/>
				<Pie
					data={chartData}
					dataKey='value'
					nameKey='name'
					innerRadius={68}
					label={({ percent, ...props }) => {
						return (
							<text
								className='text-foreground'
								cx={props.cx}
								cy={props.cy}
								x={props.x - 14}
								y={props.y}
								textAnchor={props.textAnchor + 1}
								dominantBaseline={props.dominantBaseline}
								fill='hsla(var(--foreground))'>{` ${(percent * 100).toFixed(
								0,
							)}%`}</text>
						);
					}}
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
											className='fill-foreground text-xl font-bold'>
											{formatCurrency(totaltraffic)}
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
					className='text-xs md:text-sm pt-3 md:text-nowrap flex-wrap md:flex-nowrap'
				/>
			</PieChart>
		</ChartContainer>
	);
}
