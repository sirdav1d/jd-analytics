/** @format */

'use client';

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import {
	getMobileCategoricalChartHeight,
	ResponsiveChartTick,
} from '@/components/ui/responsive-chart';
import { useIsMobile } from '@/hooks/use-mobile';
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';

const chartConfig = {
	Organico: {
		label: 'Busca Orgânico',
		color: 'hsl(var(--chart-1))',
	},
	Pago: {
		label: 'Busca Paga',
		color: 'hsl(var(--chart-2))',
	},
	Social: {
		label: 'Redes Sociais',
		color: 'hsl(var(--chart-4))',
	},
	Direta: {
		label: 'Navegação Direta',
		color: 'hsl(var(--chart-3))',
	},

	Discover: {
		label: 'Discover',
		color: 'hsl(var(--chart-5))',
	},
	Youtube: {
		label: 'Youtube',
		color: 'hsl(var(--chart-6))',
	},
	Link: {
		label: 'Link de Referência',
		color: 'hsl(var(--chart-7))',
	},
	Shopping: {
		label: 'Shopping',
		color: 'hsl(var(--chart-8))',
	},
	Deconhecido: {
		label: 'Deconhecido',
		color: 'hsl(var(--chart-9))',
	},
} satisfies ChartConfig;

interface TrafficComponentProps {
	Organico: number;
	Pago: number;
	Social: number;
	Direto: number;
	nAtribuido: number;
	crossNetwork: number;
	shopping: number;
	video: number;
	referral: number;
}

export function TrafficComponent({
	Direto,
	Organico,
	Pago,
	Social,
	crossNetwork,
	nAtribuido,
	referral,
	shopping,
	video,
}: TrafficComponentProps) {
	const chartData = [
		{
			name: 'Discover',
			usuarios: crossNetwork ?? 0,
			fill: 'var(--color-Discover)',
		},
		{ name: 'Perquisa Paga', usuarios: Pago ?? 0, fill: 'var(--color-Pago)' },
		{
			name: 'Perquisa Orgânica',
			usuarios: Organico ?? 0,
			fill: 'var(--color-Organico)',
		},
		{ name: 'Backlink', usuarios: referral ?? 0, fill: 'var(--color-Link)' },
		{
			name: 'Navegação Direta',
			usuarios: Direto ?? 0,
			fill: 'var(--color-Direta)',
		},
		{ name: 'Social', usuarios: Social ?? 0, fill: 'var(--color-Social)' },
		{
			name: 'Shopping',
			usuarios: shopping ?? 0,
			fill: 'var(--color-Shopping)',
		},
		{ name: 'Youtube', usuarios: video ?? 0, fill: 'var(--color-Youtube)' },
		{
			name: 'Deconhecido',
			usuarios: nAtribuido ?? 0,
			fill: 'var(--color-Deconhecido)',
		},
	];

	const isMobile = useIsMobile();

	return (
		<ChartContainer
			config={chartConfig}
			className='h-[600px] min-w-0 w-full overflow-hidden md:h-72'
			style={{
				height: isMobile
					? getMobileCategoricalChartHeight(chartData.length)
					: undefined,
			}}>
			<BarChart
				margin={{
					top: isMobile ? 16 : 28,
					left: isMobile ? 4 : 4,
					right: isMobile ? 16 : 4,
					bottom: isMobile ? 8 : 0,
				}}
				layout={`${isMobile ? 'vertical' : 'horizontal'}`}
				data={chartData}>
				<CartesianGrid vertical={false} />
				{isMobile ? (
					<YAxis
						width={104}
						dataKey='name'
						type='category'
						tickLine={false}
						tickMargin={10}
						axisLine={false}
						tick={<ResponsiveChartTick axis='y' labelWidth={96} />}
					/>
				) : (
					<XAxis
						dataKey='name'
						tickMargin={12}
						tickLine={false}
						axisLine={false}
					/>
				)}

				{isMobile ? (
					<XAxis
						dataKey='usuarios'
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
						dataKey='usuarios'
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
					dataKey='usuarios'>
					<LabelList
						position={`${isMobile ? 'right' : 'top'}`}
						offset={8}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
