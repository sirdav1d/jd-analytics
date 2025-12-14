/** @format */
'use client';
import ads from '@/assets/ads.svg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { use } from 'react';
import { CampagnComponent } from './charts/campaings';
import { CostsComponent } from './charts/cost';
import { PerformanceComponent } from './charts/performance';
import FilterAds from './filter-ads';
import ListStaticADS from './list-static-ads';
import { Separator } from '@/components/ui/separator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SectionAds({ data }: { data: Promise<any> }) {
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

	const campaigns = allData.data.topCampaigns ?? [];
	const AccountMetrics = allData.data.dataADS;

	return (
		<div className='grid gap-5 pb-5'>
			<div className='w-full flex flex-col  gap-5 mt-5 '>
				<FilterAds data={campaigns} />
				<Separator />
				<div className='flex items-center gap-2 scale-110 md:scale-100'>
					<Image
						src={ads}
						alt='Logo Google Analytics'
						height={24}
						width={24}
					/>
					<h2 className='font-semibold text-sm'>Google ADS</h2>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-5 w-full'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Top 5 Campanhas por Conversão
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CampagnComponent data={campaigns} />
					</CardContent>
				</Card>

				<div className='grid grid-cols-1 2xl:grid-cols-2 gap-5 w-full'>
					<Card className='w-full'>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Desempenho Geral
							</CardTitle>
						</CardHeader>
						<CardContent>
							<PerformanceComponent
								impressions={AccountMetrics.impressions.current}
								clicks={AccountMetrics.clicks.current}
								cost_micros={AccountMetrics.cost_micros.current}
								conversions={AccountMetrics.conversions.current}
							/>
						</CardContent>
					</Card>
					<Card className='w-full'>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Custos por Desempenho
							</CardTitle>
						</CardHeader>
						<CardContent>
							<CostsComponent
								impressions={AccountMetrics.impressions.current}
								clicks={AccountMetrics.clicks.current}
								cost_micros={AccountMetrics.cost_micros.current}
								conversions={AccountMetrics.conversions.current}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
			<ListStaticADS
				roas={allData.data.roas}
				clicks={AccountMetrics.clicks}
				cost_micros={AccountMetrics.cost_micros}
				ctr={AccountMetrics.ctr}
				impressions={AccountMetrics.impressions}
			/>
		</div>
	);
}
