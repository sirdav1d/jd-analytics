/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { FetchGoalTrackingData } from '@/services/data-services/get-goal-tracking';
import { IGoalTracking } from '@/services/data-services/types';
import { formatBusinessCivilDate } from '@/services/data-services/civil-date-range';
import { Suspense } from 'react';
import { Revenue } from './_components/charts/revenue';
import SellerComparison from './_components/charts/seller-comparison-desktop';
import SellerComparisonMobile from './_components/charts/seller-comparison-mobile';
import SellerRevenue from './_components/charts/seller-revenue';
import CompanySummary from './_components/company-summary';
import Filter from './_components/filter';
import SalesmanList from './_components/salesman-list';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function GoalResultPage(props: {
	searchParams: SearchParams;
}) {
	function formattedEndDate() {
		return formatBusinessCivilDate();
	}

	function formattedStartDate() {
		return `${formatBusinessCivilDate().slice(0, 7)}-01`;
	}
	const searchParams = await props.searchParams;
	const startDate = searchParams.startDate || formattedStartDate();
	const endDate = searchParams.endDate || formattedEndDate();

	const dataGoal: Promise<IGoalTracking> = FetchGoalTrackingData(
		String(startDate),
		String(endDate),
	);

	return (
		<div className='w-full mx-auto space-y-5 pb-5'>
			<Filter />
			<Separator className='my-5 w-full' />
			<Suspense
				fallback={
					<div className='grid grid-cols-1   xl:grid-cols-3 w-full my-5 gap-y-5 xl:gap-5 md:items-center'>
						<Skeleton className='col-span-full aspect-auto xl:col-span-1 h-80' />
						<Skeleton className='w-full col-span-2 h-80' />
					</div>
				}>
				<div className='grid grid-cols-1  2xl:grid-cols-3 w-full my-5 gap-y-5 xl:gap-5 md:items-center'>
					<CompanySummary data={dataGoal} />
					<Card className='w-full col-span-2 h-full'>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Faturamento por vendedor
							</CardTitle>
						</CardHeader>
						<CardContent>
							<SellerRevenue data={dataGoal} />
						</CardContent>
					</Card>
				</div>
			</Suspense>
			<Suspense
				fallback={
					<div className='grid grid-cols-1 gap-5'>
						<Skeleton className='w-full h-80' />
						<div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3  gap-5'>
							<Skeleton className='w-full h-80' />
							<Skeleton className='w-full h-80' />
							<Skeleton className='w-full h-80' />
						</div>
					</div>
				}>
				
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Performance por vendedor
							</CardTitle>
						</CardHeader>
						<CardContent>
							<SellerComparison data={dataGoal} />
							<SellerComparisonMobile data={dataGoal} />
						</CardContent>
					</Card>
					<SalesmanList data={dataGoal} />
				
			</Suspense>
			<Suspense fallback={<Skeleton className='w-full h-96' />}>
				<div className='grid grid-cols-1 gap-6 my-5'>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Faturamento ao Longo do Tempo
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Revenue data={dataGoal} />
						</CardContent>
					</Card>
				</div>
			</Suspense>
		</div>
	);
}
