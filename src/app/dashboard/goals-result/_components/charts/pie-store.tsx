/** @format */

'use client';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
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
	const percent = (atingido / companySummary.meta) * 100;
	const chartData = [
		{ Atingido: atingido, Restante: restante < 0 ? 0 : restante },
	];

	const isMobile = useIsMobile();

	return (
		<ChartContainer
			config={chartConfig}
			className='mx-auto aspect-square w-full h-full md:max-h-[288px] [&_.recharts-pie-label-text]:fill-foreground'>
			<RadialBarChart
				className='translate-y-10'
				accessibilityLayer
				data={chartData}
				endAngle={180}
				margin={{ top: 10 }}
				innerRadius={128}
				outerRadius={200}>
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
										className='-translate-y-6'
										textAnchor='middle'>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) - 16}
											className='fill-foreground text-2xl font-bold'>
											{percent.toFixed(2)}%
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 4}
											className='fill-muted-foreground text-xs text-center '>
											Faturamento Atingido
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
						className='fill-foreground drop-shadow capitalize font-semibold mix-blend-luminosity -translate-x-14 translate-y-3 xl:translate-y-2  bg-background z-50'
						fontSize={isMobile ? 12 : 14}
						formatter={(val: number) =>
							val.toLocaleString('pt-BR', {
								style: 'currency',
								currency: 'brl',
								notation: 'compact',
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
						className='fill-foreground drop-shadow capitalize font-semibold mix-blend-luminosity translate-x-12 xl:translate-x-4 translate-y-3 xl:translate-y-2'
						fontSize={isMobile ? 12 : 14}
						formatter={(val: number) =>
							val.toLocaleString('pt-BR', {
								style: 'currency',
								currency: 'brl',
								notation: 'compact',
							})
						}
					/>
				</RadialBar>
			</RadialBarChart>
		</ChartContainer>
	);
}
