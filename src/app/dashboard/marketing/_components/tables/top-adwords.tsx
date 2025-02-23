/** @format */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import React from 'react';

export default function TopAdwords() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Top 5 Palavras-Chave por Eficiência
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-nowrap'>Palavra-Chave</TableHead>
							<TableHead className='text-center'>CTR</TableHead>
							<TableHead className='text-center'>Conversões</TableHead>
							<TableHead className='text-center'>CPC</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow className='text-center'>
							<TableCell className='text-nowrap text-left flex items-center gap-2'>
								<Trophy
									size={20}
									className='text-amber-500'
								/>
								marketing digital
							</TableCell>
							<TableCell>4.5%</TableCell>
							<TableCell className='text-center'>50</TableCell>
							<TableCell className='text-nowrap'>R$ 1.20</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-nowrap text-left flex items-center gap-2'>
								<Trophy
									size={20}
									className='text-zinc-400'
								/>
								palavra 2
							</TableCell>
							<TableCell>3.8%</TableCell>
							<TableCell className='text-center'>35</TableCell>
							<TableCell>R$ 1.50</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-nowrap text-left flex items-center gap-2'>
								<Trophy
									size={20}
									className='text-rose-700'
								/>
								palavra 3
							</TableCell>
							<TableCell>3.8%</TableCell>
							<TableCell className='text-center'>35</TableCell>
							<TableCell>R$ 1.50</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-left'>palavra 4</TableCell>
							<TableCell>3.8%</TableCell>
							<TableCell>35</TableCell>
							<TableCell>R$ 1.50</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-left'>palavra 5</TableCell>
							<TableCell>3.8%</TableCell>
							<TableCell>35</TableCell>
							<TableCell>R$ 1.50</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
