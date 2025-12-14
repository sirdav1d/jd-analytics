/** @format */

import { Skeleton } from '@/components/ui/skeleton';
import { FetchGoalsCurrentData } from '@/services/data-services/get-goals-current';
import { FetchADSData } from '@/services/google-services/get-ads-data';
import { FetchTopADSData } from '@/services/google-services/get-top-ads';
import { FetchKeywordADSData } from '@/services/google-services/get-top-keywords';
import { getDefaultDateRange } from '@/utils/date-range';
import { Suspense } from 'react';
import GoalsHomeProgress from '../_components/goals-home-progress';
import SectionAds from '../marketing/_components/section-ads';
import TopAdwords from '../marketing/_components/tables/top-adwords';
import TopAnuncios from '../marketing/_components/tables/top-anuncios';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MarketingServs(props: {
	searchParams: SearchParams;
}) {
	const { from, to } = getDefaultDateRange();
	const formattedStartDate = from.toISOString().split('T')[0];
	const formattedEndDate = to.toISOString().split('T')[0];
	const searchParams = await props.searchParams;
	const startDate = searchParams.startDate || formattedStartDate;
	const endDate = searchParams.endDate || formattedEndDate;

	const dataAds = FetchTopADSData(
		String(startDate),
		String(endDate),
		'services',
	);
	const dataKeyWords = FetchKeywordADSData(
		String(startDate),
		String(endDate),
		'services',
	);
	const dataMainADS = FetchADSData(
		String(startDate),
		String(endDate),
		'services',
	);

	const goalsCurrent = FetchGoalsCurrentData('services');

	return (
		<div className='w-full grid mx-auto h-full pb-5'>
			<Suspense fallback={<Skeleton className='h-6 w-full' />}>
				<GoalsHomeProgress
					canShowComercial={false}
					canShowMarketing={true}
					data={goalsCurrent}
				/>
			</Suspense>

			<Suspense
				fallback={
					<div className='grid gap-5 mt-10 mb-5'>
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
