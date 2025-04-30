/** @format */

import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import PageSkeleton from './_components/page-skeleton';
// import SectionAds from './_components/section-ads';
// import SectionAnalytics from './_components/section-analytics';
import TopAnuncios from './_components/tables/top-anuncios';
// import TopAdwords from './_components/tables/top-adwords';

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
	// const channelFilter = searchParams.channel || 'all';
	const campaignId = searchParams.campaignId || 'all';

	return (
		<div className='w-full mx-auto space-y-5 pb-5 h-full'>
			<div className='relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black' />

			<Suspense fallback={<PageSkeleton />}>
				{/* <SectionAnalytics
					startDate={startDate}
					endDate={endDate}
					channel={channelFilter}
				/> */}
			</Suspense>
			<Separator className='my-40 w-full' />
			{/* <Suspense fallback={<p>carregando section ads</p>}>
				<SectionAds
					startDate={startDate}
					endDate={endDate}
					campaignId={campaignId}
				/>
			</Suspense> */}
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
				<Suspense fallback={<p>carregando top ads...</p>}>
					<TopAnuncios
						startDate={startDate}
						endDate={endDate}
						campaignId={campaignId}
					/>
				</Suspense>
				{/* <Suspense fallback={<p>carregando top keywords</p>}>
					<TopAdwords
						startDate={startDate}
						endDate={endDate}
						campaignId={campaignId}
					/>
				</Suspense> */}
			</div>
		</div>
	);
}
