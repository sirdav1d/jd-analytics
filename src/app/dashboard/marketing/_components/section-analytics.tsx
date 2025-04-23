/** @format */

import analytics from '@/assets/analytics.svg';
import GoogleLoginButton from '@/components/google-login-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FetchAnalyticsData } from '@/services/google-services/get-analytics-data';
import { calculatePagesPerSession } from '@/utils/calculate-pages-per-session';
import { formatDuration } from '@/utils/normalize-duration-session';
import {
	BookUser,
	Clock,
	DollarSign,
	GitPullRequestClosed,
	MonitorPlay,
	Percent,
	UserRoundCheck,
} from 'lucide-react';
import Image from 'next/image';
import { ConversionsComponent } from './charts/conversion';
import { TrafficComponent } from './charts/traffic';
import Filters from '@/app/dashboard/marketing/_components/filters';

interface SectionAnalyticsProps {
	startDate: string | string[];
	endDate: string | string[];
	channel: string | string[];
}

export default async function SectionAnalytics({
	channel,
	endDate,
	startDate,
}: SectionAnalyticsProps) {
	const channelFilter = channel ?? 'all';

	const responseAnalytics = await FetchAnalyticsData(
		String(startDate),
		String(endDate),
		String(channelFilter),
	);

	if (!responseAnalytics.ok || !responseAnalytics.data) {
		console.log(responseAnalytics.error);
		return (
			<div className='w-full mx-auto space-y-4 pb-5'>
				<GoogleLoginButton />
			</div>
		);
	}

	const staticData = responseAnalytics.data[0];
	const trafficData = responseAnalytics.data[1];
	const channelData = responseAnalytics.data[2];
	return (
		<div className='grid gap-5 mb-20'>
			<div className='w-full flex flex-col-reverse md:flex-row items-center justify-center md:justify-start flex-wrap gap-5'>
				<Filters
					key={'analytics'}
					data={[]}
				/>

				<div className='flex items-center gap-2 scale-110 md:scale-100'>
					<Image
						src={analytics}
						alt='Logo Google Analytics'
						height={24}
						width={24}
					/>
					<h2 className='font-semibold text-sm'>Google Analytics</h2>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
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
								Social={Number(trafficData['Organic Social'])}
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
								Social={channelData['Organic Social']}
							/>
						) : (
							<div className='flex items-center italic text-muted-foreground'>
								Nenhum Valor Encontrado
							</div>
						)}
					</CardContent>
				</Card>
			</div>
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
				<Card className='opacity-50'>
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
						<div className='text-2xl font-bold'>Entrada Manual</div>
						<p className='text-xs text-muted-foreground'>Entrada Manual</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Sessões</CardTitle>
						<MonitorPlay className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{Number(staticData.sessions).toLocaleString('pt-BR')}
						</div>
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
							{Number(staticData.totalUsers).toLocaleString('pt-BR') ?? 0}
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
								? Number(staticData.sessionConversionRate * 100).toFixed(2)
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
								? Number(staticData.bounceRate * 100).toFixed(2)
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
									)
								: 0}
						</div>
						<p className='text-xs text-muted-foreground'>
							+0.2 em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
