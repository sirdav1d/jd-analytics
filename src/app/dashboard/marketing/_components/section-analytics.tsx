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
import FilterAnalytics from './filter-analytics';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
	const totalUsers = (Object.values(trafficData) as number[]).reduce(
		(acc: number, value: number) => acc + value,
		0,
	);

	return (
		<div className='grid gap-5'>
			<div className='w-full flex flex-col items-center justify-center md:items-start flex-wrap gap-5'>
				<FilterAnalytics />
				<Separator className='w-full' />
				<div className='flex items-center gap-2  xl:mx-0 mx-auto justify-center scale-110 md:scale-100'>
					<Image
						src={analytics}
						alt='Logo Google Analytics'
						height={24}
						width={24}
					/>
					<h2 className='font-semibold text-sm'>Google Analytics</h2>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-5'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Distribuição de Tráfego - {totalUsers.toLocaleString('pt-br')}{' '}
							Usuários
						</CardTitle>
					</CardHeader>
					<CardContent>
						{trafficData ? (
							<TrafficComponent
								Organico={trafficData['Organic Search']}
								referral={trafficData.Referral}
								Pago={trafficData['Paid Search']}
								Social={trafficData['Organic Social']}
								Direto={trafficData.Direct}
								nAtribuido={trafficData.Unassigned}
								crossNetwork={trafficData['Cross-network']}
								shopping={trafficData['Organic Shopping']}
								video={trafficData['Organic Video']}
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
								Organico={channelData['Organic Search']}
								referral={channelData.Referral}
								Pago={channelData['Paid Search']}
								Social={channelData['Organic Social']}
								Direto={channelData.Direct}
								nAtribuido={channelData.Unassigned}
								crossNetwork={channelData['Cross-network']}
								shopping={channelData['Organic Shopping']}
								video={channelData['Organic Video']}
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
							? Number(staticData.purchaseRevenue.valorAtual).toLocaleString(
									'pt-br',
									{
										style: 'currency',
										currency: 'brl',
									},
								)
							: 0}
					</div>
					<p className='text-xs text-muted-foreground'>
						{staticData.purchaseRevenue
							? Number(staticData.purchaseRevenue.valorAnterior).toLocaleString(
									'pt-br',
									{
										style: 'currency',
										currency: 'brl',
									},
								)
							: 0}
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{staticData.purchaseRevenue
								? Number(staticData.purchaseRevenue.valorAtual).toLocaleString(
										'pt-br',
										{
											style: 'currency',
											currency: 'brl',
										},
									)
								: 0}
							<Badge
								variant={
									staticData.purchaseRevenue.diferenca > 0
										? 'success'
										: 'destructive'
								}>
								{staticData.purchaseRevenue.percentual}
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							Valor no mês anterior{' '}
							{staticData.purchaseRevenue
								? Number(
										staticData.purchaseRevenue.valorAnterior,
									).toLocaleString('pt-br', {
										style: 'currency',
										currency: 'brl',
									})
								: 0}
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{staticData.purchaseRevenue
								? Number(staticData.purchaseRevenue.valorAtual).toLocaleString(
										'pt-br',
										{
											style: 'currency',
											currency: 'brl',
										},
									)
								: 0}
							<Badge
								variant={
									staticData.purchaseRevenue.diferenca > 0
										? 'success'
										: 'destructive'
								}>
								{staticData.purchaseRevenue.percentual}
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							Valor no mês anterior{' '}
							{staticData.purchaseRevenue
								? Number(
										staticData.purchaseRevenue.valorAnterior,
									).toLocaleString('pt-br', {
										style: 'currency',
										currency: 'brl',
									})
								: 0}
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{Number(staticData.sessions.valorAtual).toLocaleString('pt-BR')}
							<Badge
								variant={
									staticData.sessions.diferenca > 0 ? 'success' : 'destructive'
								}>
								{staticData.sessions.percentual}
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							Valor no mês anterior{' '}
							{staticData.sessions
								? Number(staticData.sessions.valorAnterior).toLocaleString(
										'pt-BR',
									)
								: 0}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>
							Usuários únicos
						</CardTitle>
						<UserRoundCheck className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold flex items-center gap-3'>
							{Number(staticData.totalUsers.valorAtual).toLocaleString(
								'pt-BR',
							) ?? 0}
							<Badge
								variant={
									staticData.totalUsers.diferenca > 0
										? 'success'
										: 'destructive'
								}>
								{staticData.totalUsers.percentual}
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							Valor no mês anterior{' '}
							{staticData.totalUsers
								? Number(staticData.totalUsers.valorAnterior).toLocaleString(
										'pt-BR',
									)
								: 0}
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{staticData.sessionConversionRate
								? Number(
										staticData.sessionConversionRate.valorAtual * 10000,
									).toFixed(2)
								: 0}
							%
							<Badge
								variant={
									staticData.sessionConversionRate.diferenca > 0
										? 'success'
										: 'destructive'
								}>
								{staticData.sessionConversionRate.percentual}
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							Valor no mês anterior{' '}
							{staticData.sessionConversionRate
								? Number(
										staticData.sessionConversionRate.valorAnterior * 10000,
									).toFixed(2)
								: 0}
							%
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{staticData.bounceRate
								? Number(staticData.bounceRate.valorAtual * 100).toFixed(2)
								: 0}
							%{' '}
							<Badge
								variant={
									staticData.bounceRate.diferenca > 0 ? 'success' : 'success'
								}>
								{staticData.bounceRate.percentual}
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							Valor no mês anterior{' '}
							{staticData.bounceRate
								? Number(staticData.bounceRate.valorAnterior * 100).toFixed(2)
								: 0}
							%
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{staticData.averageSessionDuration
								? formatDuration(
										Number(staticData.averageSessionDuration.valorAtual),
									)
								: 0}{' '}
							<Badge
								variant={
									staticData.averageSessionDuration.diferenca > 0
										? 'success'
										: 'destructive'
								}>
								{staticData.averageSessionDuration.percentual}
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Valor no mês anterior{' '}
							{staticData.averageSessionDuration
								? formatDuration(
										Number(staticData.averageSessionDuration.valorAnterior),
									)
								: 0}
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{staticData.sessions && staticData.screenPageViews
								? calculatePagesPerSession(
										Number(staticData.sessions.valorAtual),
										Number(staticData.screenPageViews.valorAtual),
									).toFixed(2)
								: 0}
							<Badge
								variant={
									calculatePagesPerSession(
										Number(staticData.sessions.valorAtual),
										Number(staticData.screenPageViews.valorAtual),
									) >
									calculatePagesPerSession(
										Number(staticData.sessions.valorAnterior),
										Number(staticData.screenPageViews.valorAnterior),
									)
										? 'success'
										: 'destructive'
								}>
								{(
									((calculatePagesPerSession(
										Number(staticData.sessions.valorAtual),
										Number(staticData.screenPageViews.valorAtual),
									) -
										calculatePagesPerSession(
											Number(staticData.sessions.valorAnterior),
											Number(staticData.screenPageViews.valorAnterior),
										)) /
										calculatePagesPerSession(
											Number(staticData.sessions.valorAnterior),
											Number(staticData.screenPageViews.valorAnterior),
										)) *
									100
								).toFixed(2)}
								%
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground'>
							Valor no mês anterior{' '}
							{staticData.sessions && staticData.screenPageViews
								? calculatePagesPerSession(
										Number(staticData.sessions.valorAnterior),
										Number(staticData.screenPageViews.valorAnterior),
									).toFixed(2)
								: 0}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
