/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency';
import {
	Coins,
	Landmark,
	MonitorPlay,
	MousePointerClick,
	SquareDashedMousePointer,
	UserRoundPlus,
} from 'lucide-react';

interface ListStaticADSProps {
	impressions: number;
	clicks: number;
	cost_micros: number;
	ctr: number;
}

export default function ListStaticADS({
	impressions,
	clicks,
	cost_micros,
	ctr,
}: ListStaticADSProps) {
	const cpc = cost_micros / 1000000 / clicks;
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Investimento</CardTitle>
						<Landmark className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{formatCurrency(cost_micros / 1000000)}
						</div>
						<p className='text-xs text-muted-foreground'>
							-R$ 0.05 em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card className='opacity-50'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>ROAS</CardTitle>
						<Coins className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>Entrada Manual</div>
						<p className='text-xs text-muted-foreground'>Entrada Manual</p>
					</CardContent>
				</Card>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Impressões</CardTitle>
						<MonitorPlay className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{impressions ? impressions.toLocaleString('pt-BR') : 0}
						</div>
						<p className='text-xs text-muted-foreground'>
							-R$ 0.05 em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Cliques</CardTitle>
						<SquareDashedMousePointer className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>
							{clicks ? clicks.toLocaleString('pt-BR') : 0}
						</div>
						<p className='text-xs text-muted-foreground'>
							-R$ 0.05 em relação ao mês anterior
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
						<div className='text-2xl font-bold'>{(ctr * 100).toFixed(2)}%</div>
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
						<UserRoundPlus className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{formatCurrency(cpc)}</div>
						<p className='text-xs text-muted-foreground'>
							-R$ 0.05 em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				{/* <Card
				aria-disabled
				className='opacity-50'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>ROAS</CardTitle>
					<HandCoins className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>Entrada Manual</div>
					<p className='text-xs text-muted-foreground'>Entrada Manual</p>
				</CardContent>
			</Card> */}
			</div>
		</>
	);
}
