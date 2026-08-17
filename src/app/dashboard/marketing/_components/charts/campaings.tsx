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
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
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
	const isMobile = useIsMobile();
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
			className='h-[800px] min-w-0 w-full overflow-hidden md:h-72'
			style={{
				height: isMobile
					? getMobileCategoricalChartHeight(chartData.length)
					: undefined,
			}}>
			<BarChart
				accessibilityLayer
				margin={{
					top: isMobile ? 16 : 28,
					left: isMobile ? 4 : 0,
					right: isMobile ? 16 : 0,
					bottom: isMobile ? 8 : 0,
				}}
				layout={`${isMobile ? 'vertical' : 'horizontal'}`}
				data={chartData}>
				<CartesianGrid vertical={false} />
				{isMobile ? (
					<YAxis
						width={104}
						type='category'
						orientation='left'
						dataKey='name'
						tickLine={false}
						axisLine={false}
						tickMargin={4}
						fontSize={12}
						tick={<ResponsiveChartTick axis='y' labelWidth={96} />}
					/>
				) : (
					<XAxis
						dataKey='name'
						height={44}
						tickMargin={4}
						tickLine={false}
						axisLine={false}
						hide={isTablet}
						fontSize={12}
						tick={
							<ResponsiveChartTick
								axis='x'
								labelWidth={120}
								offset={4}
							/>
						}
					/>
				)}

				{isMobile ? (
					<XAxis
						scale={'sqrt'}
						dataKey={'impressions'}
						type='number'
						hide
					/>
				) : (
					<YAxis
						scale={'sqrt'}
						hide
					/>
				)}

				<ChartLegend
					content={
						<ChartLegendContent className='mx-auto max-w-full flex-wrap md:text-sm md:translate-x-0' />
					}
				/>
				<Bar
					radius={4}
					layout={`${isMobile ? 'vertical' : 'horizontal'}`}
					dataKey='impressions'
					fill='var(--color-impressions)'
					name='Impressões'>
					<LabelList
						position={`${isMobile ? 'right' : 'top'}`}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						formatter={(value: any) => value.toLocaleString('pt-BR')}
						offset={8}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					layout={`${isMobile ? 'vertical' : 'horizontal'}`}
					radius={4}
					dataKey='clicks'
					fill='var(--color-clicks)'
					name='Cliques'>
					<LabelList
						position={`${isMobile ? 'right' : 'top'}`}
						offset={8}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						formatter={(value: any) => value.toLocaleString('pt-BR')}
						className='fill-foreground'
						fontSize={12}
					/>
				</Bar>
				<Bar
					layout={`${isMobile ? 'vertical' : 'horizontal'}`}
					radius={4}
					dataKey='conversions'
					fill='var(--color-conversions)'
					name='Conversões'>
					<LabelList
						position={`${isMobile ? 'right' : 'top'}`}
						offset={8}
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
