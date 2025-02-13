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

// Import the chart components
import { refreshAccessTokenAction } from '@/actions/google/refresh-token';
import GoogleLoginButton from '@/components/google-login-button';
import { getAnalyticsData } from '@/utils/get-analytics-data';
import {
	BookUser,
	CheckCircle,
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
	UserRoundPlus,
} from 'lucide-react';
import { CampagnComponent } from './_components/charts/campaings';
import { ConversionsComponent } from './_components/charts/conversion';
import { RevenueComponent } from './_components/charts/revenueByChannel';
import { TrafficComponent } from './_components/charts/traffic';
import Filters from './_components/filters';
import { formatDuration } from '@/utils/normalize-duration-session';
import { calculatePagesPerSession } from '@/utils/calculate-pages-per-session';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MarketingPage(props: {
	searchParams: SearchParams;
}) {
	const searchParams = await props.searchParams;
	const startDate = searchParams.startDate || '7daysAgo';
	const endDate = searchParams.endDate || 'today';

	const { success, error } = await refreshAccessTokenAction();
	if (!success) {
		console.log('Erro ao atualizar token:', error);
		return (
			<div className='w-full mx-auto space-y-4 pb-5'>
				Erro ao carregar os dados. Tente novamente.
			</div>
		);
	}
	const { data } = await getAnalyticsData(String(startDate), String(endDate));

	return (
		<div className='w-full mx-auto space-y-4 pb-5'>
			{/* <pre>{data ? JSON.stringify(data, null, 2) : null}</pre> */}
			{/* Filtros */}
			<div className='w-full flex justify-center md:justify-start flex-wrap gap-4 mb-4'>
				<Filters />
				{data.ok ? (
					<p className='dark:text-emerald-400 text-emerald-500 flex gap-1.5 items-center text-center text-sm md:text-base font-medium'>
						<CheckCircle size={16} />
						Dados Sincronizados Com Google API
					</p>
				) : (
					<GoogleLoginButton />
				)}
			</div>
			{/* KPIs Principais */}
			<Card className='xl:hidden'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Faturamento Total
					</CardTitle>
					<DollarSign className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						R$ {data.data.purchaseRevenue}
					</div>
					<p className='text-xs text-muted-foreground'>
						+20% em relação ao mês anterior
					</p>
				</CardContent>
			</Card>
			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
				<Card className='hidden xl:block'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Faturamento Total
						</CardTitle>
						<DollarSign className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							R$ {data.data.purchaseRevenue}
						</div>
						<p className='text-xs text-muted-foreground'>
							+20% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Faturamento de Eccomerce
						</CardTitle>
						<DollarSign className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							R$ {data.data.purchaseRevenue}
						</div>
						<p className='text-xs text-muted-foreground'>
							+20% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Faturamento de Loja Física Via Tráfego
						</CardTitle>
						<DollarSign className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							R$ {data.data.purchaseRevenue}
						</div>
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
						<div className='text-2xl font-bold'>{data.data.sessions}</div>
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
						<div className='text-2xl font-bold'>{data.data.totalUsers}</div>
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
						<div className='text-2xl font-bold'>
							{data.data.sessionConversionRate}%
						</div>
						<p className='text-xs text-muted-foreground'>
							+0.5% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Taxa de Rejeição
						</CardTitle>
						<GitPullRequestClosed className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{Number(data.data.bounceRate).toFixed(2)}%
						</div>
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
						<div className='text-2xl font-bold'>
							{formatDuration(data.data.averageSessionDuration)}
						</div>
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
						<div className='text-2xl font-bold'>
							{calculatePagesPerSession(
								Number(data.data.sessions),
								Number(data.data.screenPageViews),
							).toFixed(2)}
						</div>
						<p className='text-xs text-muted-foreground'>
							+0.2 em relação ao mês anterior
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
			<div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							CTR (Taxa de Cliques)
						</CardTitle>
						<MousePointerClick className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>15%</div>
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
				</Card>{' '}
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							CPA (Custo por Aquisição de Cliente)
						</CardTitle>
						<UserRoundPlus className='h-4 w-4 text-primary' />
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
