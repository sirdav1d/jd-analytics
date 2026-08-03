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
import { format, isValid, parseISO } from 'date-fns';
import { TablePagination } from '@/components/ui/table-pagination';
import { useClientPagination } from '@/hooks/use-client-pagination';

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

const formatMonthYear = (value: string | Date | null | undefined) => {
	if (!value) {
		return '-';
	}

	const parsed = typeof value === 'string' ? parseISO(value) : value;

	if (!isValid(parsed)) {
		return '-';
	}

	return format(parsed, 'MM/yy');
};

export default function HistoryGoal({ data }: IHistoryData) {
	const allData = use(data);
	const history = Array.isArray(allData?.history) ? allData.history : [];
	const {
		pageIndex,
		pageSize,
		pageCount,
		pageItems,
		setPageIndex,
		setPageSize,
	} = useClientPagination(history);

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
				{pageItems.map((item) => {
					return (
						<AccordionItem
							key={item.month}
							value={item.month}>
							<AccordionTrigger>
								{formatMonthYear(item?.month)}
							</AccordionTrigger>
							<AccordionContent>
								<Table title={`Meta do mês ${formatMonthYear(item.month)}`}>
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
										{item.goals.map((goal) => {
											return (
												<TableRow key={`${item.month}-${goal.sellerName}`}>
													<TableCell className='text-nowrap'>
														{formatMonthYear(item.month)}
													</TableCell>
													<TableCell className='text-nowrap'>
														{goal.sellerName}
													</TableCell>
													<TableCell className='text-nowrap'>
														{goal.revenue.toLocaleString('pt-br', {
															style: 'currency',
															currency: 'brl',
														})}
													</TableCell>
													<TableCell className='text-nowrap text-center'>
														{goal.realized.toLocaleString('pt-br', {
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
					);
					})}
			</Accordion>
			<TablePagination
				pageIndex={pageIndex}
				pageSize={pageSize}
				pageCount={pageCount}
				totalItems={history.length}
				onPageChange={setPageIndex}
				onPageSizeChange={setPageSize}
			/>
		</div>
	);
}
