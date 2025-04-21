/** @format */

'use client';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

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
	const chartData = [{ data: 'Janeiro', Atingido: 80, Restante: 40 }];
	const totaltraffic = chartData[0].Atingido + chartData[0].Restante;

	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square w-full md:max-h-[288px] [&_.recharts-pie-label-text]:fill-foreground'>
			<RadialBarChart
				data={chartData}
				endAngle={180}
				innerRadius={120}
				outerRadius={180}>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<PolarRadiusAxis
					tick={false}
					tickLine={false}
					axisLine={false}>
					<Label
						content={({ viewBox }) => {
							if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
								return (
									<text
										x={viewBox.cx}
										y={viewBox.cy}
										textAnchor='middle'>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) - 16}
											className='fill-foreground text-2xl font-bold'>
											{totaltraffic.toLocaleString('pt-br', {
												style: 'currency',
												currency: 'BRL',
											})}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 4}
											className='fill-muted-foreground text-sm'>
											Atingido
										</tspan>
									</text>
								);
							}
						}}
					/>
				</PolarRadiusAxis>
				<RadialBar
					dataKey='Atingido'
					stackId='a'
					cornerRadius={5}
					fill='var(--color-Atingido)'
					className='stroke-transparent stroke-2'
				/>
				<RadialBar
					dataKey='Restante'
					fill='var(--color-Restante)'
					stackId='a'
					cornerRadius={5}
					className='stroke-transparent stroke-2'
				/>
			</RadialBarChart>
		</ChartContainer>
	);
}
