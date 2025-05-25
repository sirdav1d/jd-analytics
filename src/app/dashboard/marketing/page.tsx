/** @format */

import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import SectionAds from './_components/section-ads';
import SectionAnalytics from './_components/section-analytics';
import TopAnuncios from './_components/tables/top-anuncios';
import { Skeleton } from '@/components/ui/skeleton';
import TopAdwords from './_components/tables/top-adwords';
import { FetchAnalyticsData } from '@/services/google-services/get-analytics-data';
import { FetchTopADSData } from '@/services/google-services/get-top-ads';
import { FetchKeywordADSData } from '@/services/google-services/get-top-keywords';
import { FetchADSData } from '@/services/google-services/get-ads-data';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MarketingPage(props: {
	searchParams: SearchParams;
}) {
	function formattedEndDate() {
		const date = new Date();
		const endDate = date.toISOString().split('T')[0];
		return endDate;
	}

	function formattedStartDate() {
		const date = new Date();
		date.setDate(date.getDate() - 7);
		const startDate = date.toISOString().split('T')[0];
		return startDate;
	}
	const searchParams = await props.searchParams;
	const startDate = searchParams.startDate || formattedStartDate();
	const endDate = searchParams.endDate || formattedEndDate();

	const responseAnalytics = FetchAnalyticsData(
		String(startDate),
		String(endDate),
	);

	const dataAds = FetchTopADSData(String(startDate), String(endDate));

	const dataKeyWords = FetchKeywordADSData(String(startDate), String(endDate));
	const dataMainADS = FetchADSData(String(startDate), String(endDate));

	return (
		<div className='w-full mx-auto h-full pb-5'>
			<Suspense
				fallback={
					<div className='flex w-full flex-col gap-5'>
						<div className='flex flex-col lg:flex-row gap-5'>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
						</div>
						<div className='h-full w-full flex flex-col lg:flex-row gap-5'>
							<Skeleton className='h-80 w-full' />
							<Skeleton className='h-80 w-full' />
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
						</div>
					</div>
				}>
				<SectionAnalytics data={responseAnalytics} />
			</Suspense>
			<Separator className='w-full mt-10' />
			<Suspense
				fallback={
					<div className='flex flex-col gap-5 mt-10 mb-5'>
						<div className='flex flex-col lg:flex-row gap-5'>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
							<Skeleton className='h-12 w-full md:w-[240px]'></Skeleton>
						</div>
						<Skeleton className='h-80 w-full'></Skeleton>
						<div className='h-full w-full flex flex-col lg:flex-row gap-5'>
							<Skeleton className='h-80 w-full'></Skeleton>
							<Skeleton className='h-80 w-full'></Skeleton>
						</div>
						<div className='h-full w-full flex flex-col lg:flex-row gap-5'>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
							<Skeleton className='h-28 w-full'></Skeleton>
						</div>
					</div>
				}>
				<SectionAds data={dataMainADS} />
			</Suspense>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
				<Suspense fallback={<Skeleton className='h-80 w-full'></Skeleton>}>
					<TopAnuncios data={dataAds} />
				</Suspense>
				<Suspense fallback={<Skeleton className='h-80 w-full'></Skeleton>}>
					<TopAdwords data={dataKeyWords} />
				</Suspense>
			</div>
		</div>
	);
}
