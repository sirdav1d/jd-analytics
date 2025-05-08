/** @format */

'use client';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	Label,
	LabelList,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from 'recharts';

const chartConfig = {
	Vendas: { label: 'Vendas' },
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
				accessibilityLayer
				data={chartData}
				endAngle={180}
				innerRadius={110}
				outerRadius={180}>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent />}
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
											className='fill-muted-foreground text-xs text-center'>
											Meta de Faturamento
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
					className='stroke-transparent stroke-2'>
					<LabelList
						position='outside'
						dataKey='Atingido'
						className='fill-white capitalize mix-blend-luminosity font-semibold'
						fontSize={12}
						offset={16}
					/>
				</RadialBar>
				<RadialBar
					dataKey='Restante'
					fill='var(--color-Restante)'
					stackId='a'
					cornerRadius={5}
					className='stroke-transparent stroke-2'>
					<LabelList
						position='outside'
						dataKey='Restante'
						className='fill-white capitalize mix-blend-luminosity font-semibold'
						fontSize={12}
						offset={16}
					/>
				</RadialBar>
			</RadialBarChart>
		</ChartContainer>
	);
}
