/** @format */

import getAllSellers from '@/actions/user/get-all';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FetchGoalTargetData } from '@/services/data-services/get-goal-target';
import { FetchGoalMarketingData } from '@/services/data-services/get-marketing-goals';
import { Suspense } from 'react';
import BigNumberRoas from './_components/big-number-roas';
import BigNumbers from './_components/big-numbers';
import { columns } from './_components/data-table-current-goal/columns';
import { DataTable } from './_components/data-table-current-goal/data-table';
import HistoryGoal from './_components/history-goals';
import HistoryMarketingGoals from './_components/history-marketing-goals';
import ModalFormComercialGoal from './_components/modal-comercial-goal';
import ModalFormGoal from './_components/modal-form-goal';

export default function GoalsPage() {
	const data = getAllSellers();

	const newData = FetchGoalTargetData();
	const marketingData = FetchGoalMarketingData();

	const today = new Date();

	const formattedToday = today.toLocaleString('pt-BR', {
		month: '2-digit',
		year: 'numeric',
	});

	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<Tabs
				defaultValue='Comercial'
				className='items-center'>
				<TabsList className='h-auto rounded-none border-b bg-transparent p-0'>
					<TabsTrigger
						value='Marketing'
						className='data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'>
						Marketing
					</TabsTrigger>
					<TabsTrigger
						value='Comercial'
						className='data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'>
						Comercial
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value='Marketing'
					className='w-full'>
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
						<BigNumberRoas data={marketingData} />

						<Separator className='my-10' />
						<Suspense
							fallback={
								<div className='rounded-md mt-10 max-w-full w-full'>
									<Skeleton className='w-full h-60' />
								</div>
							}>
							<HistoryMarketingGoals data={marketingData} />
						</Suspense>
					</div>
				</TabsContent>
				<TabsContent
					value='Comercial'
					className='w-full'>
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
				</TabsContent>
			</Tabs>
		</div>
	);
}
