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

// Mock data (replace with actual data in a real application)

export default function ComercialDashboard() {
	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: addDays(new Date(), 30),
	});
	const [channel, setChannel] = useState('all');
	const [category, setCategory] = useState('all');
	const [representative, setRepresentative] = useState('all');
	const [customerType, setCustomerType] = useState('all');

	const topProducts = [
		{ name: 'Notebook Gamer XYZ', sales: 50, revenue: 150000 },
		{ name: 'SSD 1TB', sales: 100, revenue: 50000 },
		{ name: 'Placa de Vídeo RTX 3080', sales: 30, revenue: 90000 },
		{ name: 'Monitor 4K 27"', sales: 40, revenue: 60000 },
		{ name: 'Serviço de Montagem', sales: 80, revenue: 40000 },
	];

	const topCustomers = [
		{ name: 'Empresa A', purchases: 10, revenue: 100000 },
		{ name: 'João Silva', purchases: 5, revenue: 50000 },
		{ name: 'Empresa B', purchases: 8, revenue: 80000 },
		{ name: 'Maria Oliveira', purchases: 6, revenue: 60000 },
		{ name: 'Empresa C', purchases: 7, revenue: 70000 },
	];

	const topSalespeople = [
		{ name: 'Carlos Souza', sales: 50, revenue: 250000 },
		{ name: 'Ana Rodrigues', sales: 45, revenue: 225000 },
		{ name: 'Pedro Santos', sales: 40, revenue: 200000 },
		{ name: 'Juliana Lima', sales: 35, revenue: 175000 },
		{ name: 'Roberto Alves', sales: 30, revenue: 150000 },
	];

	return (
		<div className='mx-auto space-y-4 w-full mb-5'>
			{/* Filters */}
			<div className='flex flex-wrap gap-4 mb-4'>
				<DatePickerWithRange
					date={dateRange}
					setDate={() => setDateRange}
				/>
				<Select
					value={channel}
					onValueChange={setChannel}>
					<SelectTrigger className='md:w-[220px]'>
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
					<SelectTrigger className='md:w-[220px]'>
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
					<SelectTrigger className='md:w-[220px]'>
						<SelectValue placeholder='Representante' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todos os Representantes</SelectItem>
						<SelectItem value='rep1'>Representante 1</SelectItem>
						<SelectItem value='rep2'>Representante 2</SelectItem>
						<SelectItem value='rep3'>Representante 3</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={customerType}
					onValueChange={setCustomerType}>
					<SelectTrigger className='md:w-[220px]'>
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
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total de Vendas
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 150,000</div>
						<p className='text-xs'>+20% em relação ao período anterior</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Ticket Médio</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 500</div>
						<p className='text-xs'>+5% em relação ao período anterior</p>
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
						<p className='text-xs'>+15% em relação ao período anterior</p>
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
						<p className='text-xs'>+10% em relação ao período anterior</p>
					</CardContent>
				</Card>{' '}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Tempo Médio entre Compras
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>45 dias</div>
						<p className='text-xs'>Para clientes recorrentes</p>
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
						<p className='text-xs'>Média por cliente</p>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Vendas por Período</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesChartComponent />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Vendas por Categoria</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesByCategoryChart />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Crescimento de Vendas</CardTitle>
					</CardHeader>
					<CardContent>
						<GrowthChartComponent />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Novos Clientes vs. Recorrentes</CardTitle>
					</CardHeader>
					<CardContent>
						<CustomerComparisonChartComponent />
					</CardContent>
				</Card>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle>Top 5 Produtos</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Produto</TableHead>
									<TableHead>Vendas</TableHead>
									<TableHead>Receita</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topProducts.map((product) => (
									<TableRow key={product.name}>
										<TableCell>{product.name}</TableCell>
										<TableCell>{product.sales}</TableCell>
										<TableCell className='text-nowrap'>
											R$ {product.revenue.toLocaleString()}
										</TableCell>
									</TableRow>
								))}
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
									<TableHead>Cliente</TableHead>
									<TableHead>Compras</TableHead>
									<TableHead>Receita</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topCustomers.map((customer) => (
									<TableRow key={customer.name}>
										<TableCell>{customer.name}</TableCell>
										<TableCell>{customer.purchases}</TableCell>
										<TableCell>
											R$ {customer.revenue.toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Top 5 Vendedores</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Vendedor</TableHead>
									<TableHead>Vendas</TableHead>
									<TableHead>Receita</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topSalespeople.map((salesperson) => (
									<TableRow key={salesperson.name}>
										<TableCell>{salesperson.name}</TableCell>
										<TableCell>{salesperson.sales}</TableCell>
										<TableCell>
											R$ {salesperson.revenue.toLocaleString()}
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
