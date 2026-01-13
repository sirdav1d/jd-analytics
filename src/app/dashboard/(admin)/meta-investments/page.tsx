/** @format */

import { Suspense } from 'react';
import MetaInvestmentsSection from './_components/meta-investments-section';
import MetaInvestmentsSkeleton from './_components/meta-investments-skeleton';

export default function MetaInvestmentsPage() {
	return (
		<div className='w-full mx-auto space-y-5 pb-5'>
			<Suspense fallback={<MetaInvestmentsSkeleton />}>
				<MetaInvestmentsSection />
			</Suspense>
		</div>
	);
}
