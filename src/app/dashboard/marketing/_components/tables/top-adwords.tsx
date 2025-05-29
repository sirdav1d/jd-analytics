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
	keyword: { text: string };
}

interface TopAdwordsProps {
	metrics: MetricsProps;
	ad_group_criterion: ADGroupProps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TopAdwords({ data }: { data: Promise<any> }) {
	const allData = use(data);

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
	const topKeywords: TopAdwordsProps[] = allData.data;

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Top 5 Palavras-Chave por Conversão
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-nowrap'>Palavra-Chave</TableHead>
							<TableHead className='text-center'>CTR</TableHead>
							<TableHead className='text-center'>Impressões</TableHead>
							<TableHead className='text-center'>Cliques</TableHead>
							<TableHead className='text-center'>Conversões</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{topKeywords.map((item, index) => {
							return (
								<TableRow
									key={index}
									className='text-center'>
									<TableCell className='text-nowrap text-xs text-left flex items-center gap-2'>
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
										{item.ad_group_criterion.keyword.text}
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
									<TableCell className='text-center'>
										{item.metrics.impressions
											? item.metrics.impressions.toLocaleString('pt-BR')
											: 0}
									</TableCell>
									<TableCell className='text-nowrap'>
										{item.metrics.clicks
											? item.metrics.clicks.toLocaleString('pt-BR')
											: 0}
									</TableCell>
									<TableCell className='text-nowrap'>
										{item.metrics.conversions
											? item.metrics.conversions.toLocaleString('pt-BR')
											: 0}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
