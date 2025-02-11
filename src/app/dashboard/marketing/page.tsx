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

// Import the chart components
import {
	BookUser,
	Clock,
	DollarSign,
	GitPullRequestClosed,
	HandCoins,
	MonitorPlay,
	MousePointerClick,
	Percent,
	SquareDashedMousePointer,
	Trophy,
	UserRoundCheck,
} from 'lucide-react';
import { CampagnComponent } from './_components/charts/campaings';
import { ConversionsComponent } from './_components/charts/conversion';
import { RevenueComponent } from './_components/charts/revenueByChannel';
import { TrafficComponent } from './_components/charts/traffic';
import GoogleLoginButton from '@/components/google-login-button';
import NotificationConnectionGoogle from '@/components/notification-connection-google';

export default function MarketingPage() {
	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: addDays(new Date(), 7),
	});
	const [trafficSource, setTrafficSource] = useState('all');
	const [campaign, setCampaign] = useState('all');

	return (
		<div className='w-full mx-auto space-y-4 pb-5'>
			<NotificationConnectionGoogle />
			{/* Filtros */}
			<div className='w-full flex flex-wrap gap-4 mb-4'>
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
					value={trafficSource}
					onValueChange={setTrafficSource}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Fonte de Tráfego' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas as Fontes</SelectItem>
						<SelectItem value='organic'>Orgânico</SelectItem>
						<SelectItem value='paid'>Pago</SelectItem>
						<SelectItem value='social'>Social</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={campaign}
					onValueChange={setCampaign}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Campanha' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas as Campanhas</SelectItem>
						<SelectItem value='summer'>Verão 2023</SelectItem>
						<SelectItem value='blackfriday'>Black Friday</SelectItem>
						<SelectItem value='christmas'>Natal</SelectItem>
					</SelectContent>
				</Select>
				<GoogleLoginButton />
			</div>

			{/* KPIs Principais */}
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
				{' '}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Total de Faturamento
						</CardTitle>
						<DollarSign className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>R$ 1,250,000</div>
						<p className='text-xs text-muted-foreground'>
							+20% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Sessões</CardTitle>
						<MonitorPlay className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>120.000</div>
						<p className='text-xs text-muted-foreground'>
							+15% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Usuários</CardTitle>
						<UserRoundCheck className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>85.000</div>
						<p className='text-xs text-muted-foreground'>
							+10% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Taxa de Conversão
						</CardTitle>
						<Percent className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>2.8%</div>
						<p className='text-xs text-muted-foreground'>
							+0.5% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Gráficos */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Distribuição de Tráfego
						</CardTitle>
					</CardHeader>
					<CardContent>
						<TrafficComponent />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Conversões por Canal
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ConversionsComponent />
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Desempenho de Campanhas
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CampagnComponent />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Faturamento por Canal
					</CardTitle>
				</CardHeader>
				<CardContent>
					<RevenueComponent />
				</CardContent>
			</Card>
			{/* Métricas Adicionais */}
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Taxa de Rejeição
						</CardTitle>
						<GitPullRequestClosed className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>35%</div>
						<p className='text-xs text-muted-foreground'>
							-2% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Duração Média da Sessão
						</CardTitle>
						<Clock className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>2m 45s</div>
						<p className='text-xs text-muted-foreground'>
							+15s em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Páginas por Sessão
						</CardTitle>
						<BookUser className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>3.5</div>
						<p className='text-xs text-muted-foreground'>
							+0.2 em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							CTR (Taxa de Cliques)
						</CardTitle>
						<MousePointerClick className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>3.5%</div>
						<p className='text-xs text-muted-foreground'>
							+0.3% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							CPC (Custo por Clique)
						</CardTitle>
						<SquareDashedMousePointer className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>R$ 0.75</div>
						<p className='text-xs text-muted-foreground'>
							-R$ 0.05 em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>ROAS</CardTitle>
						<HandCoins className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>3.2x</div>
						<p className='text-xs text-muted-foreground'>
							+0.4x em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabelas */}
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Top 5 Anúncios por CTR
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Anúncio</TableHead>
									<TableHead>CTR</TableHead>
									<TableHead>Impressões</TableHead>
									<TableHead>Cliques</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className='text-nowrap'>
									<TableCell className='text-nowrap flex items-center gap-2'>
										<Trophy
											size={20}
											className='text-amber-500'
										/>
										Anúncio 1
									</TableCell>
									<TableCell>5.2%</TableCell>
									<TableCell>10,000</TableCell>
									<TableCell>520</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='text-nowrap flex items-center gap-2'>
										<Trophy
											size={20}
											className='text-zinc-400'
										/>
										Anúncio 2
									</TableCell>
									<TableCell>4.8%</TableCell>
									<TableCell>15,000</TableCell>
									<TableCell>720</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='text-nowrap flex items-center gap-2'>
										<Trophy
											size={20}
											className='text-rose-700'
										/>
										Anúncio 3
									</TableCell>
									<TableCell>4.8%</TableCell>
									<TableCell>15,000</TableCell>
									<TableCell>720</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='text-nowrap'>Anúncio 4</TableCell>
									<TableCell>4.8%</TableCell>
									<TableCell>15,000</TableCell>
									<TableCell>720</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='text-nowrap'>Anúncio 5</TableCell>
									<TableCell>4.8%</TableCell>
									<TableCell>15,000</TableCell>
									<TableCell>720</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Top 5 Palavras-Chave por Eficiência
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='text-nowrap'>Palavra-Chave</TableHead>
									<TableHead>CTR</TableHead>
									<TableHead>Conversões</TableHead>
									<TableHead>CPC</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell className='text-nowrap flex items-center gap-2'>
										<Trophy
											size={20}
											className='text-amber-500'
										/>
										marketing digital
									</TableCell>
									<TableCell>4.5%</TableCell>
									<TableCell className='text-center'>50</TableCell>
									<TableCell className='text-nowrap'>R$ 1.20</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='text-nowrap flex items-center gap-2'>
										<Trophy
											size={20}
											className='text-zinc-400'
										/>
										palavra 2
									</TableCell>
									<TableCell>3.8%</TableCell>
									<TableCell className='text-center'>35</TableCell>
									<TableCell>R$ 1.50</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className='text-nowrap flex items-center gap-2'>
										<Trophy
											size={20}
											className='text-rose-700'
										/>
										palavra 3
									</TableCell>
									<TableCell>3.8%</TableCell>
									<TableCell className='text-center'>35</TableCell>
									<TableCell>R$ 1.50</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>palavra 4</TableCell>
									<TableCell>3.8%</TableCell>
									<TableCell className='text-center'>35</TableCell>
									<TableCell>R$ 1.50</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>palavra 5</TableCell>
									<TableCell>3.8%</TableCell>
									<TableCell className='text-center'>35</TableCell>
									<TableCell>R$ 1.50</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
