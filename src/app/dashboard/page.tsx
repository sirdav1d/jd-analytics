/** @format */

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { FetchBigNumbers } from '@/services/data-services/get-comercial-big-numbers';
import { FetchRankings } from '@/services/data-services/get-rankings';
import { FetchResultByOrg } from '@/services/data-services/get-result-by-org';
import { startOfMonth } from 'date-fns';
import { Suspense } from 'react';
import ComparisonUnit from './_components/comparison-unit';
import Filter from './_components/filter';
import RevenueChart from './_components/revenue-chart';
import { SalesVsRepairRevenue } from './_components/sales-vs-repair-revenue';
import BigNumbers from './comercial/_components/big-numbers';
import RankingSellers from './comercial/_components/tables/ranking-sellers';
import TopProducts from './comercial/_components/tables/top-products';
import GoalsHomeProgress from './_components/goals-home-progress';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function OverviewPage(props: {
	searchParams: SearchParams;
}) {
	function formattedEndDate() {
		const date = new Date();
		const endDate = date.toISOString().split('T')[0];
		return endDate;
	}
	function formattedStartDate() {
		const date = new Date();
		const start = startOfMonth(date);
		const startDate = start.toISOString().split('T')[0];
		return startDate;
	}
	const searchParams = await props.searchParams;
	const startDate = searchParams.startDate || formattedStartDate();
	const endDate = searchParams.endDate || formattedEndDate();
	const category = searchParams.category || 'all';
	const customerType = searchParams.customerType || 'all';
	const org = searchParams.org || 'all';

	const dataBigNumbers = FetchBigNumbers(
		String(startDate),
		String(endDate),
		String(category),
		String(customerType),
		String(org),
	);

	const dataRankings = FetchRankings(
		String(startDate),
		String(endDate),
		String(category),
		String(customerType),
		String(org),
	);

	const revenueByOrg = FetchResultByOrg(String(startDate), String(endDate));

	return (
		<div className='pb-4 w-full mx-auto flex flex-col gap-4 min-h-screen'>
			<Suspense
				fallback={
					<div className='flex gap-5 flex-col md:flex-row'>
						<Skeleton className='h-12 w-[120px]' />
						<Skeleton className='h-12 w-[240px]' />
					</div>
				}>
				<Filter />
			</Suspense>
			<Separator className='w-full' />
			<GoalsHomeProgress
				canShowComercial={true}
				canShowMarketing={true}
				goalComercial={399000}
				goalMarketing={20}
				achievedComercial={82926.3}
				achievedMarketing={10}
			/>
			<Suspense
				fallback={
					<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
						<Skeleton className='w-full h-28' />
						<Skeleton className='w-full h-28' />
						<Skeleton className='w-full h-28' />
						<Skeleton className='w-full h-28' />
						<Skeleton className='w-full h-28' />
						<Skeleton className='w-full h-28' />
					</div>
				}>
				<BigNumbers data={dataBigNumbers} />
			</Suspense>

			<div className='grid grid-cols-1 xl:grid-cols-3 gap-5 w-full'>
				<ComparisonUnit
					key={'revenue'}
					type='revenue'
					data={revenueByOrg}
					title='Faturamento total por unidade'
				/>
				<ComparisonUnit
					key={'salesCount'}
					type='salesCount'
					data={revenueByOrg}
					title='Total de vendas por unidade'
				/>
				<ComparisonUnit
					key={'newCustomers'}
					type='newCustomers'
					data={revenueByOrg}
					title='Novos Clientes'
				/>
			</div>
			<SalesVsRepairRevenue data={revenueByOrg} />
			<RevenueChart data={revenueByOrg} />

			<Suspense
				fallback={
					<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
						<Skeleton className='w-full h-96' />
						<Skeleton className='w-full h-96' />
					</div>
				}>
				<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
					<RankingSellers data={dataRankings} />
					<TopProducts data={dataRankings} />
				</div>
			</Suspense>
		</div>
	);
}
