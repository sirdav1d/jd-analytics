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
	Organic: ConversionsComponentProps;
	Paid: ConversionsComponentProps;
	Direct: ConversionsComponentProps;
	Social: ConversionsComponentProps;
	Other: ConversionsComponentProps;
}

export function ConversionsComponent({
	Organic,
	Direct,
	Other,
	Paid,
	Social,
}: DataConversionsComponentProps) {
	const chartData = [
		{
			name: 'Orgânico',
			conversions: Organic.conversions,
			sessions: Organic.sessions,
		},
		{
			name: 'Pago',
			conversions: Paid.conversions,
			sessions: Paid.sessions,
		},
		{
			name: 'Busca Direta',
			conversions: Direct.conversions,
			sessions: Direct.sessions,
		},
		{
			name: 'Social',
			conversions: Social.conversions,
			sessions: Social.sessions,
		},
		{
			name: 'Outros',
			conversions: Other.conversions,
			sessions: Other.sessions,
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
