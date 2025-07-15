/** @format */

import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';
import ModalFormComercialGoal from './_components/modal-comercial-goal';
import BigNumbers from './_components/big-numbers';
import { Separator } from '@/components/ui/separator';
import HistoryGoal from './_components/history-goals';
import { DataTable } from '../_components/data-table-current-goal/data-table';
import getAllSellers from '@/actions/user/get-all';
import { FetchGoalTargetData } from '@/services/data-services/get-goal-target';
import { columns } from '../_components/data-table-current-goal/columns';

export default function GoalsComercial() {
	const data = getAllSellers();

	const newData = FetchGoalTargetData();

	const today = new Date();

	const formattedToday = today.toLocaleString('pt-BR', {
		month: '2-digit',
		year: 'numeric',
	});
	return (
		<div className=' bg-background w-full grid grid-cols-1 max-w-full'>
			<div className='my-5 flex flex-col md:flex-row gap-2 items-center justify-between'>
				<div>
					<h2 className=' text-3xl font-semibold'>JD Info Centro</h2>
					<p className='text-muted-foreground font-normal text-xl text-center md:text-start'>
						{formattedToday}
					</p>
				</div>
				<div className='w-full md:w-fit mt-5'>
					{<ModalFormComercialGoal sellers={data} />}
				</div>
			</div>
			<div>
				<Suspense
					fallback={
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5'>
							<Skeleton className='w-full h-24' />
							<Skeleton className='w-full h-24' />
							<Skeleton className='w-full h-24' />
							<Skeleton className='w-full h-24' />
						</div>
					}>
					<BigNumbers newData={newData} />
				</Suspense>
				<Suspense
					fallback={
						<div className='rounded-md mt-10 max-w-full w-full'>
							<Skeleton className='w-full h-60' />
						</div>
					}>
					<div className='rounded-md mt-10 max-w-full w-full'>
						<DataTable
							columns={columns}
							data={newData}
						/>
					</div>
				</Suspense>
				<Separator className='w-full my-10' />
				<Suspense
					fallback={
						<div className='rounded-md flex flex-col gap-2 max-w-full w-full'>
							<Skeleton className='w-full h-16' />
							<Skeleton className='w-full h-16' />
							<Skeleton className='w-full h-16' />
							<Skeleton className='w-full h-16' />
						</div>
					}>
					<HistoryGoal data={newData} />
				</Suspense>
			</div>
		</div>
	);
}
