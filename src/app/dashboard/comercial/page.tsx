/** @format */

import { getComercialFilterAction } from '@/actions/filters/filter-comercial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { FetchBigNumbers } from '@/services/data-services/get-comercial-big-numbers';
import { FetchSalesBy } from '@/services/data-services/get-comercial-sales-by';
import { FetchRankings } from '@/services/data-services/get-rankings';
import { startOfMonth } from 'date-fns';
import { Suspense } from 'react';
import { SalesByCategoryChart } from '../_components/sales-by-category-chart';
import { SalesByClient } from '../_components/sales-by-client';
import { SalesByPayment } from '../_components/sales-by-payment';
import BigNumbers from './_components/big-numbers';
import { CustomerComparisonChartComponent } from './_components/customer-comparison';
import FilterComercial from './_components/filter-comercial';
import { SalesChartComponent } from './_components/sales-chart-commercial';
import RankingSellers from './_components/tables/ranking-sellers';
import TopClients from './_components/tables/top-clients';
import TopProducts from './_components/tables/top-products';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ComercialDashboard(props: {
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

	const dataFilter = getComercialFilterAction();
	const dataRankings = FetchRankings(
		String(startDate),
		String(endDate),
		String(category),
		String(customerType),
		String(org),
	);

	const dataBigNumbers = FetchBigNumbers(
		String(startDate),
		String(endDate),
		String(category),
		String(customerType),
		String(org),
	);

	const dataSalesBy = FetchSalesBy(
		String(startDate),
		String(endDate),
		String(category),
		String(customerType),
		String(org),
	);

	return (
		<div className='mx-auto space-y-4 mb-5  w-full'>
			<Suspense
				fallback={
					<div className='md:w-fit flex-wrap flex items-center flex-col md:flex-row  w-full gap-4 h-fit'>
						<Skeleton className='w-full md:w-48  h-12' />
						<Skeleton className='w-full md:w-48 h-12' />
						<Skeleton className='w-full md:w-48 h-12' />
						<Skeleton className='w-full md:w-48 h-12' />
					</div>
				}>
				<FilterComercial data={dataFilter} />
			</Suspense>
			<Separator className='my-5 w-full' />
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

			<Suspense
				fallback={
					<div className='grid grid-cols-1  xl:grid-cols-3 gap-4'>
						<Skeleton className='w-full h-96' />
						<Skeleton className='w-full h-96' />
						<Skeleton className='w-full h-96' />
					</div>
				}>
				<div className='grid grid-cols-1 max-h-full xl:grid-cols-3 gap-4'>
					<SalesByClient data={dataSalesBy} />
					<SalesByCategoryChart data={dataSalesBy} />
					<SalesByPayment />
				</div>
			</Suspense>

			<div className='grid grid-cols-1 gap-4'>
				{/* <Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Reparos x Vendas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<GrowthChartComponent />
					</CardContent>
				</Card> */}
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Novos Clientes vs. Recorrentes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<CustomerComparisonChartComponent />
					</CardContent>
				</Card>
			</div>
			<div className='grid grid-cols-1 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Faturamento por Período
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesChartComponent />
					</CardContent>
				</Card>{' '}
				<Suspense
					fallback={
						<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
							<Skeleton className='w-full h-96' />
							<Skeleton className='w-full h-96' />
						</div>
					}>
					<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
						<TopClients data={dataRankings} />
						<TopProducts data={dataRankings} />
					</div>
				</Suspense>
				<Suspense fallback={<Skeleton className='w-full h-96' />}>
					<RankingSellers data={dataRankings} />
				</Suspense>
			</div>
		</div>
	);
}
