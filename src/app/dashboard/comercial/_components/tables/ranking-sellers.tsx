/** @format */

'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import React from 'react';

export default function RankingSellers() {
	const topSalespeople = [
		{
			posicao: 1,
			name: 'Carlos Souza',
			sales: 50,
			revenue: 270000,
			conversion: 80,
		},
		{
			posicao: 2,
			name: 'Ana Rodrigues',
			sales: 45,
			revenue: 235000,
			conversion: 90,
		},
		{
			posicao: 3,
			name: 'Pedro Santos',
			sales: 40,
			revenue: 202000,
			conversion: 70,
		},
		{
			posicao: 4,
			name: 'Juliana Lima',
			sales: 35,
			revenue: 180000,
			conversion: 75,
		},
		{
			posicao: 5,
			name: 'Bianca Martins',
			sales: 30,
			revenue: 160000,
			conversion: 65,
		},
		{
			posicao: 6,
			name: 'Gustavo Ferreira',
			sales: 50,
			revenue: 270000,
			conversion: 74,
		},
		{
			posicao: 7,
			name: 'Fernanda Oliveira',
			sales: 45,
			revenue: 235000,
			conversion: 60,
		},
		{
			posicao: 8,
			name: 'Leonardo Mendes',
			sales: 40,
			revenue: 202000,
			conversion: 55,
		},
		{
			posicao: 9,
			name: 'Thiago Barbosa',
			sales: 35,
			revenue: 180000,
			conversion: 58,
		},
		{
			posicao: 10,
			name: 'Amanda Nogueira',
			sales: 30,
			revenue: 160000,
			conversion: 45,
		},
	];
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
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
							<TableHead className='text-center text-nowrap'>Receita</TableHead>
							<TableHead className='text-center text-nowrap'>
								Ticket Médio
							</TableHead>
							<TableHead className='text-center text-nowrap'>
								Taxa de Conversão
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{topSalespeople.map((salesperson) => {
							const ticketSalesMan = salesperson.revenue / salesperson.sales;
							return (
								<TableRow key={salesperson.name}>
									<TableCell className='flex items-center gap-3'>
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
									<TableCell className='text-sm text-nowrap'>
										{salesperson.name}
									</TableCell>
									<TableCell className='text-center'>
										{salesperson.sales}
									</TableCell>
									<TableCell className='text-center'>
										{salesperson.revenue.toLocaleString('pt-br', {
											currency: 'brl',
											style: 'currency',
										})}
									</TableCell>
									<TableCell className='text-center'>
										{ticketSalesMan.toLocaleString('pt-br', {
											currency: 'brl',
											style: 'currency',
										})}
									</TableCell>
									<TableCell className='text-center'>
										{salesperson.conversion}%
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
