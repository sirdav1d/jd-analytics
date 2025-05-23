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
import { useIsTablet } from '@/hooks/use-mobile';
import { getTop5CampaignsByConversions } from '@/utils/get-top-campaigns';

interface MetricsProps {
	clicks: number;
	conversions: number;
	impressions: number;
}

interface CampaignProps {
	resource_name: string;
	status: number;
	name: string;
	id: number;
}

export interface CampagnComponentProps {
	campaign: CampaignProps;
	metrics: MetricsProps;
}

interface DataProps {
	data: CampagnComponentProps[];
}

const chartConfig = {
	impressions: {
		label: 'Impressões',
		color: 'hsl(var(--chart-1))',
	},
	clicks: {
		label: 'Cliques',
		color: 'hsl(var(--chart-2))',
	},
	conversions: {
		label: 'Conversões',
		color: 'hsl(var(--chart-3))',
	},
} satisfies ChartConfig;

export function CampagnComponent({ data }: DataProps) {
	const isTablet = useIsTablet();
	const formattedData = getTop5CampaignsByConversions(data);
	const chartData = formattedData.map((data) => {
		return {
			name: data.campaign.name,
			impressions: data.metrics.impressions,
			clicks: data.metrics.clicks,
			conversions: data.metrics.conversions,
		};
	});

	return (
		<ChartContainer
			config={chartConfig}
			className='w-full h-72'>
			<BarChart
				accessibilityLayer
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
					hide={isTablet}
					fontSize={12}
					tickFormatter={(value: string) => value.slice(0, 18) + '...'}
				/>
				<YAxis
					scale={'sqrt'}
					hide
				/>
				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
				<Bar
					radius={4}
					dataKey='impressions'
					fill='var(--color-impressions)'
					name='Impressões'>
					<LabelList
						position='top'
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						formatter={(value: any) => value.toLocaleString('pt-BR')}
						offset={12}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					radius={4}
					dataKey='clicks'
					fill='var(--color-clicks)'
					name='Cliques'>
					<LabelList
						position='top'
						offset={12}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						formatter={(value: any) => value.toLocaleString('pt-BR')}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					radius={4}
					dataKey='conversions'
					fill='var(--color-conversions)'
					name='Conversões'>
					<LabelList
						position='top'
						offset={12}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						formatter={(value: any) => value.toLocaleString('pt-BR')}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<ChartTooltip
					cursor={false}
					defaultIndex={1}
					content={
						<ChartTooltipContent
							className='w-[200px]'
							indicator='dot'
						/>
					}
				/>
			</BarChart>
		</ChartContainer>
	);
}
