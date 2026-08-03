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
import { TablePagination } from '@/components/ui/table-pagination';
import { useClientPagination } from '@/hooks/use-client-pagination';
import { formatRoas, type RoasValue } from './roas-value';

type MarketingGoalHistoryItem = {
	goalDateRef: string;
	faturamento: number;
	custo: number;
	roasAtingido: RoasValue;
	roas: number;
};

type MarketingGoalsResponse = {
	ok: boolean;
	data: MarketingGoalHistoryItem[] | null;
	error?: string | null;
};

export default function HistoryMarketingGoals({
	data,
}: {
	data: Promise<MarketingGoalsResponse>;
}) {
	const allData = use(data);

	const history = allData.data ?? [];
	const {
		pageIndex,
		pageSize,
		pageCount,
		pageItems,
		setPageIndex,
		setPageSize,
	} = useClientPagination(history);

	if (!allData.data || !allData.ok) {
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
									{pageItems.map((item) => {
										return (
											<TableRow key={item.goalDateRef}>
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
													{formatRoas(item.roasAtingido)}
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
						<TablePagination
							pageIndex={pageIndex}
							pageSize={pageSize}
							pageCount={pageCount}
							totalItems={history.length}
							onPageChange={setPageIndex}
							onPageSizeChange={setPageSize}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
