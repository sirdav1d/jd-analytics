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

interface IPieStore {
	realizado: number;
	meta: number;
}

interface IPieStoreProps {
	companySummary: IPieStore;
}

export function PieStore({ companySummary }: IPieStoreProps) {
	const atingido = companySummary.realizado;
	const restante = companySummary.meta - atingido;
	const chartData = [
		{ Atingido: atingido, Restante: restante < 0 ? 0 : restante },
	];

	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square w-full h-full md:max-h-[288px] [&_.recharts-pie-label-text]:fill-foreground  '>
			<RadialBarChart
				className='mt-5'
				accessibilityLayer
				data={chartData}
				endAngle={180}
				margin={{ top: 10 }}
				innerRadius={110}
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
											className='fill-foreground text-xl font-bold'>
											{companySummary.meta.toLocaleString('pt-br', {
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
					dataKey='Restante'
					fill='var(--color-Restante)'
					stackId='a'
					cornerRadius={5}
					className='stroke-transparent stroke-2'>
					<LabelList
						position='outside'
						dataKey='Restante'
						className='fill-foreground capitalize mix-blend-luminosity font-semibold pt-5'
						fontSize={11}
						offset={12}
						formatter={(val: number) =>
							val.toLocaleString('pt-BR', {
								style: 'currency',
								currency: 'brl',
							})
						}
					/>
				</RadialBar>
				<RadialBar
					dataKey='Atingido'
					stackId='a'
					cornerRadius={5}
					fill='var(--color-Atingido)'
					className='stroke-transparent stroke-2'>
					<LabelList
						position='outside'
						dataKey='Atingido'
						className='fill-foreground capitalize mix-blend-luminosity font-semibold pt-5'
						fontSize={11}
						offset={12}
						formatter={(val: number) =>
							val.toLocaleString('pt-BR', {
								style: 'currency',
								currency: 'brl',
							})
						}
					/>
				</RadialBar>
			</RadialBarChart>
		</ChartContainer>
	);
}
