/** @format */

'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { DatabaseBackup } from 'lucide-react';
import React, { use } from 'react';

interface IHistory {
	month: string;
	goals: {
		sellerName: string;
		revenue: number;
		realized: number;
	}[];
}

interface IHistoryGoal {
	history: IHistory[];
}

interface IHistoryData {
	data: Promise<IHistoryGoal>;
}

const months = [
	{ id: 1, month: 'Janeiro' },
	{ id: 2, month: 'Fevereiro' },
	{ id: 3, month: 'Março' },
	{ id: 4, month: 'Abril' },
	{ id: 5, month: 'Maio' },
	{ id: 6, month: 'Junho' },
	{ id: 7, month: 'Julho' },
	{ id: 8, month: 'Agosto' },
	{ id: 9, month: 'Setembro' },
	{ id: 10, month: 'Outubro' },
	{ id: 11, month: 'Novembro' },
	{ id: 12, month: 'Dezembro' },
];

export default function HistoryGoal({ data }: IHistoryData) {
	const allData = use(data);
	const history = allData.history;

	console.log(history);
	return (
		<div className='flex flex-col gap-5'>
			<h2 className='font-bold text-xl flex items-center gap-2'>
				<DatabaseBackup size={20} />
				Histórico de metas
			</h2>
			<Accordion
				type='single'
				collapsible
				className='w-full'>
				{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
				{history.map((item: any, index: number) => {
					return (
						index < history.length - 1 && (
							<AccordionItem
								key={index}
								value={`item-${index}`}>
								<AccordionTrigger>{months[index].month}</AccordionTrigger>
								<AccordionContent>
									<Table title={`Meta do mês ${item.month}`}>
										<TableHeader>
											<TableRow className='bg-secondary'>
												<TableHead className='text-foreground font-semibold'>
													Data
												</TableHead>
												<TableHead className='text-foreground font-semibold text-nowrap'>
													Nome
												</TableHead>
												<TableHead className='text-foreground font-semibold text-nowrap'>
													Meta de Faturamento
												</TableHead>
												<TableHead className='text-nowrap text-center text-foreground font-semibold'>
													Faturamento realizado
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody className='border rounded-xl'>
											{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
											{item.goals.map((item: any, index: number) => {
												return (
													<TableRow key={index}>
														<TableCell className='text-nowrap'>
															{item.month}
														</TableCell>
														<TableCell className='text-nowrap'>
															{item.sellerName}
														</TableCell>
														<TableCell className='text-nowrap'>
															{item.revenue.toLocaleString('pt-br', {
																style: 'currency',
																currency: 'brl',
															})}
														</TableCell>
														<TableCell className='text-nowrap text-center'>
															{item.realized.toLocaleString('pt-br', {
																style: 'currency',
																currency: 'brl',
															})}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</AccordionContent>
							</AccordionItem>
						)
					);
				})}
			</Accordion>
		</div>
	);
}
