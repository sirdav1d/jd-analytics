/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const rows = Array.from({ length: 4 });

export default function MetaInvestmentsSkeleton() {
	return (
		<div className='flex max-sm:flex-col items-start gap-20 mt-5'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle className='text-lg'>Registrar investimento</CardTitle>
					<Skeleton className='h-4 w-40' />
				</CardHeader>
				<CardContent className='space-y-4'>
					<Skeleton className='h-10 w-full' />
					<Skeleton className='h-10 w-full' />
					<Skeleton className='h-10 w-full' />
				</CardContent>
			</Card>

			<div className='w-full space-y-4'>
				<div className='flex items-center gap-2'>
					<Skeleton className='h-5 w-5 rounded-full' />
					<Skeleton className='h-6 w-64' />
				</div>
				<div className='border rounded-md p-4 space-y-3'>
					<div className='grid grid-cols-4 gap-3'>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-10' />
					</div>
					{rows.map((_, index) => (
						<div
							key={index}
							className='grid grid-cols-4 gap-3'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-8 w-10' />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
