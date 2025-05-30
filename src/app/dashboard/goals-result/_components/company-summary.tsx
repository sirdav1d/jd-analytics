/** @format */

'use client';

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency';

import { Badge } from '@/components/ui/badge';
import { IGoalTracking } from '@/services/data-services/types';
import { use } from 'react';
import { PieStore } from './charts/pie-store';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ICompanySummary {
	data: Promise<IGoalTracking>;
}

const today = new Date();
const formattedDate = today.toLocaleDateString('pt-BR', {
	month: '2-digit',
	year: '2-digit',
});

export default function CompanySummary({ data }: ICompanySummary) {
	const allData = use(data);
	return (
		<Card className='col-span-full aspect-auto xl:col-span-1 h-full'>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl 2xl:text-2xl'>
					JD INFO
				</CardTitle>
				<p className='text-sm text-muted-foreground'>
					Meta:{' '}
					{allData.companySummary.meta &&
						formatCurrency(allData.companySummary.meta)}
				</p>
			</CardHeader>
			<CardContent className='scale-100 2xl:scale-110 w-full translate-y-12'>
				<PieStore companySummary={allData.companySummary} />
			</CardContent>
			<CardFooter>
				<div className='flex items-start flex-col gap-2'>
					<h3 className='text-sm  text-foreground'>
						Meta Projetada para: {formattedDate}
					</h3>
					{allData.companySummary.forecast > 0 && (
						<div className='flex items-center justify-start w-full gap-5'>
							<p className='text-xl font-semibold text-foreground'>
								{allData.companySummary.forecast &&
									formatCurrency(allData.companySummary.forecast)}
							</p>
							<Badge
								variant={
									allData.companySummary.diffPercent >= 100
										? 'success'
										: 'destructive'
								}>
								{allData.companySummary.diffPercent &&
									allData.companySummary.diffPercent.toFixed(2)}
								%
								{allData.companySummary.diffPercent >= 100 ? (
									<TrendingUp
										size={16}
										className='ml-2'
									/>
								) : (
									<TrendingDown
										size={16}
										className='ml-2'
									/>
								)}
							</Badge>
						</div>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
