/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { DatabaseBackup } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { prisma } from '@/lib/prisma';
import MetaInvestmentForm from './meta-investment-form';
import MetaInvestmentsTable from './meta-investments-table';

export default async function MetaInvestmentsSection() {
	const persistedInvestments = await prisma.metaInvestment.findMany({
		orderBy: { periodStart: 'desc' },
	});
	const investments = persistedInvestments.map((investment) => ({
		...investment,
		periodStart: investment.periodStart.toISOString(),
		periodEnd: investment.periodEnd.toISOString(),
		lastSyncAt: investment.lastSyncAt.toISOString(),
		createdAt: investment.createdAt.toISOString(),
		updatedAt: investment.updatedAt.toISOString(),
	}));

	const last = investments[0];

	return (
		<div className='flex max-sm:flex-col items-start gap-20 mt-5'>
			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>Registrar investimento</CardTitle>
					{last && (
						<p className='text-sm text-muted-foreground'>
							Última atualização:{' '}
							{format(new Date(last.lastSyncAt), "dd 'de' MMMM 'as' HH:mm", {
								locale: ptBR,
							})}
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
							Histórico de investimentos
						</h2>
					</AccordionTrigger>
					<AccordionContent>
						<div className='border rounded-md'>
							<MetaInvestmentsTable investments={investments} />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
