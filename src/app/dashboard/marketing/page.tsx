/** @format */

import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import PageSkeleton from './_components/page-skeleton';
// import SectionAds from './_components/section-ads';
import SectionAnalytics from './_components/section-analytics';

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
	const channelFilter = searchParams.channel || 'all';
	// const campaignId = searchParams.campaignId || 'all';

	return (
		<div className='w-full mx-auto space-y-5 pb-5 h-full'>
			<Suspense fallback={<PageSkeleton />}>
				<SectionAnalytics
					startDate={startDate}
					endDate={endDate}
					channel={channelFilter}
				/>
				<Separator className='my-40 w-full' />
				{/* <SectionAds
					startDate={startDate}
					endDate={endDate}
					campaignId={campaignId}
				/> */}
			</Suspense>
		</div>
	);
}
