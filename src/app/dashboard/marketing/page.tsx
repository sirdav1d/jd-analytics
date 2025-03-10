/** @format */

import { Suspense } from 'react';
import { Marketing } from './_components/marketing';
import PageSkeleton from './_components/page-skeleton';

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
	return (
		<Suspense fallback={<PageSkeleton />}>
			<Marketing
				channel={channelFilter}
				endDate={endDate}
				startDate={startDate}
			/>
		</Suspense>
	);
}
