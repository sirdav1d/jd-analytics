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
import { TruncatedText } from '@/components/ui/truncated-text';
import { IRankingSellers } from '@/services/data-services/types';
import { Trophy } from 'lucide-react';
import { use } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RankingSellers({ data }: { data: Promise<any> }) {
	const allData = use(data);

	if (!allData || !allData.ok) {
		return (
			<Card className='col-span-full aspect-auto xl:col-span-1 h-full min-w-0 overflow-hidden'>
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
		<Card className='min-w-0 overflow-hidden'>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-xl'>
					Ranking de Vendedores
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table className='min-w-[36rem] table-fixed md:min-w-0 md:table-auto'>
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
											<TableCell className='max-w-[8rem] min-w-0 text-xs sm:max-w-[14rem] lg:max-w-[18rem]'>
												<TruncatedText value={salesperson.name} />
											</TableCell>
											<TableCell className='text-sm text-center text-nowrap'>
												{salesperson.sales.toLocaleString('pt-br')}
											</TableCell>
											<TableCell className='text-xs text-center text-nowrap'>
												{salesperson.revenue.toLocaleString('pt-br', {
													currency: 'brl',
													style: 'currency',
												})}
											</TableCell>
											<TableCell className='text-xs text-center text-nowrap'>
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
