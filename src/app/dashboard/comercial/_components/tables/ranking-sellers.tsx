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
import { IRankingSellers } from '@/services/data-services/types';
import { Trophy } from 'lucide-react';
import { use } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RankingSellers({ data }: { data: Promise<any> }) {
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
				<CardTitle className='text-base text-balance md:text-xl'>
					Ranking de Vendedores
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Posição</TableHead>
							<TableHead>Vendedor</TableHead>
							<TableHead className='text-center text-nowrap'>Vendas</TableHead>
							<TableHead className='text-center text-nowrap'>
								Faturamento
							</TableHead>
							<TableHead className='text-center text-nowrap'>
								Ticket Médio
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{allData.data.sellers.map(
							(salesperson: IRankingSellers, index: number) => {
								if (index < 5) {
									return (
										<TableRow key={salesperson.name}>
											<TableCell className='flex items-center gap-3 '>
												{salesperson.posicao}
												{salesperson.posicao == 1 ? (
													<Trophy
														size={20}
														className='text-amber-500'
													/>
												) : salesperson.posicao == 2 ? (
													<Trophy
														size={20}
														className='text-zinc-400'
													/>
												) : salesperson.posicao == 3 ? (
													<Trophy
														size={20}
														className='text-rose-700'
													/>
												) : null}
											</TableCell>
											<TableCell
												title={salesperson.name}
												className='text-xs text-nowrap'>
												{salesperson.name}
											</TableCell>
											<TableCell className='text-sm  text-center'>
												{salesperson.sales.toLocaleString('pt-br')}
											</TableCell>
											<TableCell className='text-xs  text-center'>
												{salesperson.revenue.toLocaleString('pt-br', {
													currency: 'brl',
													style: 'currency',
												})}
											</TableCell>
											<TableCell className='text-xs text-center'>
												{salesperson.avgTicket.toLocaleString('pt-br', {
													currency: 'brl',
													style: 'currency',
												})}
											</TableCell>
										</TableRow>
									);
								}
							},
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
