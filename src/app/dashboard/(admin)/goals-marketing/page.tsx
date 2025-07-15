/** @format */

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { FetchGoalMarketingData } from '@/services/data-services/get-marketing-goals';
import { Suspense } from 'react';
import ModalFormGoal from './_components/modal-form-goal';
import BigNumberRoas from './_components/big-number-roas';
import HistoryMarketingGoals from './_components/history-marketing-goals';

export default function GoalsMarketing() {
	const marketingData = FetchGoalMarketingData();

	const today = new Date();

	const formattedToday = today.toLocaleString('pt-BR', {
		month: '2-digit',
		year: 'numeric',
	});

	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<div className=' bg-background w-full grid grid-cols-1 max-w-full'>
				<div className='my-5 w-full flex flex-col md:flex-row gap-2 items-center justify-between'>
					<div>
						<h2 className=' text-3xl font-semibold'>JD Info Centro</h2>
						<p className='text-muted-foreground font-normal text-xl text-center md:text-start'>
							{formattedToday}
						</p>
					</div>
					<div className='w-full md:w-fit mt-5'>
						<ModalFormGoal />
					</div>
				</div>
				<Suspense
					fallback={
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5'>
							<Skeleton className='w-full h-24' />
							<Skeleton className='w-full h-24' />
							<Skeleton className='w-full h-24' />
						</div>
					}>
					<BigNumberRoas data={marketingData} />
				</Suspense>

				<Separator className='mt-10 mb-5' />
				<Suspense
					fallback={
						<div className='rounded-md mt-10 max-w-full w-full'>
							<Skeleton className='w-full h-60' />
						</div>
					}>
					<HistoryMarketingGoals data={marketingData} />
				</Suspense>
			</div>
		</div>
	);
}
