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
import { Cell, Pie, PieChart } from 'recharts';

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
	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square max-h-[400px] w-full [&_.recharts-pie-label-text]:fill-foreground'>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent />}
				/>
				<Pie
					data={chartData}
					dataKey='value'
					nameKey='name'
					innerRadius={80}
					label={({ name, percent }) =>
						`${name} ${(percent * 100).toFixed(0)}%`
					}
					labelLine={false}>
					{chartData.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={`var(--color-${entry.name})`}
						/>
					))}
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
