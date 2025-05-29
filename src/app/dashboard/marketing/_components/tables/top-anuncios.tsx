/** @format */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { use } from 'react';

interface MetricsProps {
	clicks: number;
	conversions: number;
	ctr: number;
	impressions: number;
}

interface ADGroupProps {
	resource_name: string;
	status: number;
	ad: ADProps;
}

interface ADProps {
	resource_name: string;
	id: number;
	name: string;
	responsive_search_ad: {
		headlines: HeadlinesProps[];
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	smart_campaign_ad: any;
}

interface HeadlinesProps {
	text: string;
	asset_performance_label: number;
}

interface AllProps {
	metrics: MetricsProps;
	ad_group_ad: ADGroupProps;
}

export default function TopAnuncios({
	data,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
}) {
	const allData = use(data);

	const topADS = allData.data as AllProps[];

	if (!allData.ok) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Dados não encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Top 5 Anúncios por Conversão
				</CardTitle>
			</CardHeader>
			<CardContent>
				{topADS.length == 0 ? (
					<p className='text-muted-foreground'>Nenhum dado encontrado</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='text-left'>Anúncio</TableHead>
								<TableHead className='text-center'>CTR</TableHead>
								<TableHead className='text-center'>Impressões</TableHead>
								<TableHead className='text-center'>Cliques</TableHead>
								<TableHead className='text-center'>Conversões</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{topADS.map((item, index) => {
								return (
									<TableRow
										key={index}
										className='text-nowrap text-center'>
										<TableCell className='text-nowrap flex items-center gap-2 text-xs'>
											{index == 0 ? (
												<Trophy
													size={16}
													className='text-amber-500'
												/>
											) : index == 1 ? (
												<Trophy
													size={16}
													className='text-zinc-400'
												/>
											) : index == 2 ? (
												<Trophy
													size={16}
													className='text-rose-700'
												/>
											) : (
												<></>
											)}
											{item.ad_group_ad.ad.responsive_search_ad
												? item.ad_group_ad.ad.responsive_search_ad.headlines[
														index
													].text
												: item.ad_group_ad.ad.name
													? item.ad_group_ad.ad.name
													: null}
										</TableCell>
										<TableCell>
											{item.metrics.ctr
												? item.metrics.ctr.toLocaleString('pt-BR', {
														style: 'percent',
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})
												: 0}
										</TableCell>
										<TableCell>
											{item.metrics.impressions
												? item.metrics.impressions.toLocaleString('pt-BR')
												: 0}
										</TableCell>
										<TableCell>
											{item.metrics.clicks
												? item.metrics.clicks.toLocaleString('pt-BR')
												: 0}
										</TableCell>
										<TableCell>
											{item.metrics.conversions
												? item.metrics.conversions.toLocaleString('pt-BR')
												: 0}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
