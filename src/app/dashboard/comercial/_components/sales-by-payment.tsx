/** @format */

'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { use } from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SalesByPayment({ data }: { data: Promise<any> }) {
	const allData = use(data);
	const isMobile = useIsMobile();
	const isTablet = useIsTablet();

	if (!allData.ok) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance xl:text-xl'>
						Sem dados encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const chartData: any[] | undefined = [];

	const chartConfig = {
		value: {
			label: 'Faturamento',
		},
		Dinheiro: {
			label: 'Dinheiro',
			color: 'hsl(var(--chart-1))',
		},
		Cartão: {
			label: 'Cartão',
			color: 'hsl(var(--chart-2))',
		},
		PIX: {
			label: 'PIX',
			color: 'hsl(var(--chart-3))',
		},
		Crediário: {
			label: 'Computadores',
			color: 'hsl(var(--chart-4))',
		},
		Múltiplos: {
			label: 'Múltiplos Meios',
			color: 'hsl(var(--chart-5))',
		},
		DepósitoBancário: {
			label: 'Depósito Bancário',
			color: 'hsl(var(--chart-6))',
		},
	} satisfies ChartConfig;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	allData.data.SalesByPayment?.map((item: any) => {
		return chartData.push({
			name: item.method,
			value: Number(item.revenue) ?? 0,
			fill: `var(--color-${item.method.replace(' ', '')})`,
		});
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance xl:text-xl'>
					Faturamento por Pagamento
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square w-full max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout='vertical'
						margin={{
							right: 60,
							left: -40,
						}}>
						<XAxis
							type='number'
							dataKey='value'
							hide
						/>
						<YAxis
							style={{ lineHeight: '40px' }}
							width={148}
							fontSize={10}
							dataKey='name'
							type='category'
							tickLine={false}
							tickMargin={isMobile ? 8 : 12}
							axisLine={false}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<Bar
							fill='var(--color-desktop)'
							radius={5}
							dataKey='value'>
							<LabelList
								dataKey='value'
								position='right'
								fontWeight={600}
								offset={8}
								className='fill-foreground'
								formatter={(value: number) =>
									`${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' })}`
								}
								fontSize={isTablet ? 10 : 11}
							/>
						</Bar>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
