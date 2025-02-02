/** @format */

import BtnSignOut from '@/components/btn-sign-out';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DollarSign,
	PenToolIcon,
	Rocket,
	TrendingUp,
	Trophy,
	Users,
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { SalesByCategoryChart } from './_components/sales-by-category-chart';
import SalesChart from './_components/sales-chart';
import { SalesVsRepairRevenue } from './_components/sales-vs-repair-revenue';
export default async function OverviewPage() {
	const session = await getServerSession();

	if (!session) {
		redirect('/sign-in');
	}

	return (
		<div className=' w-full p-4 flex flex-col xl:mx-10'>
			<div className=' flex flex-col-reverse lg:flex-row items-end lg:items-center justify-between w-full gap-5 xl:mt-10'>
				<div className='space-y-2 mr-auto'>
					<h2 className='font-medium text-base xl:text-xl'>
						Bem vindo <span className='text-primary'>{session.user?.name}</span>
					</h2>
					<p className='font-bold text-2xl xl:text-4xl'>Visão Geral</p>
				</div>
				<div className='flex items-center gap-5'>
					<ModeToggle />
					<BtnSignOut />
				</div>
			</div>
			<Separator className='my-5' />
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Receita Total</CardTitle>
						<TrendingUp className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>R$ 1.245.230,89</div>
						<p className='text-xs text-muted-foreground'>
							+20,1% em relação ao mês passado
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Receita Marketing
						</CardTitle>{' '}
						<Rocket className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>R$ 545.230,89</div>
						<p className='text-xs text-muted-foreground'>
							+20,1% em relação ao mês passado
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Novos Clientes
						</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>+2.350</div>
						<p className='text-xs text-muted-foreground'>
							+15,3% em relação ao mês passado
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Número de Vendas
						</CardTitle>
						<PenToolIcon className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>2.349</div>
						<p className='text-xs text-muted-foreground'>
							+12% em relação ao mês passado
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Ticket Médio</CardTitle>
						<DollarSign className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>R$ 530,00</div>
						<p className='text-xs text-muted-foreground'>
							+5,2% em relação ao mês passado
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Volume de Serviços
						</CardTitle>
						<PenToolIcon className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>1.429</div>
						<p className='text-xs text-muted-foreground'>
							+12% em relação ao mês passado
						</p>
					</CardContent>
				</Card>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Tendência de Vendas e Crescimento Mensal
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesChart />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Distribuição de Vendas por Categoria
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesByCategoryChart />
					</CardContent>
				</Card>
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
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
									<TableHead className='text-nowrap'>Total de Vendas</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									{ posicao: 1, nome: 'Ana Silva', vendas: 'R$ 150.000,00' },
									{
										posicao: 2,
										nome: 'Carlos Santos',
										vendas: 'R$ 145.000,00',
									},
									{
										posicao: 3,
										nome: 'Mariana Oliveira',
										vendas: 'R$ 140.000,00',
									},
									{
										posicao: 4,
										nome: 'Roberto Alves',
										vendas: 'R$ 135.000,00',
									},
									{
										posicao: 5,
										nome: 'Juliana Costa',
										vendas: 'R$ 130.000,00',
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
										<TableCell className='text-nowrap'>
											{vendedor.nome}
										</TableCell>
										<TableCell className='text-nowrap'>
											{vendedor.vendas}
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
							Receita de Vendas vs. Serviços
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SalesVsRepairRevenue />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
