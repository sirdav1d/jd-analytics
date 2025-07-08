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
import { PieStore } from './charts/pie-store';
import { Badge } from '@/components/ui/badge';
import { IGoalTracking } from '@/services/data-services/types';
import { use } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface ISalesmanListProps {
	data: Promise<IGoalTracking>;
}
export default function SalesmanList({ data }: ISalesmanListProps) {
	const allData = use(data);
	const today = new Date();
	const formattedDate = today.toLocaleDateString('pt-BR', {
		month: '2-digit',
		year: '2-digit',
	});

	return (
		<div className='grid grid-cols-1 xl:grid-cols-2   gap-5'>
			{allData.overview.map(
				(vendedor, index) =>
					vendedor.meta > 0 && (
						<Card key={index}>
							<CardHeader>
								<CardTitle className='text-base lowercase text-balance lg:text-xl'>
									{vendedor.vendedor}
								</CardTitle>
								<p className='text-sm text-muted-foreground'>
									Meta: {vendedor.meta && formatCurrency(vendedor.meta)}
								</p>
							</CardHeader>
							<CardContent>
								<PieStore
									companySummary={{
										meta: vendedor.meta,
										realizado: vendedor.totalRevenue,
									}}
								/>
							</CardContent>
							<CardFooter>
								<div className='flex items-start flex-col gap-2'>
									<h3 className='text-sm  text-foreground'>
										Meta Projetada para: {formattedDate}
									</h3>
									{vendedor.forecast > 0 ? (
										<div className='flex items-center justify-start w-full gap-5'>
											<p className='text-xl font-semibold text-foreground'>
												{vendedor.forecast && formatCurrency(vendedor.forecast)}
											</p>
											<Badge
												variant={
													vendedor.percentualDif >= 100
														? 'success'
														: 'destructive'
												}>
												{vendedor.percentualDif &&
													vendedor.percentualDif.toFixed(2)}
												%
												{vendedor.percentualDif >= 100 ? (
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
									) : (
										<p>Sem meta definida</p>
									)}
								</div>
							</CardFooter>
						</Card>
					),
			)}
		</div>
	);
}
