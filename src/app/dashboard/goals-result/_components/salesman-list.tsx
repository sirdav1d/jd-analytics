/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency';
import { PieStore } from './charts/pie-store';
// import { Badge } from '@/components/ui/badge';
// import { ArrowDown, ArrowUp } from 'lucide-react';
import { IOverview } from '@/services/data-services/types';

interface SalesmanListProps {
	sellerData: IOverview[];
}

export default function SalesmanList({ sellerData }: SalesmanListProps) {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3  gap-5'>
			{sellerData.map((vendedor, index) => (
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
						{/* 
						<div className='flex flex-col gap-2'>
							<span className='font-semibold text-sm'>META PROJETADA</span>
							<div className='flex items-center gap-4'>
								<span className='font-bold text-xl'>
									{formatCurrency(vendedor.metaProjetada)}
								</span>

								{vendedor.metaProjetadaPercentual >= 100 ? (
									<Badge
										variant={'success'}
										className='flex items-center gap-2'>
										{vendedor.metaProjetadaPercentual}% <ArrowUp size={12} />
									</Badge>
								) : (
									<Badge variant={'destructive'}>
										<span className='flex items-center gap-2'>
											{vendedor.metaProjetadaPercentual}%{' '}
											<ArrowDown size={12} />
										</span>
									</Badge>
								)}
							</div>
						</div> */}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
