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

// const chartData = [
// 	{ name: 'Orgânico', value: 4000 },
// 	{ name: 'Pago', value: 3000 },
// 	{ name: 'Social', value: 2000 },
// ];

const chartConfig = {
	Organico: {
		label: 'Tráfego Orgânico',
		color: 'hsl(var(--chart-1))',
	},
	Pago: {
		label: 'Tráfego Pago',
		color: 'hsl(var(--chart-2))',
	},
	Social: {
		label: 'Redes Sociais',
		color: 'hsl(var(--chart-4))',
	},
	Direta: {
		label: 'Busca Direta',
		color: 'hsl(var(--chart-3))',
	},
	Outros: {
		label: 'Outros',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

interface TrafficComponentProps {
	Organico: number;
	Pago: number;
	Social: number;
	Direto: number;
	outros: number;
}

export function TrafficComponent({
	Direto,
	Organico,
	Pago,
	Social,
	outros,
}: TrafficComponentProps) {
	const { totaltraffic, chartData } = React.useMemo(() => {
		const chartData = [
			{ name: 'Organico', value: Organico },
			{ name: 'Pago', value: Pago },
			{ name: 'Direta', value: Direto },
			{ name: 'Social', value: Social },
			{ name: 'Outros', value: outros },
		];
		const totaltraffic = chartData.reduce((acc, curr) => acc + curr.value, 0);
		return { totaltraffic, chartData };
	}, [Organico, Direto, Pago, Social, outros]);

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
					innerRadius={60}
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
											className='fill-foreground text-3xl font-bold'>
											{totaltraffic.toLocaleString()}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 24}
											className='fill-muted-foreground text-wrap'>
											Usuários
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
					className='text-xs md:text-sm pt-5  md:text-nowrap flex-wrap md:flex-nowrap'
				/>
			</PieChart>
		</ChartContainer>
	);
}
