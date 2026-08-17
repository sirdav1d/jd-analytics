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
import {
	getMobileCategoricalChartHeight,
	ResponsiveChartTick,
} from '@/components/ui/responsive-chart';
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
			conversions: Organico?.conversions ?? 0,
			sessions: Organico?.sessions ?? 0,
		},
		{
			name: 'Pesquisa Paga',
			conversions: Pago?.conversions ?? 0,
			sessions: Pago?.sessions ?? 0,
		},
		{
			name: 'Navegação Direta',
			conversions: Direto?.conversions ?? 0,
			sessions: Direto?.sessions ?? 0,
		},
		{
			name: 'Social',
			conversions: Social?.conversions ?? 0,
			sessions: Social?.sessions ?? 0,
		},
		{
			name: 'Backlink',
			conversions: referral?.conversions ?? 0,
			sessions: referral?.sessions ?? 0,
		},
		{
			name: 'Discover',
			conversions: crossNetwork?.conversions ?? 0,
			sessions: crossNetwork?.sessions ?? 0,
		},
		{
			name: 'Shopping',
			conversions: shopping?.conversions ?? 0,
			sessions: shopping?.sessions ?? 0,
		},
		{
			name: 'Youtube',
			conversions: video?.conversions ?? 0,
			sessions: video?.sessions ?? 0,
		},
		{
			name: 'Desconhecido',
			conversions: nAtribuido?.conversions ?? 0,
			sessions: nAtribuido?.sessions ?? 0,
		},
	];

	const isMobile = useIsMobile();

	return (
		<ChartContainer
			config={chartConfig}
			className='h-[640px] min-w-0 w-full overflow-hidden md:h-72'
			style={{
				height: isMobile
					? getMobileCategoricalChartHeight(chartData.length)
					: undefined,
			}}>
			<BarChart
				layout={`${isMobile ? 'vertical' : 'horizontal'}`}
				margin={{
					top: isMobile ? 16 : 28,
					left: isMobile ? 4 : 4,
					right: isMobile ? 16 : 4,
					bottom: isMobile ? 8 : 0,
				}}
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
				<ChartLegend content={<ChartLegendContent className='max-w-full flex-wrap md:text-sm' />} />
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
