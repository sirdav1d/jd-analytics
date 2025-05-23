/** @format */

'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

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

	const isMobile = useIsMobile();

	return (
		<ChartContainer
			config={chartConfig}
			className='h-[640px] md:h-72 w-full'>
			<BarChart
				layout={`${isMobile ? 'vertical' : 'horizontal'}`}
				margin={{
					top: isMobile ? 0 : 28,
					left: isMobile ? -22 : 4,
					right: isMobile ? 52 : 4,
				}}
				data={chartData}>
				<CartesianGrid vertical={false} />
				{isMobile ? (
					<YAxis
						width={152}
						dataKey='name'
						type='category'
						tickLine={false}
						tickMargin={10}
						axisLine={false}
						tickFormatter={(value) => value.slice(0, 20)}
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
						dataKey='conversions'
						tickLine={false}
						hide
						type='number'
						scale={'sqrt'}
						tickMargin={10}
						axisLine={false}
					/>
				) : (
					<YAxis
						dataKey='conversions'
						type='number'
						scale={'sqrt'}
						hide
						tickMargin={12}
						tickLine={false}
						axisLine={false}
					/>
				)}
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator='dot' />}
				/>
				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
				<Bar
					radius={4}
					layout={`${isMobile ? 'vertical' : 'horizontal'}`}
					dataKey='conversions'
					fill='var(--color-conversions)'>
					<LabelList
						position={`${isMobile ? 'right' : 'top'}`}
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					radius={4}
					layout={`${isMobile ? 'vertical' : 'horizontal'}`}
					dataKey='sessions'
					fill='var(--color-sessions)'>
					<LabelList
						position={`${isMobile ? 'right' : 'top'}`}
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
