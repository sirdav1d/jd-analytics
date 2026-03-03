/** @format */

import { ModeToggle } from '@/components/ui/mode-toggle';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MarketingReportPublicContent from './_components/marketing-report-public-content';
import MarketingReportPublicSkeleton from './_components/marketing-report-public-skeleton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicMarketingReportPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		date?: string | string[];
		period?: string | string[];
	}>;
}) {
	const { id } = await params;
	const query = await searchParams;

	const rawDate = Array.isArray(query.date) ? query.date[0] : query.date;
	const rawPeriod = Array.isArray(query.period)
		? query.period[0]
		: query.period;
	const period =
		rawPeriod === 'current-month' || rawPeriod === 'last-month'
			? rawPeriod
			: undefined;

	if (id !== 'current') {
		notFound();
	}

	return (
		<main className='min-h-screen w-full bg-background flex items-center justify-center'>
			<div className='absolute top-5 right-5 z-40'>
				<ModeToggle />
			</div>
			<div className='container mx-auto max-w-2xl px-4 py-10 space-y-5'>
				<Suspense fallback={<MarketingReportPublicSkeleton />}>
					<MarketingReportPublicContent
						reportId={id}
						date={rawDate}
						period={period}
					/>
				</Suspense>
			</div>
		</main>
	);
}
