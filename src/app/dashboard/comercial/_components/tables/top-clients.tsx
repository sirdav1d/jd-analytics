/** @format */

'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ICustomer } from '@/services/data-services/types';
import { Trophy } from 'lucide-react';
import React, { use } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TopClients({ data }: { data: Promise<any> }) {
	const allData = use(data);

	if (!allData || !allData.ok) {
		return (
			<Card className='col-span-full aspect-auto xl:col-span-1 h-full'>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-xl 2xl:text-2xl'>
						Dados não encontrados
					</CardTitle>
					<CardDescription className='text-sm text-muted-foreground'>
						Atualize a página, ou tente novamente mais tarde.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Top 5 Clientes
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Posição</TableHead>
							<TableHead>Código</TableHead>
							<TableHead>Cliente</TableHead>
							<TableHead className='text-center'>Compras</TableHead>
							<TableHead className='text-center'>Faturamento</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{allData.data.topCustomers.map((customer: ICustomer) => (
							<TableRow key={customer.code}>
								<TableCell className='flex items-center gap-3'>
									{customer.posicao}
									{customer.posicao == 1 ? (
										<Trophy
											size={20}
											className='text-amber-500'
										/>
									) : customer.posicao == 2 ? (
										<Trophy
											size={20}
											className='text-zinc-400'
										/>
									) : customer.posicao == 3 ? (
										<Trophy
											size={20}
											className='text-rose-700'
										/>
									) : null}
								</TableCell>
								<TableCell className='text-sm text-nowrap'>
									{customer.code}
								</TableCell>
								<TableCell className='text-xs text-nowrap'>
									{customer.name.slice(0, 20) + '...'}
								</TableCell>
								<TableCell className='text-center'>
									{customer.purchases.toLocaleString('pt-br')}
								</TableCell>
								<TableCell className=' text-xs text-center'>
									{customer.revenue.toLocaleString('pt-br', {
										currency: 'brl',
										style: 'currency',
									})}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
