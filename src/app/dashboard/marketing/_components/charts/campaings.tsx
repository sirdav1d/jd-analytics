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
			className='w-full h-[800px] md:h-72'>
			<BarChart
				accessibilityLayer
				margin={{
					top: 28,
					left: isMobile ? -44 : 0,
					right: isMobile ? 60 : 0,
				}}
				layout={`${isMobile ? 'vertical' : 'horizontal'}`}
				data={chartData}>
				<CartesianGrid vertical={false} />
				{isMobile ? (
					<YAxis
						width={140}
						type='category'
						orientation='left'
						dataKey='name'
						tickLine={false}
						axisLine={false}
						tickMargin={4}
						fontSize={12}
						tickFormatter={(value: string) => value.slice(0, 10) + '...'}
					/>
				) : (
					<XAxis
						dataKey='name'
						tickMargin={12}
						tickLine={false}
						axisLine={false}
						hide={isTablet}
						fontSize={12}
						tickFormatter={(value: string) => value.slice(0, 18) + '...'}
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

				<ChartLegend content={<ChartLegendContent className='md:text-sm' />} />
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
