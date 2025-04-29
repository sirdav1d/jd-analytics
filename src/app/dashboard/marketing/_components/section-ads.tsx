/** @format */

'use client';

import { useQuery } from '@tanstack/react-query';
import ads from '@/assets/ads.svg';
import GoogleLoginButton from '@/components/google-login-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { CampagnComponent } from './charts/campaings';
import { CostsComponent } from './charts/cost';
import { PerformanceComponent } from './charts/performance';
import ListStaticADS from './list-static-ads';
import FilterAds from '@/app/dashboard/marketing/_components/filter-ads';
import { FetchADSData } from '@/services/google-services/get-ads-data';
import TopAdwords from './tables/top-adwords';
import TopAnuncios from './tables/top-anuncios';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionADSProps {
	startDate: string | string[];
	endDate: string | string[];
	campaignId: string | string[];
}

export default function SectionAds({
	endDate,
	campaignId,
	startDate,
}: SectionADSProps) {
	const { data, error, isLoading } = useQuery({
		queryKey: ['adsData', startDate, endDate, campaignId],
		queryFn: async () =>
			FetchADSData(String(startDate), String(endDate), String(campaignId)),
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5, // 5 minutos
	});

	if (error) {
		console.log(error, data);
		return (
			<div className='w-full mx-auto space-y-4 pb-5'>
				<GoogleLoginButton />
			</div>
		);
	}

	if (isLoading) {
		return (
			<>
				<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
					<Skeleton className='w-full  h-32'></Skeleton>
				</div>
				<div className='flex gap-5'>
					<Skeleton className='w-full  h-80'></Skeleton>
					<Skeleton className='w-full  h-80'></Skeleton>
				</div>
			</>
		);
	}

	const topAds = data.data[2];
	const topKeyWords = data.data[3];
	const campaigns = data.data[0];
	const AccountMetrics = data.data[1];
	return (
		<div className='grid gap-5 '>
			<div className='w-full flex items-center justify-center md:justify-start flex-wrap gap-5 mt-10 flex-col-reverse md:flex-row'>
				<FilterAds data={campaigns} />
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
								impressions={AccountMetrics.impressions}
								clicks={AccountMetrics.clicks}
								cost_micros={AccountMetrics.cost_micros}
								conversions={AccountMetrics.conversions}
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
								impressions={AccountMetrics.impressions}
								clicks={AccountMetrics.clicks}
								cost_micros={AccountMetrics.cost_micros}
								conversions={AccountMetrics.conversions}
							/>
						</CardContent>
					</Card>
				</div>
			</div>
			<ListStaticADS
				clicks={AccountMetrics.clicks}
				cost_micros={AccountMetrics.cost_micros}
				ctr={AccountMetrics.ctr}
				impressions={AccountMetrics.impressions}
			/>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
				<TopAnuncios data={topAds} />
				<TopAdwords data={topKeyWords} />
			</div>
		</div>
	);
}
