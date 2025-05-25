/** @format */

import { getComercialFilterAction } from '@/actions/filters/filter-comercial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
	CirclePercent,
	DollarSign,
	ShoppingBag,
	SquarePercent,
	Timer,
	UserRoundPlus,
} from 'lucide-react';
import { Suspense } from 'react';
import { SalesByCategoryChart } from '../_components/sales-by-category-chart';
import { CustomerComparisonChartComponent } from './_components/customer-comparison';
import FilterComercial from './_components/filter-comercial';
import { GrowthChartComponent } from './_components/growth-chart';
import { SalesChartComponent } from './_components/sales-chart-commercial';
import RankingSellers from './_components/tables/ranking-sellers';
import TopClients from './_components/tables/top-clients';
import TopProducts from './_components/tables/top-products';
import { FetchRankings } from '@/services/data-services/get-rankings';

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
		date.setDate(date.getDate() - 7);
		const startDate = date.toISOString().split('T')[0];
		return startDate;
	}
	const searchParams = await props.searchParams;
	const startDate = searchParams.startDate || formattedStartDate();
	const endDate = searchParams.endDate || formattedEndDate();
	const category = searchParams.category || 'all';
	const customerType = searchParams.customerType || 'all';

	const dataFilter = getComercialFilterAction();
	const dataRankings = FetchRankings(
		String(startDate),
		String(endDate),
		String(category),
		String(customerType),
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
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total de Faturamento
						</CardTitle>
						<DollarSign className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 150.000,00</div>
						<p className='text-xs text-muted-foreground'>
							+20% em relação ao período anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Ticket Médio</CardTitle>
						<SquarePercent className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 500,00</div>
						<p className='text-xs text-muted-foreground'>
							+5% em relação ao período anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total de Vendas
						</CardTitle>
						<ShoppingBag className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>300</div>
						<p className='text-xs text-muted-foreground'>
							+15% em relação ao período anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Novos Clientes
						</CardTitle>
						<UserRoundPlus className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>50</div>
						<p className='text-xs text-muted-foreground'>
							+10% em relação ao período anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Tempo Médio entre Compras
						</CardTitle>
						<Timer className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>45 dias</div>
						<p className='text-xs text-muted-foreground'>
							Para clientes recorrentes
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Faturamento por Cliente
						</CardTitle>
						<CirclePercent className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 1,500</div>
						<p className='text-xs text-muted-foreground'>Média por cliente</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Faturamento por Período
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesChartComponent />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Vendas por Categoria
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesByCategoryChart />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Crescimento de Vendas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<GrowthChartComponent />
					</CardContent>
				</Card>
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
				<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
					<TopClients data={dataRankings} />
					<TopProducts data={dataRankings} />
				</div>
				<RankingSellers data={dataRankings} />
			</div>
		</div>
	);
}
