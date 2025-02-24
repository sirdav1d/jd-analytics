/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import the chart components
import GoogleLoginButton from '@/components/google-login-button';
import { FetchADSData } from '@/services/google-services/get-ads-data';
import { FetchAnalyticsData } from '@/services/google-services/get-analytics-data';
import { calculatePagesPerSession } from '@/utils/calculate-pages-per-session';
import { formatDuration } from '@/utils/normalize-duration-session';
import {
	BookUser,
	CheckCircle,
	Clock,
	DollarSign,
	GitPullRequestClosed,
	MonitorPlay,
	Percent,
	UserRoundCheck,
} from 'lucide-react';
import { CampagnComponent } from './_components/charts/campaings';
import { ConversionsComponent } from './_components/charts/conversion';
import { TrafficComponent } from './_components/charts/traffic';
import Filters from './_components/filters';
import ListStaticADS from './_components/list-static-ads';
import TopAdwords from './_components/tables/top-adwords';
import TopAnuncios from './_components/tables/top-anuncios';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MarketingPage(props: {
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
	const channelFilter = searchParams.channel || 'all';

	const responseADS = await FetchADSData(String(startDate), String(endDate));

	const responseAnalytics = await FetchAnalyticsData(
		String(startDate),
		String(endDate),
		String(channelFilter),
	);

	if (
		!responseAnalytics.ok ||
		!responseAnalytics.data ||
		!responseADS.ok ||
		!responseADS.data
	) {
		return (
			<div className='w-full mx-auto space-y-4 pb-5'>
				<GoogleLoginButton />
			</div>
		);
	}

	const staticData = responseAnalytics.data[0];
	const trafficData = responseAnalytics.data[1];
	const channelData = responseAnalytics.data[2];
	const topAds = responseADS.data[1];
	const topKeyWords = responseADS.data[2];

	console.log(responseADS, responseAnalytics);

	return (
		<div className='w-full mx-auto space-y-4 pb-5'>
			<div className='w-full flex justify-center md:justify-start flex-wrap gap-4 mb-4'>
				<Filters />
				<p className='dark:text-emerald-400 text-emerald-500 flex gap-1.5 items-center text-center text-sm md:text-base font-medium'>
					<CheckCircle size={16} />
					Dados Sincronizados Com Google API
				</p>
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
						{staticData.purchaseRevenue
							? Number(staticData.purchaseRevenue).toLocaleString('pt-br', {
									style: 'currency',
									currency: 'brl',
							  })
							: 0}
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
							{staticData.purchaseRevenue
								? Number(staticData.purchaseRevenue).toLocaleString('pt-br', {
										style: 'currency',
										currency: 'brl',
								  })
								: 0}
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
							{staticData.purchaseRevenue
								? Number(staticData.purchaseRevenue).toLocaleString('pt-br', {
										style: 'currency',
										currency: 'brl',
								  })
								: 0}
						</div>
						<p className='text-xs text-muted-foreground'>
							+20% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Faturamento de Loja Física{' '}
							<span className='text-muted-foreground text-xs'>
								(via tráfego)
							</span>
						</CardTitle>
						<DollarSign className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{staticData.purchaseRevenue
								? Number(staticData.purchaseRevenue).toLocaleString('pt-br', {
										style: 'currency',
										currency: 'brl',
								  })
								: 0}
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
						<div className='text-2xl font-bold'>{staticData.sessions ?? 0}</div>
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
						<div className='text-2xl font-bold'>
							{staticData.totalUsers ?? 0}
						</div>
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
							{staticData.sessionConversionRate
								? Number(staticData.sessionConversionRate).toPrecision(2)
								: 0}
							%
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
							{staticData.bounceRate
								? Number(staticData.bounceRate).toPrecision(2)
								: 0}
							%
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
							{staticData.averageSessionDuration
								? formatDuration(Number(staticData.averageSessionDuration))
								: 0}
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
							{staticData.sessions && staticData.screenPageViews
								? calculatePagesPerSession(
										Number(staticData.sessions),
										Number(staticData.screenPageViews),
								  ).toFixed(2)
								: 0}
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
						{trafficData ? (
							<TrafficComponent
								Organico={Number(trafficData['Organic Search'])}
								Pago={Number(trafficData['Paid Search'])}
								Social={Number(trafficData.Social)}
								Direto={Number(trafficData.Direct)}
								Outros={Number(trafficData.Other)}
							/>
						) : (
							<div className='flex items-center italic text-muted-foreground'>
								Nenhum Valor Encontrado
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Performance por Canal de Mídia
						</CardTitle>
					</CardHeader>
					<CardContent>
						{channelData ? (
							<ConversionsComponent
								Organic={channelData['Organic Search']}
								Direct={channelData.Direct}
								Other={channelData.Other}
								Paid={channelData['Paid Search']}
								Social={channelData.Social}
							/>
						) : (
							<div className='flex items-center italic text-muted-foreground'>
								Nenhum Valor Encontrado
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Top 5 Campanhas por Conversão
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CampagnComponent data={responseADS.data[0]} />
				</CardContent>
			</Card>

			{/* GOOGLE ADS */}

			{/* <Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Faturamento por Campanha
					</CardTitle>
				</CardHeader>
				<CardContent>
					<RevenueComponent />
				</CardContent>
			</Card> */}
			{/* Métricas Adicionais */}
			<ListStaticADS />
			{/* Tabelas */}
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
				<TopAnuncios data={topAds} />
				<TopAdwords data={topKeyWords} />
			</div>
		</div>
	);
}
