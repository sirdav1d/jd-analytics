/** @format */
'use client';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Goal } from 'lucide-react';
import React, { use } from 'react';

export default function BigNumberRoas({
	data,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
}) {
	const allData = use(data);

	const bigNumbersData = allData.bigNumbers;
	if (!bigNumbersData || !allData.ok) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle>Dados Não Encontrados</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className='grid lg:grid-cols-3 gap-5 w-full'>
			<Card>
				<CardHeader>
					<CardTitle className='w-full flex items-center justify-between'>
						{bigNumbersData.metaAtual}x
						<Goal />
					</CardTitle>
					<CardDescription>Meta de ROAS Atual</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className='w-full flex items-center justify-between'>
						{bigNumbersData.roasAtingido.toFixed(2)}x <Goal />
					</CardTitle>
					<CardDescription>ROAS Atingido</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle
						className={`w-full flex items-center justify-between ${bigNumbersData.roasPrevisto < bigNumbersData.metaAtual ? 'text-destructive' : 'text-emerald-500'}`}>
						{bigNumbersData.roasPrevisto.toFixed(2)}x
						<Goal />
					</CardTitle>
					<CardDescription>Previsão de ROAS</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}
