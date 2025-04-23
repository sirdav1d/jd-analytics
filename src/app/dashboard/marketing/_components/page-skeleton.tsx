/** @format */

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
export default function PageSkeleton() {
	return (
		<div className='w-full mx-auto space-y-4 pb-5'>
			<Skeleton className='w-full  h-14'></Skeleton>
			<div className='flex gap-5'>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-5'>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
			</div>
			<div className='flex gap-5'>
				<Skeleton className='w-full  h-80'></Skeleton>
				<Skeleton className='w-full  h-80'></Skeleton>
			</div>
			<Skeleton className='w-full  h-80'></Skeleton>
			<div className='flex gap-5'>
				<Skeleton className='w-full  h-80'></Skeleton>
				<Skeleton className='w-full  h-80'></Skeleton>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
				<Skeleton className='w-full  h-32'></Skeleton>
			</div>
			<div className='flex gap-5'>
				<Skeleton className='w-full  h-80'></Skeleton>
				<Skeleton className='w-full  h-80'></Skeleton>
			</div>
		</div>
	);
}
