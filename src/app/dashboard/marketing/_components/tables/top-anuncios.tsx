/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function TopAnuncios() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-base text-balance md:text-2xl'>
					Top 5 Anúncios por CTR
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-left'>Anúncio</TableHead>
							<TableHead className='text-center'>CTR</TableHead>
							<TableHead className='text-center'>Impressões</TableHead>
							<TableHead className='text-center'>Cliques</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow className='text-nowrap text-center'>
							<TableCell className='text-nowrap flex items-center gap-2'>
								<Trophy
									size={20}
									className='text-amber-500'
								/>
								Anúncio 1
							</TableCell>
							<TableCell>5.2%</TableCell>
							<TableCell>10,000</TableCell>
							<TableCell>520</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-nowrap text-left flex items-center gap-2'>
								<Trophy
									size={20}
									className='text-zinc-400'
								/>
								Anúncio 2
							</TableCell>
							<TableCell>4.8%</TableCell>
							<TableCell>15,000</TableCell>
							<TableCell>720</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-nowrap text-left flex items-center gap-2'>
								<Trophy
									size={20}
									className='text-rose-700'
								/>
								Anúncio 3
							</TableCell>
							<TableCell>4.8%</TableCell>
							<TableCell>15,000</TableCell>
							<TableCell>720</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-nowrap text-left'>Anúncio 4</TableCell>
							<TableCell>4.8%</TableCell>
							<TableCell>15,000</TableCell>
							<TableCell>720</TableCell>
						</TableRow>
						<TableRow className='text-center'>
							<TableCell className='text-nowrap text-left'>Anúncio 5</TableCell>
							<TableCell>4.8%</TableCell>
							<TableCell>15,000</TableCell>
							<TableCell>720</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
