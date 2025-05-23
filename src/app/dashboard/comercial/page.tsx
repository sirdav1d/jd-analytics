/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	CirclePercent,
	DollarSign,
	ShoppingBag,
	SquarePercent,
	Timer,
	Trophy,
	UserRoundPlus,
} from 'lucide-react';
import { SalesByCategoryChart } from '../_components/sales-by-category-chart';
import { CustomerComparisonChartComponent } from './_components/customer-comparison';
import FilterComercial from './_components/filter-comercial';
import { GrowthChartComponent } from './_components/growth-chart';
import { SalesChartComponent } from './_components/sales-chart-commercial';
import RankingSellers from './_components/tables/ranking-sellers';
import { getComercialFilterAction } from '@/actions/filters/filter-comercial';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Mock data (replace with actual data in a real application)

export default function ComercialDashboard() {
	const dataFilter = getComercialFilterAction();
	const topProducts = [
		{ posicao: 1, name: 'Notebook Gamer XYZ', sales: 50, revenue: 150000 },
		{ posicao: 2, name: 'SSD 1TB', sales: 100, revenue: 50000 },
		{ posicao: 3, name: 'Placa de Vídeo RTX 3080', sales: 30, revenue: 90000 },
		{ posicao: 4, name: 'Monitor 4K 27"', sales: 40, revenue: 60000 },
		{ posicao: 5, name: 'Serviço de Montagem', sales: 80, revenue: 40000 },
	];

	const topCustomers = [
		{ posicao: 1, name: 'Empresa A', purchases: 10, revenue: 100000 },
		{ posicao: 2, name: 'João Silva', purchases: 5, revenue: 50000 },
		{ posicao: 3, name: 'Empresa B', purchases: 8, revenue: 80000 },
		{ posicao: 4, name: 'Maria Oliveira', purchases: 6, revenue: 60000 },
		{ posicao: 5, name: 'Empresa C', purchases: 7, revenue: 70000 },
	];

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
										<TableHead className='text-center text-nowrap'>
											Vendas
										</TableHead>
										<TableHead className='text-center'>Receita</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{topProducts.map((product) => {
										return (
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
												<TableCell className='text-sm text-nowrap'>
													{product.name}
												</TableCell>
												<TableCell className='text-center'>
													{product.sales}
												</TableCell>
												<TableCell className='text-nowrap text-center'>
													{product.revenue.toLocaleString('pt-br', {
														currency: 'brl',
														style: 'currency',
													})}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Top 5 Clientes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Posição</TableHead>
										<TableHead>Cliente</TableHead>
										<TableHead className='text-center'>Compras</TableHead>
										<TableHead className='text-center'>Receita</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{topCustomers.map((customer) => (
										<TableRow key={customer.name}>
											<TableCell className='flex items-center gap-3'>
												{customer.posicao}
												{customer.posicao == 1 ? (
													<Trophy
														size={20}
														className='text-amber-500'
													/>
												) : customer.posicao == 2 ? (
													<Trophy
														size={20}
														className='text-zinc-400'
													/>
												) : customer.posicao == 3 ? (
													<Trophy
														size={20}
														className='text-rose-700'
													/>
												) : null}
											</TableCell>
											<TableCell className='text-sm text-nowrap'>
												{customer.name}
											</TableCell>
											<TableCell className='text-center'>
												{customer.purchases}
											</TableCell>
											<TableCell className='text-center'>
												{customer.revenue.toLocaleString('pt-br', {
													currency: 'brl',
													style: 'currency',
												})}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
				<RankingSellers />
			</div>
		</div>
	);
}
