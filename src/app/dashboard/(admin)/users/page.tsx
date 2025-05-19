/** @format */

import { Skeleton } from '@/components/ui/skeleton';
import { FetchGoalTargetData } from '@/services/data-services/get-users-all';
import { Suspense } from 'react';
import { DataTable } from '../_components/data-table';
import { columns } from './_components/columns';

export default function AdminPage() {
	const response = FetchGoalTargetData();

	return (
		<div className='w-full mx-auto pb-10'>
			<Suspense
				fallback={
					<div>
						<div className='flex items-center flex-col gap-5 md:flex-row  py-4'>
							<Skeleton className='w-full md:w-40 h-12' />
							<Skeleton className='w-full md:w-40 h-12' />
							<Skeleton className='w-full md:w-40 h-12' />
						</div>
						<Skeleton className='w-full h-[60svh]' />
					</div>
				}>
				<DataTable
					columns={columns}
					data={response}
				/>
			</Suspense>
		</div>
	);
}
