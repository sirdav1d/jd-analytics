/** @format */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketingReportPublicSkeleton() {
	return (
		<Card className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
			<CardHeader className='flex flex-col gap-4'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<Skeleton className='h-6 w-24' />
					<div className='flex items-center gap-2'>
						<Skeleton className='h-9 w-28' />
						<Skeleton className='h-9 w-28' />
					</div>
				</div>
				<Skeleton className='h-5 w-4/5' />
			</CardHeader>
			<CardContent className='space-y-3'>
				<Skeleton className='h-4 w-4/5' />
				<Skeleton className='h-4 w-3/5' />
				<Skeleton className='h-4 w-2/3' />
				<Skeleton className='h-4 w-3/4' />
				<Skeleton className='h-4 w-2/5' />
				<div className='h-2' />
				<Skeleton className='h-4 w-1/2' />
				<Skeleton className='h-4 w-1/3' />
			</CardContent>
		</Card>
	);
}
