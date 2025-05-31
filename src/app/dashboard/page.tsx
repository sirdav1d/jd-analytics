/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { FetchBigNumbers } from '@/services/data-services/get-comercial-big-numbers';
import { startOfMonth } from 'date-fns';
import { Trophy } from 'lucide-react';
import { Suspense } from 'react';
import ComparisonUnit from './_components/comparison-unit';
import Filter from './_components/filter';
import SalesChart from './_components/sales-chart';
import { SalesVsRepairRevenue } from './_components/sales-vs-repair-revenue';
import BigNumbers from './comercial/_components/big-numbers';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function OverviewPage(props: {
	searchParams: SearchParams;
}) {
	const topProducts = [
		{ name: 'Laptop Pro X', sales: 200, revenue: 400000, posicao: 1 },
		{ name: 'Smartphone Y', sales: 180, revenue: 180000, posicao: 2 },
		{ name: 'Tablet Z', sales: 150, revenue: 112500, posicao: 3 },
		{ name: 'Smartwatch A', sales: 120, revenue: 48000, posicao: 4 },
		{ name: 'Wireless Earbuds B', sales: 100, revenue: 20000, posicao: 5 },
	];

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

	return (
		<div className='pb-4 w-full mx-auto space-y-5 min-h-screen'>
			<Suspense
				fallback={
					<div className='flex gap-5 flex-col md:flex-row'>
						<Skeleton className='h-12 w-[120px]' />
						<Skeleton className='h-12 w-[240px]' />
					</div>
				}>
				<Filter />
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

			<div className='grid grid-cols-1 xl:grid-cols-3 gap-5 w-full'>
				<ComparisonUnit title='Faturamento total por unidade' />
				<ComparisonUnit title='Total de vendas por unidade' />
				<ComparisonUnit title='Ticket médio por unidade' />
			</div>
			<SalesVsRepairRevenue />
			<SalesChart />

			<div className='grid grid-cols-1 xl:grid-cols-2 gap-5 mb-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Top 5 Vendedores
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Posição</TableHead>
									<TableHead>Nome</TableHead>
									<TableHead>Vendas</TableHead>
									<TableHead className='text-nowrap'>Faturamento</TableHead>
									<TableHead>Ticket Médio</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									{
										posicao: 1,
										nome: 'Ana Silva',
										unidade: 'JD Centro',
										vendas2: 150,
										vendas: 'R$ 150.000,00',
										tkt: 'R$ 15.000,00',
									},
									{
										posicao: 2,
										nome: 'Carlos Santos',
										unidade: 'JD Icaraí',
										vendas2: 150,
										vendas: 'R$ 145.000,00',
										tkt: 'R$ 15.000,00',
									},
									{
										posicao: 3,
										nome: 'Mariana Oliveira',
										unidade: 'JD Centro',
										vendas2: 150,
										vendas: 'R$ 140.000,00',
										tkt: 'R$ 15.000,00',
									},
									{
										posicao: 4,
										nome: 'Roberto Alves',
										unidade: 'JD Centro',
										vendas2: 150,
										vendas: 'R$ 135.000,00',
										tkt: 'R$ 15.000,00',
									},
									{
										posicao: 5,
										nome: 'Juliana Costa',
										unidade: 'JD Icaraí',
										vendas2: 150,
										vendas: 'R$ 130.000,00',
										tkt: 'R$ 15.000,00',
									},
								].map((vendedor) => (
									<TableRow key={vendedor.posicao}>
										<TableCell className='flex items-center gap-3'>
											{vendedor.posicao}
											{vendedor.posicao == 1 ? (
												<Trophy
													size={20}
													className='text-amber-500'
												/>
											) : vendedor.posicao == 2 ? (
												<Trophy
													size={20}
													className='text-zinc-400'
												/>
											) : vendedor.posicao == 3 ? (
												<Trophy
													size={20}
													className='text-rose-700'
												/>
											) : null}
										</TableCell>
										<TableCell className='text-nowrap text-xs'>
											{vendedor.nome}
										</TableCell>
										<TableCell className='text-nowrap text-xs'>
											{vendedor.vendas2}
										</TableCell>
										<TableCell className='text-nowrap text-xs'>
											{vendedor.vendas}
										</TableCell>{' '}
										<TableCell className='text-nowrap text-xs'>
											{vendedor.tkt}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Top 5 Produtos
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Posição</TableHead>
									<TableHead>Produto</TableHead>
									<TableHead>Vendas</TableHead>
									<TableHead>Faturamento</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topProducts.map((product) => (
									<TableRow key={product.name}>
										<TableCell className='flex items-center gap-3'>
											{product.posicao}
											{product.posicao == 1 ? (
												<Trophy
													size={20}
													className='text-amber-500'
												/>
											) : product.posicao == 2 ? (
												<Trophy
													size={20}
													className='text-zinc-400'
												/>
											) : product.posicao == 3 ? (
												<Trophy
													size={20}
													className='text-rose-700'
												/>
											) : null}
										</TableCell>
										<TableCell className='text-nowrap text-xs'>
											{product.name}
										</TableCell>
										<TableCell>{product.sales}</TableCell>
										<TableCell className='text-nowrap text-xs'>
											R$ {product.revenue.toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
