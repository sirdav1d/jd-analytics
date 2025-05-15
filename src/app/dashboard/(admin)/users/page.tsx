/** @format */

import { Suspense } from 'react';
import { DataTable } from '../_components/data-table';
import { columns } from './_components/columns';
import { Skeleton } from '@/components/ui/skeleton';

export default async function AdminPage() {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}/api/services/user-get-all`, {
		next: { tags: ['users'], revalidate: 60 },
	});

	const { data } = await response.json();
	if (!data) {
		return <p>Sem dados encontrados...</p>;
	}

	return (
		<div className='w-full mx-auto pb-10'>
			<Suspense
				fallback={
					<div>
						<div className='flex items-center flex-col gap-5 md:flex-row  py-4'>
							<Skeleton className='w-40 h-12' />
							<Skeleton className='w-40 h-12' />
							<Skeleton className='w-40 h-12' />
						</div>
						<Skeleton className='w-full h-96' />
					</div>
				}>
				<DataTable
					columns={columns}
					data={data}
				/>
			</Suspense>
		</div>
	);
}
