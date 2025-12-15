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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { DatabaseBackup } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MetaInvestmentForm from './_components/meta-investment-form';

const currency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

const safeFormatDate = (dateStr: string) => {
	if (!dateStr) return '--/--';
	const d = new Date(dateStr);
	if (Number.isNaN(d.getTime())) return '--/--';
	// usa componentes UTC para evitar recuar um dia em dev por fuso local
	const day = String(d.getUTCDate()).padStart(2, '0');
	const month = String(d.getUTCMonth() + 1).padStart(2, '0');
	return `${day}/${month}`;
};

export default async function MetaInvestmentsPage() {
	const base = process.env.NEXT_PUBLIC_API_URL ?? '';
	const res = await fetch(`${base}/api/services/meta-investments`, {
		cache: 'no-store',
	});

	if (!res.ok) {
		throw new Error('Falha ao carregar investimentos');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = (await res.json()) as { data: any };
	const investments = Array.isArray(data) ? data : data ? [data] : [];

	const last = investments[0];

	return (
		<div className='w-full mx-auto space-y-5 pb-5'>
			<div className='flex max-sm:flex-col items-start gap-20 mt-5'>
				<Card>
					<CardHeader>
						<CardTitle className='text-lg'>Registrar investimento</CardTitle>
						{last && (
							<p className='text-sm text-muted-foreground'>
								Ultima atualização:{' '}
								{format(new Date(last.lastSyncAt), "dd 'de' MMMM 'às' HH:mm", {
									locale: ptBR,
								})}{' '}
							</p>
						)}
					</CardHeader>
					<CardContent>
						<MetaInvestmentForm />
					</CardContent>
				</Card>

				<Accordion
					type='single'
					collapsible
					className='w-full '>
					<AccordionItem
						value='investments-history'
						className='border-none'>
						<AccordionTrigger>
							<h2 className='font-bold text-xl flex items-center gap-2'>
								<DatabaseBackup size={20} />
								Historico de investimentos
							</h2>
						</AccordionTrigger>
						<AccordionContent>
							<div className='border rounded-md'>
								{investments.length === 0 ? (
									<p className='text-sm text-muted-foreground p-4'>
										Nenhum investimento registrado ainda.
									</p>
								) : (
									<Table
										className='rounded-md'
										title='Historico de investimentos'>
										<TableHeader className='bg-secondary'>
											<TableRow className='bg-secondary text-foreground'>
												<TableHead className='bg-secondary text-foreground'>
													Periodo
												</TableHead>
												<TableHead className='text-nowrap text-center text-foreground'>
													Valor acumulado
												</TableHead>
												<TableHead className='text-nowrap text-center text-foreground'>
													Última atualização
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
														{format(
															new Date(item.lastSyncAt),
															"dd/MM/yyyy 'as' HH:mm",
															{
																locale: ptBR,
															},
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}
