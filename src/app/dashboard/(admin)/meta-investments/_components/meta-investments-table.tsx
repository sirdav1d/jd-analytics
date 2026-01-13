/** @format */

'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import type { MetaInvestment } from '@/lib/api/meta-investments';
import MetaInvestmentForm from './meta-investment-form';

const currency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

const safeFormatDate = (dateStr: string) => {
	if (!dateStr) return '--/--';
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return '--/--';
	const day = String(d.getUTCDate()).padStart(2, '0');
	const month = String(d.getUTCMonth() + 1).padStart(2, '0');
	return `${day}/${month}`;
};

interface MetaInvestmentsTableProps {
	investments: MetaInvestment[];
}

export default function MetaInvestmentsTable({
	investments,
}: MetaInvestmentsTableProps) {
	const [openId, setOpenId] = useState<string | null>(null);

	if (!investments || investments.length === 0) {
		return (
			<p className='text-sm text-muted-foreground p-4'>
				Nenhum investimento registrado ainda.
			</p>
		);
	}

	return (
		<Table
			className='rounded-md'
			title='Histórico de investimentos'>
			<TableHeader className='bg-secondary'>
				<TableRow className='bg-secondary text-foreground'>
					<TableHead className='bg-secondary text-foreground'>
						Período
					</TableHead>
					<TableHead className='text-nowrap text-center text-foreground'>
						Valor acumulado
					</TableHead>
					<TableHead className='text-nowrap text-center text-foreground'>
						Última atualização
					</TableHead>
					<TableHead className='text-nowrap text-center text-foreground'>
						Ações
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{investments.map((item) => (
					<TableRow key={item.id}>
						<TableCell className='text-nowrap'>
							{safeFormatDate(item.periodStart)} -{' '}
							{safeFormatDate(item.periodEnd)}
						</TableCell>
						<TableCell className='text-nowrap text-center'>
							{currency.format(item.totalInvestment)}
						</TableCell>
						<TableCell className='text-nowrap text-center'>
							{format(new Date(item.lastSyncAt), "dd/MM/yyyy 'as' HH:mm", {
								locale: ptBR,
							})}
						</TableCell>
						<TableCell className='text-nowrap text-center'>
							<Dialog
								open={openId === item.id}
								onOpenChange={(open) => setOpenId(open ? item.id : null)}>
								<DialogTrigger asChild>
									<Button
										variant='outline'
										size='icon'>
										<Pencil className='h-4 w-4' />
									</Button>
								</DialogTrigger>
								<DialogContent className='sm:max-w-[480px]'>
									<DialogHeader>
										<DialogTitle>Editar investimento</DialogTitle>
										<DialogDescription>
											Ajuste o investimento do período selecionado.
										</DialogDescription>
									</DialogHeader>
									<MetaInvestmentForm
										mode='edit'
										defaultValues={{
											periodEnd: item.periodEnd,
											totalInvestment: item.totalInvestment,
										}}
										onSuccess={() => setOpenId(null)}
									/>
								</DialogContent>
							</Dialog>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
