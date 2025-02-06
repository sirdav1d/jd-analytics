/** @format */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { SalesByCategoryChart } from './_components/category-sales';
import { CustomerComparisonChartComponent } from './_components/customer-comparison';
import { GrowthChartComponent } from './_components/growth-chart';
import { SalesChartComponent } from './_components/sales-chart-commercial';
import { Trophy } from 'lucide-react';

// Mock data (replace with actual data in a real application)

export default function ComercialDashboard() {
	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: addDays(new Date(), 7),
	});
	const [channel, setChannel] = useState('all');
	const [category, setCategory] = useState('all');
	const [representative, setRepresentative] = useState('all');
	const [customerType, setCustomerType] = useState('all');

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

	const topSalespeople = [
		{
			posicao: 1,
			name: 'Carlos Souza',
			sales: 50,
			revenue: 270000,
			conversion: 80,
		},
		{
			posicao: 2,
			name: 'Ana Rodrigues',
			sales: 45,
			revenue: 235000,
			conversion: 90,
		},
		{
			posicao: 3,
			name: 'Pedro Santos',
			sales: 40,
			revenue: 202000,
			conversion: 70,
		},
		{
			posicao: 4,
			name: 'Juliana Lima',
			sales: 35,
			revenue: 180000,
			conversion: 75,
		},
		{
			posicao: 5,
			name: 'Bianca Martins',
			sales: 30,
			revenue: 160000,
			conversion: 65,
		},
		{
			posicao: 6,
			name: 'Gustavo Ferreira',
			sales: 50,
			revenue: 270000,
			conversion: 74,
		},
		{
			posicao: 7,
			name: 'Fernanda Oliveira',
			sales: 45,
			revenue: 235000,
			conversion: 60,
		},
		{
			posicao: 8,
			name: 'Leonardo Mendes',
			sales: 40,
			revenue: 202000,
			conversion: 55,
		},
		{
			posicao: 9,
			name: 'Thiago Barbosa',
			sales: 35,
			revenue: 180000,
			conversion: 58,
		},
		{
			posicao: 10,
			name: 'Amanda Nogueira',
			sales: 30,
			revenue: 160000,
			conversion: 45,
		},
	];

	return (
		<div className='mx-auto space-y-4 mb-5  w-full'>
			{/* Filters */}
			<div className='flex flex-wrap gap-4 mb-4'>
				<DatePickerWithRange
					date={dateRange}
					setDate={(e) =>
						setDateRange({
							from: e?.from ?? new Date(),
							to: e?.to ?? new Date(),
						})
					}
				/>
				<Select
					value={channel}
					onValueChange={setChannel}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Canal de Venda' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todos os Canais</SelectItem>
						<SelectItem value='physical'>Loja Física</SelectItem>
						<SelectItem value='ecommerce'>E-commerce</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={category}
					onValueChange={setCategory}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Categoria' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas as Categorias</SelectItem>
						<SelectItem value='computers'>Computadores Montados</SelectItem>
						<SelectItem value='services'>Serviços Técnicos</SelectItem>
						<SelectItem value='peripherals'>Periféricos</SelectItem>
						<SelectItem value='upgrades'>Upgrades</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={representative}
					onValueChange={setRepresentative}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Representante' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todos os Vendedores</SelectItem>
						<SelectItem value='rep1'>Representante 1</SelectItem>
						<SelectItem value='rep2'>Representante 2</SelectItem>
						<SelectItem value='rep3'>Representante 3</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={customerType}
					onValueChange={setCustomerType}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Tipo de Cliente' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todos os Clientes</SelectItem>
						<SelectItem value='new'>Novos Clientes</SelectItem>
						<SelectItem value='recurring'>Clientes Recorrentes</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{/* Main KPIs */}
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total de Vendas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 150,000</div>
						<p className='text-xs text-muted-foreground'>
							+20% em relação ao período anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Ticket Médio</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 500</div>
						<p className='text-xs text-muted-foreground'>
							+5% em relação ao período anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Número de Transações
						</CardTitle>
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
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 1,500</div>
						<p className='text-xs text-muted-foreground'>Média por cliente</p>
					</CardContent>
				</Card>
			</div>
			{/* Charts */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Vendas por Período
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
							<CardTitle>Top 5 Produtos</CardTitle>
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
							<CardTitle>Top 5 Clientes</CardTitle>
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
				<Card>
					<CardHeader>
						<CardTitle>Ranking de Vendedores</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Posição</TableHead>
									<TableHead>Vendedor</TableHead>
									<TableHead className='text-center text-nowrap'>
										Vendas
									</TableHead>
									<TableHead className='text-center text-nowrap'>
										Receita
									</TableHead>
									<TableHead className='text-center text-nowrap'>
										Ticket Médio
									</TableHead>
									<TableHead className='text-center text-nowrap'>
										Taxa de Conversão
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topSalespeople.map((salesperson) => {
									const ticketSalesMan =
										salesperson.revenue / salesperson.sales;
									return (
										<TableRow key={salesperson.name}>
											<TableCell className='flex items-center gap-3'>
												{salesperson.posicao}
												{salesperson.posicao == 1 ? (
													<Trophy
														size={20}
														className='text-amber-500'
													/>
												) : salesperson.posicao == 2 ? (
													<Trophy
														size={20}
														className='text-zinc-400'
													/>
												) : salesperson.posicao == 3 ? (
													<Trophy
														size={20}
														className='text-rose-700'
													/>
												) : null}
											</TableCell>
											<TableCell className='text-sm text-nowrap'>
												{salesperson.name}
											</TableCell>
											<TableCell className='text-center'>
												{salesperson.sales}
											</TableCell>
											<TableCell className='text-center'>
												{salesperson.revenue.toLocaleString('pt-br', {
													currency: 'brl',
													style: 'currency',
												})}
											</TableCell>
											<TableCell className='text-center'>
												{ticketSalesMan.toLocaleString('pt-br', {
													currency: 'brl',
													style: 'currency',
												})}
											</TableCell>
											<TableCell className='text-center'>
												{salesperson.conversion}%
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
