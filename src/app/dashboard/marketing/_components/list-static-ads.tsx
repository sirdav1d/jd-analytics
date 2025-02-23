/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	MousePointerClick,
	SquareDashedMousePointer,
	UserRoundPlus,
	HandCoins,
} from 'lucide-react';
import React from 'react';

export default function ListStaticADS() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						CTR (Taxa de Cliques)
					</CardTitle>
					<MousePointerClick className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>15%</div>
					<p className='text-xs text-muted-foreground'>
						+0.3% em relação ao mês anterior
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						CPC (Custo por Clique)
					</CardTitle>
					<SquareDashedMousePointer className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>R$ 0.75</div>
					<p className='text-xs text-muted-foreground'>
						-R$ 0.05 em relação ao mês anterior
					</p>
				</CardContent>
			</Card>{' '}
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						CPA (Custo por Aquisição de Cliente)
					</CardTitle>
					<UserRoundPlus className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>R$ 0.75</div>
					<p className='text-xs text-muted-foreground'>
						-R$ 0.05 em relação ao mês anterior
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>ROAS</CardTitle>
					<HandCoins className='h-4 w-4 text-primary' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>3.2x</div>
					<p className='text-xs text-muted-foreground'>
						+0.4x em relação ao mês anterior
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
