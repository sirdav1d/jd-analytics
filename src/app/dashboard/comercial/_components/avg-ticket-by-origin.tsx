/** @format */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import {
	getMobileCategoricalChartHeight,
	ResponsiveChartTick,
} from '@/components/ui/responsive-chart';
import { use } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';

const chartConfig = {
	avg_ticket: { label: 'Ticket Médio' },
	Google: {
		label: 'Google',
		color: 'hsl(var(--chart-1))',
	},
	Balcão: {
		label: 'Balcão',
		color: '#242424',
	},
	Comercial_Ativo: {
		label: 'Comercial Ativo',
		color: 'hsl(var(--chart-2))',
	},
	Desconhecido: {
		label: 'Desconhecido',
		color: 'hsl(var(--chart-4))',
	},
	Boa_Dica: {
		label: 'Boa Dica',
		color: 'hsl(var(--chart-6))',
	},
	Indicação: {
		label: 'Indicação',
		color: 'hsl(var(--chart-3))',
	},

	Meta: {
		label: 'Meta',
		color: 'hsl(var(--chart-5))',
	},
} satisfies ChartConfig;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AvgTicketByOrigin({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();

	if (!allData.ok) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Dados Não Encontrados</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	const chartData = allData.data.avgTicketByOrigin;

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance xl:text-xl'>
					Ticket médio por origem
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className='h-[600px] w-full md:h-72'
					style={{
						height: isMobile
							? getMobileCategoricalChartHeight(chartData.length)
							: undefined,
					}}>
					<BarChart
						margin={
							isMobile
								? { top: 16, left: 4, right: 16, bottom: 8 }
								: { top: 28, left: 4, right: 4 }
						}
						layout={`${isMobile ? 'vertical' : 'horizontal'}`}
						data={chartData}>
						<CartesianGrid vertical={false} />
						{isMobile ? (
							<YAxis
								width={104}
								dataKey='origin'
								type='category'
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tick={<ResponsiveChartTick axis='y' labelWidth={96} />}
							/>
						) : (
							<XAxis
								dataKey='origin'
								tickMargin={12}
								tickLine={false}
								axisLine={false}
							/>
						)}

						{isMobile ? (
							<XAxis
								dataKey='avg_ticket'
								tickLine={false}
								hide
								type='number'
								scale={'sqrt'}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.toLocaleString('pt-BR')}
							/>
						) : (
							<YAxis
								dataKey='avg_ticket'
								type='number'
								scale={'sqrt'}
								hide
								tickMargin={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => value.toLocaleString('pt-BR')}
							/>
						)}

						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator='dot' />}
						/>
						<Bar
							radius={4}
							layout={`${isMobile ? 'vertical' : 'horizontal'}`}
							dataKey='avg_ticket'>
							<LabelList
								position={`${isMobile ? 'right' : 'top'}`}
								offset={8}
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								formatter={(val: any) =>
									val.toLocaleString('pt-BR', {
										style: 'currency',
										currency: 'brl',
									})
								}
								className='fill-foreground'
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
