/** @format */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartNoAxesGantt, Copy } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

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

export function RoasGeneralCard({ endDate, data }: Props) {
	const end = useMemo(() => new Date(endDate), [endDate]);
	const start = useMemo(() => {
		const s = new Date(end);
		s.setUTCDate(1);
		s.setUTCHours(12, 0, 0, 0);
		return s;
	}, [end]);

	const periodHeader = `RELATÓRIO MARKETING ${format(start, 'dd', {
		locale: ptBR,
	})} A ${format(end, 'dd', { locale: ptBR })} ${format(end, 'MMM', {
		locale: ptBR,
	}).toUpperCase()}/${format(end, 'yy', { locale: ptBR })}`;

	const copyReport = useCallback(() => {
		const lines = [
			`RELATÓRIO MARKETING ${format(start, 'dd', { locale: ptBR })} A ${format(
				end,
				'dd',
				{ locale: ptBR },
			)} ${format(end, 'MMM', { locale: ptBR }).toUpperCase()}/${format(
				end,
				'yy',
				{
					locale: ptBR,
				},
			)}`,
			'',
			'INVESTIMENTOS',
			`META: ${currency.format(data.meta)}`,
			`GOOGLE CENTRO/PRODUTOS: ${currency.format(data.centroProdutos)}`,
			`GOOGLE ICARAÍ/SERVIÇOS: ${currency.format(data.icaraiServicos)}`,
			`FATURAMENTO TOTAL: ${currency.format(data.faturamentoTotal)}`,
			'',
			`ROAS GERAL: ${data.roasGeral.toLocaleString('pt-BR', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`,
		];
		navigator.clipboard
			.writeText(lines.join('\n'))
			.then(() => toast.success('Relatório copiado'))
			.catch(() => toast.error('Falha ao copiar'));
	}, [data, end, start]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Card className='cursor-pointer hover:ring-1 ring-primary  hover:shadow-lg transition-all'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>ROAS GERAL</CardTitle>
						<ChartNoAxesGantt className='h-4 w-4 text-primary' />
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
				<DialogHeader className='flex  justify-between'>
					<DialogTitle className='text-lg'>{periodHeader}</DialogTitle>
				</DialogHeader>
				<div className='space-y-2 text-sm'>
					<div>
						<p className='font-semibold text-lg mb-3'>INVESTIMENTOS</p>
						<ul className='mt-1 space-y-2 text-sm text-muted-foreground'>
							<li>META: {currency.format(data.meta)}</li>
							<li>
								GOOGLE CENTRO/PRODUTOS: {currency.format(data.centroProdutos)}
							</li>
							<li>
								GOOGLE ICARAÍ/SERVIÇOS: {currency.format(data.icaraiServicos)}
							</li>
						</ul>
					</div>
					<Separator />
					<p className='font-semibold py-3'>
						FATURAMENTO TOTAL: {currency.format(data.faturamentoTotal)}
					</p>
					<Separator />
					<p className='font-semibold pt-3'>
						ROAS GERAL:{' '}
						{data.roasGeral.toLocaleString('pt-BR', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</p>
				</div>
				<div className='flex gap-2 mt-4'>
					<Button
						variant='outline'
						className='w-full gap-2'
						onClick={copyReport}>
						<Copy className='h-4 w-4' />
						Copiar relatório
					</Button>
					<DialogClose asChild>
						<Button
							variant='secondary'
							className='w-full'>
							Fechar
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
