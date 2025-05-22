/** @format */

'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
	conversions: {
		label: 'Conversões',
		color: 'hsl(var(--chart-1))',
	},
	sessions: {
		label: 'Sessões',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig;

interface ConversionsComponentProps {
	conversions: number;
	sessions: number;
}

interface DataConversionsComponentProps {
	Organico: ConversionsComponentProps;
	Pago: ConversionsComponentProps;
	Social: ConversionsComponentProps;
	Direto: ConversionsComponentProps;
	nAtribuido: ConversionsComponentProps;
	crossNetwork: ConversionsComponentProps;
	shopping: ConversionsComponentProps;
	video: ConversionsComponentProps;
	referral: ConversionsComponentProps;
}

export function ConversionsComponent({
	Organico,
	Direto,
	Pago,
	referral,
	crossNetwork,
	shopping,
	video,
	Social,
	nAtribuido,
}: DataConversionsComponentProps) {
	const chartData = [
		{
			name: 'Pesquisa Orgânica',
			conversions: Organico.conversions,
			sessions: Organico.sessions,
		},
		{
			name: 'Pesquisa Paga',
			conversions: Pago.conversions,
			sessions: Pago.sessions,
		},
		{
			name: 'Navegação Direta',
			conversions: Direto.conversions,
			sessions: Direto.sessions,
		},
		{
			name: 'Social',
			conversions: Social.conversions,
			sessions: Social.sessions,
		},
		{
			name: 'Backlink',
			conversions: referral.conversions,
			sessions: referral.sessions,
		},
		{
			name: 'Discover',
			conversions: crossNetwork.conversions,
			sessions: crossNetwork.sessions,
		},
		{
			name: 'Shopping',
			conversions: shopping.conversions,
			sessions: shopping.sessions,
		},
		{
			name: 'Youtube',
			conversions: video.conversions,
			sessions: video.sessions,
		},
		{
			name: 'Desconhecido',
			conversions: nAtribuido.conversions,
			sessions: nAtribuido.sessions,
		},
	];

	return (
		<ChartContainer
			config={chartConfig}
			className='h-80 md:h-72 w-full'>
			<BarChart
				margin={{
					top: 28,
				}}
				data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='name'
					tickMargin={12}
					tickLine={false}
					axisLine={false}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
				<Bar
					radius={4}
					yAxisId='right'
					dataKey='conversions'
					fill='var(--color-conversions)'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					radius={4}
					yAxisId='right'
					dataKey='sessions'
					fill='var(--color-sessions)'>
					<LabelList
						position='top'
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
