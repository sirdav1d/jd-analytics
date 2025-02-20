/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/format-currency';
import { PieStore } from './charts/pie-store';

export default function SalesmanList() {
	const vendedoresData = [
		{
			name: 'PAULO',
			meta: 143000,
			realizado: 137761.22,
			percentual: 96,
			metaProjetada: 275522.44,
			metaProjetadaPercentual: 193,
		},
		{
			name: 'WELITON',
			meta: 120000,
			realizado: 35405.01,
			percentual: 30,
			metaProjetada: 70810.02,
			metaProjetadaPercentual: 59,
		},
		{
			name: 'LUCAS SILVEIRA',
			meta: 55000,
			realizado: 18372.6,
			percentual: 33,
			metaProjetada: 55117.8,
			metaProjetadaPercentual: 100,
		},
		{
			name: 'B2B JOYCE',
			meta: 90000,
			realizado: 20222.1,
			percentual: 22,
			metaProjetada: 60666.3,
			metaProjetadaPercentual: 67,
		},
	];
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4  gap-5'>
			{vendedoresData.map((vendedor, index) => (
				<Card key={index}>
					<CardHeader>
						<CardTitle className='text-lg font-bold'>{vendedor.name}</CardTitle>
						<p className='text-sm text-muted-foreground'>
							META - {formatCurrency(vendedor.meta)}
						</p>
						<p className='text-xs text-muted-foreground'>ABERTAS + FECHADAS</p>
					</CardHeader>
					<CardContent>
						<PieStore />

						<div className='flex flex-col gap-2 mt-8'>
							<span className='font-bold text-sm'>META PROJETADA</span>
							<div className='flex gap-4'>
								<span className='font-bold text-sm'>
									{formatCurrency(vendedor.metaProjetada)}
								</span>
								<span> {vendedor.metaProjetadaPercentual}%</span>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
