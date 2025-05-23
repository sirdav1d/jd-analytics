/** @format */

import { Badge } from '@/components/ui/badge';
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

interface DataItem {
	current: number;
	previous: number;
	diff: number;
	percentChange: number;
}

interface ListStaticADSProps {
	impressions: DataItem;
	clicks: DataItem;
	cost_micros: DataItem;
	ctr: DataItem;
}

export default function ListStaticADS({
	impressions,
	clicks,
	cost_micros,
	ctr,
}: ListStaticADSProps) {
	const currentCPC = cost_micros.current / 1000000 / clicks.current;
	const previousCPC = cost_micros.previous / 1000000 / clicks.previous;
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Investimento</CardTitle>
						<Landmark className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold flex items-center gap-3'>
							{formatCurrency(cost_micros.current / 1000000)}
							<Badge
								variant={`${cost_micros.diff < 0 ? 'destructive' : 'success'}`}>
								{cost_micros.percentChange.toFixed(2)}%
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Valor no mês anterior:{' '}
							{formatCurrency(cost_micros.previous / 1000000)}
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
						<p className='text-xs text-muted-foreground mt-1'>Entrada Manual</p>
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
						<div className='text-2xl font-bold  flex items-center gap-3'>
							{impressions ? impressions.current.toLocaleString('pt-BR') : 0}
							<Badge
								variant={`${impressions.diff < 0 ? 'destructive' : 'success'}`}>
								{impressions.percentChange.toFixed(2)}%
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Valor no mês anterior:{' '}
							{impressions.previous.toLocaleString('pt-BR')}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Cliques</CardTitle>
						<SquareDashedMousePointer className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold flex items-center gap-3'>
							{clicks ? clicks.current.toLocaleString('pt-BR') : 0}
							<Badge variant={`${clicks.diff < 0 ? 'destructive' : 'success'}`}>
								{clicks.percentChange.toFixed(2)}%
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Valor no mês anterior: {clicks.previous.toLocaleString('pt-BR')}
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{(ctr.current * 100).toFixed(2)}%{' '}
							<Badge variant={`${ctr.diff < 0 ? 'destructive' : 'success'}`}>
								{ctr.percentChange.toFixed(2)}%
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Valor no mês anterior: {(ctr.previous * 100).toFixed(2)}%
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
						<div className='text-2xl font-bold flex items-center gap-3'>
							{formatCurrency(currentCPC)}
							<Badge
								variant={`${currentCPC - previousCPC >0 ? 'destructive' : 'success'}`}>
								{(((currentCPC - previousCPC) / previousCPC) * 100).toFixed(2)}%
							</Badge>
						</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Valor no mês anterior: {formatCurrency(previousCPC)}
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
