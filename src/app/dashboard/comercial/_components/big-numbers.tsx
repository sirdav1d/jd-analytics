/** @format */

'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	CirclePercent,
	DollarSign,
	ShoppingBag,
	SquarePercent,
	TrendingDown,
	TrendingUp,
	UserRoundPlus,
	UsersRound,
} from 'lucide-react';
import { use } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BigNumbers({ data }: { data: Promise<any> }) {
	const allData = use(data);

	if (!allData.ok || !allData.data) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Sem dados encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Total de Faturamento
					</CardTitle>
					<DollarSign className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3 '>
						{allData.data.current.totalRevenue
							? allData.data.current.totalRevenue.toLocaleString('pt-BR', {
									style: 'currency',
									currency: 'brl',
								})
							: 0}
						<Badge
							variant={
								allData.data.diff.totalRevenue > 0 ? 'success' : 'destructive'
							}>
							{allData.data.diff.totalRevenuePct
								? allData.data.diff.totalRevenuePct.toFixed(2)
								: 0}
							%
							{allData.data.diff.totalRevenue > 0 ? (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior{' '}
						{allData.data.previous.totalRevenue
							? allData.data.previous.totalRevenue.toLocaleString('pt-BR', {
									style: 'currency',
									currency: 'brl',
								})
							: 0}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Ticket Médio</CardTitle>
					<SquarePercent className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3 '>
						{allData.data.current.averageTicket
							? allData.data.current.averageTicket.toLocaleString('pt-BR', {
									style: 'currency',
									currency: 'brl',
								})
							: 0}
						<Badge
							variant={
								allData.data.diff.averageTicket > 0 ? 'success' : 'destructive'
							}>
							{allData.data.diff.averageTicketPct
								? allData.data.diff.averageTicketPct.toFixed(2)
								: 0}
							%
							{allData.data.diff.averageTicket > 0 ? (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior{' '}
						{allData.data.previous.averageTicket
							? allData.data.previous.averageTicket.toLocaleString('pt-BR', {
									style: 'currency',
									currency: 'brl',
								})
							: 0}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Total de Vendas</CardTitle>
					<ShoppingBag className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3 '>
						{allData.data.current.totalSales
							? allData.data.current.totalSales.toLocaleString('pt-BR')
							: 0}
						<Badge
							variant={
								allData.data.diff.totalSales > 0 ? 'success' : 'destructive'
							}>
							{allData.data.diff.totalSalesPct
								? allData.data.diff.totalSalesPct.toFixed(2)
								: 0}
							%
							{allData.data.diff.totalSales > 0 ? (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior{' '}
						{allData.data.previous.totalSales
							? allData.data.previous.totalSales.toLocaleString('pt-BR')
							: 0}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Novos Clientes</CardTitle>
					<UserRoundPlus className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3 '>
						{allData.data.current.newCustomers
							? allData.data.current.newCustomers.toLocaleString('pt-BR')
							: 0}
						<Badge
							variant={
								allData.data.diff.newCustomers > 0 ? 'success' : 'destructive'
							}>
							{allData.data.diff.newCustomersPct
								? allData.data.diff.newCustomersPct.toFixed(2)
								: 0}
							%
							{allData.data.diff.newCustomers > 0 ? (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior{' '}
						{allData.data.previous.newCustomers
							? allData.data.previous.newCustomers.toLocaleString('pt-BR')
							: 0}
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Clientes Recorrentes
					</CardTitle>
					<UsersRound className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3 '>
						{allData.data.current.recurringCustomers
							? allData.data.current.recurringCustomers.toLocaleString('pt-BR')
							: 0}
						<Badge
							variant={
								allData.data.diff.recurringCustomers > 0
									? 'success'
									: 'destructive'
							}>
							{allData.data.diff.recurringCustomersPct
								? allData.data.diff.recurringCustomersPct.toFixed(2)
								: 0}
							%
							{(allData.data.diff.recurringCustomers ?? 0 > 0) ? (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior{' '}
						{allData.data.previous.recurringCustomers
							? allData.data.previous.recurringCustomers.toLocaleString('pt-BR')
							: 0}
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
					<div className='text-2xl font-bold flex items-center gap-3 '>
						{allData.data.current.revenuePerCustomer
							? allData.data.current.revenuePerCustomer.toLocaleString('pt-BR')
							: 0}
						<Badge
							variant={
								allData.data.diff.revenuePerCustomer > 0
									? 'success'
									: 'destructive'
							}>
							{allData.data.diff.revenuePerCustomerPct
								? allData.data.diff.revenuePerCustomerPct.toFixed(2)
								: 0}
							%
							{allData.data.diff.revenuePerCustomer > 0 ? (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior{' '}
						{allData.data.previous.revenuePerCustomer
							? allData.data.previous.revenuePerCustomer.toLocaleString('pt-BR')
							: 0}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
