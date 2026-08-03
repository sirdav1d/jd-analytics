/** @format */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency';
import {
	Landmark,
	MonitorPlay,
	MousePointerClick,
	SquareDashedMousePointer,
	TrendingDown,
	TrendingUp,
	UserRoundPlus,
} from 'lucide-react';

interface DataItem {
	current: number;
	previous: number;
	diff: number;
	percentChange: number | null;
}

function formatPercentChange(value: number | null) {
	return value === null ? 'N/A' : `${value.toFixed(2)}%`;
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
	const currentCPC =
		clicks.current > 0 ? cost_micros.current / 1_000_000 / clicks.current : 0;
	const previousCPC =
		clicks.previous > 0
			? cost_micros.previous / 1_000_000 / clicks.previous
			: 0;

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4'>
			<Card className='xl:col-span-3'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Investimento</CardTitle>
					<Landmark className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3'>
						{formatCurrency(cost_micros.current / 1_000_000)}
						<Badge
							variant={
								cost_micros.percentChange === null
									? 'outline'
									: cost_micros.diff > 0
										? 'destructive'
										: 'success'
							}>
							{formatPercentChange(cost_micros.percentChange)}
							{cost_micros.diff < 0 ? (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior:{' '}
						{formatCurrency(cost_micros.previous / 1_000_000)}
					</p>
				</CardContent>
			</Card>

			<Card className='xl:col-span-3'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Impressões</CardTitle>
					<MonitorPlay className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold  flex items-center gap-3'>
						{impressions ? impressions.current.toLocaleString('pt-BR') : 0}
						<Badge
							variant={
								impressions.percentChange === null
									? 'outline'
									: impressions.diff < 0
										? 'destructive'
										: 'success'
							}>
							{formatPercentChange(impressions.percentChange)}
							{impressions.diff < 0 ? (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior:{' '}
						{impressions.previous.toLocaleString('pt-BR')}
					</p>
				</CardContent>
			</Card>

			<Card className='xl:col-span-2'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>Cliques</CardTitle>
					<SquareDashedMousePointer className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3'>
						{clicks ? clicks.current.toLocaleString('pt-BR') : 0}
						<Badge
							variant={
								clicks.percentChange === null
									? 'outline'
									: clicks.diff < 0
										? 'destructive'
										: 'success'
							}>
							{formatPercentChange(clicks.percentChange)}
							{clicks.diff < 0 ? (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior: {clicks.previous.toLocaleString('pt-BR')}
					</p>
				</CardContent>
			</Card>

			<Card className='xl:col-span-2'>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						CTR (Taxa de Cliques)
					</CardTitle>
					<MousePointerClick className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold flex items-center gap-3'>
						{(ctr.current * 100).toFixed(2)}%{' '}
						<Badge
							variant={
								ctr.percentChange === null
									? 'outline'
									: ctr.diff < 0
										? 'destructive'
										: 'success'
							}>
							{formatPercentChange(ctr.percentChange)}
							{ctr.diff < 0 ? (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior: {(ctr.previous * 100).toFixed(2)}%
					</p>
				</CardContent>
			</Card>

			<Card className='xl:col-span-2'>
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
							variant={`${currentCPC - previousCPC > 0 ? 'destructive' : 'success'}`}>
							{previousCPC > 0
								? (
										((currentCPC - previousCPC) / previousCPC) *
										100
									).toFixed(2) + '%'
								: 'N/A'}
							{currentCPC - previousCPC < 0 ? (
								<TrendingDown
									size={16}
									className='ml-2'
								/>
							) : (
								<TrendingUp
									size={16}
									className='ml-2'
								/>
							)}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Valor no mês anterior: {formatCurrency(previousCPC)}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
