/** @format */
'use client';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { DatabaseBackup } from 'lucide-react';
import React, { use } from 'react';

export default function HistoryMarketingGoals({
	data,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
}) {
	const allData = use(data);

	const history = allData.data;
	if (!history || !allData.ok) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle> Dados Não Encontrados</CardTitle>
				</CardHeader>
			</Card>
		);
	}
	return (
		<div className='flex flex-col gap-5'>
			<Accordion
				type='single'
				collapsible
				className='w-full'>
				<AccordionItem
					value={`item-1`}
					className='border-none'>
					<AccordionTrigger>
						<h2 className='font-bold text-xl flex items-center gap-2'>
							<DatabaseBackup size={20} />
							Histórico de metas
						</h2>
					</AccordionTrigger>
					<AccordionContent>
						<div className='border rounded-md'>
							<Table
								className='rounded-md'
								title={`Meta de ROAS`}>
								<TableHeader className='bg-secondary'>
									<TableRow className='bg-secondary text-foreground'>
										<TableHead className='bg-secondary text-foreground'>
											Data
										</TableHead>
										<TableHead className='text-nowrap text-center text-foreground'>
											Faturamento
										</TableHead>
										<TableHead className='text-nowrap text-center text-foreground'>
											Investimento
										</TableHead>
										<TableHead className='text-nowrap text-center text-foreground'>
											Roas Atingido
										</TableHead>
										<TableHead className='text-nowrap text-center text-foreground'>
											Meta de ROAS
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
									{history.map((item: any, index: number) => {
										return (
											<TableRow key={index}>
												<TableCell className='text-nowrap '>
													{item.goalDateRef.slice(0, 7)}
												</TableCell>
												<TableCell className='text-nowrap text-center'>
													{item.faturamento.toLocaleString('pt-br', {
														style: 'currency',
														currency: 'brl',
													})}
												</TableCell>
												<TableCell className='text-nowrap text-center'>
													{item.custo.toLocaleString('pt-br', {
														style: 'currency',
														currency: 'brl',
													})}
												</TableCell>
												<TableCell className='text-nowrap text-center'>
													{item.roasAtingido.toFixed(2)}x
												</TableCell>
												<TableCell className='text-nowrap text-center'>
													{item.roas}x
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
