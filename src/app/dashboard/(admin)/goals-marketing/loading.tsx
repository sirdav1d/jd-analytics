/** @format */

import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingGoalsMarketing() {
	return (
		<div className='w-full grid grid-cols-1 max-w-full'>
			<div className='my-5 flex flex-col md:flex-row gap-2 items-center justify-between'>
				<div className='space-y-2'>
					<Skeleton className='h-9 w-48' />
					<Skeleton className='h-7 w-20' />
				</div>
				<Skeleton className='h-10 w-full md:w-52 mt-5' />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
				{Array.from({ length: 3 }, (_, index) => (
					<Skeleton key={index} className='w-full h-24' />
				))}
			</div>
			<Skeleton className='w-full h-60 mt-10' />
		</div>
	);
}
