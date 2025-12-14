/** @format */

'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type RoasBreakdown = {
	meta: number;
	centroProdutos: number;
	icaraiServicos: number;
	faturamentoTotal: number;
	roasGeral: number;
};

interface Props {
	startDate: string;
	endDate: string;
	data: RoasBreakdown;
}

const currency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

export function RoasGeneralCard({ startDate, endDate, data }: Props) {
	const start = new Date(startDate);
	const end = new Date(endDate);

	const periodHeader = `RELATÓRIO MARKETING ${format(start, 'dd', {
		locale: ptBR,
	})} A ${format(end, 'dd', { locale: ptBR })} ${format(end, 'MMM', {
		locale: ptBR,
	}).toUpperCase()}/${format(end, 'yy', { locale: ptBR })}`;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Card className='cursor-pointer hover:shadow-lg transition-all'>
					<CardHeader>
						<CardTitle>ROAS GERAL</CardTitle>
						<CardDescription>Clique para ver o cálculo e o período</CardDescription>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-semibold'>
							{data.roasGeral.toLocaleString('pt-BR', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
							x
						</p>
						<p className='text-sm text-muted-foreground'>
							Período: {format(start, 'dd/MM', { locale: ptBR })} -{' '}
							{format(end, 'dd/MM', { locale: ptBR })}
						</p>
					</CardContent>
				</Card>
			</DialogTrigger>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle className='text-lg'>{periodHeader}</DialogTitle>
				</DialogHeader>
				<div className='space-y-2 text-sm'>
					<div>
						<p className='font-semibold'>INVESTIMENTOS</p>
						<ul className='mt-1 space-y-1'>
							<li>META: {currency.format(data.meta)}</li>
							<li>GOOGLE CENTRO/PRODUTOS: {currency.format(data.centroProdutos)}</li>
							<li>GOOGLE ICARAÍ/SERVIÇOS: {currency.format(data.icaraiServicos)}</li>
						</ul>
					</div>
					<p className='font-semibold'>
						FATURAMENTO TOTAL: {currency.format(data.faturamentoTotal)}
					</p>
					<p className='font-semibold'>
						ROAS GERAL:{' '}
						{data.roasGeral.toLocaleString('pt-BR', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</p>
				</div>
				<DialogClose asChild>
					<Button variant='secondary' className='mt-4 w-full'>
						Fechar
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
