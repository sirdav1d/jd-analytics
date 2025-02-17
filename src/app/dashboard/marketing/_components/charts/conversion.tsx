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
	name: string;
	conversions: number;
	sessions: number;
}

interface DataConversionsComponentProps {
	data: ConversionsComponentProps[];
}
export function ConversionsComponent({ data }: DataConversionsComponentProps) {
	const chartData = data.map((item) => {
		switch (item.name) {
			case 'Organic Search':
				return {
					name: 'Tráfego Orgânico',
					conversions: item.conversions,
					sessions: item.sessions,
				};
			case 'Direct':
				return {
					name: 'Busca Direta',
					conversions: item.conversions,
					sessions: item.sessions,
				};
			case 'Paid Search':
				return {
					name: 'Tráfego Pago',
					conversions: item.conversions,
					sessions: item.sessions,
				};
			case 'Social':
				return {
					name: 'Redes Sociais',
					conversions: item.conversions,
					sessions: item.sessions,
				};
			default:
				return {
					name: 'Outros',
					conversions: item.conversions,
					sessions: item.sessions,
				};
		}
	});

	return (
		<ChartContainer
			config={chartConfig}
			className='h-72 w-full'>
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
