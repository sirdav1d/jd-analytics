/** @format */

import { ModeToggle } from '@/components/ui/mode-toggle';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MarketingReportPublicContent from './_components/marketing-report-public-content';
import MarketingReportPublicSkeleton from './_components/marketing-report-public-skeleton';

export default async function PublicMarketingReportPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
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
					<MarketingReportPublicContent reportId={id} />
				</Suspense>
			</div>
		</main>
	);
}
