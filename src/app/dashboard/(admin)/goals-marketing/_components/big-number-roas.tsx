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
import { formatRoas, type RoasValue } from './roas-value';

type BigNumbersResponse = {
	ok: boolean;
	bigNumbers: {
		metaAtual: number;
		roasAtingido: RoasValue;
		roasPrevisto: RoasValue;
	} | null;
	error?: string | null;
};

export default function BigNumberRoas({
	data,
}: {
	data: Promise<BigNumbersResponse>;
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
	const forecastColor =
		bigNumbersData.roasPrevisto === null
			? ''
			: bigNumbersData.roasPrevisto < bigNumbersData.metaAtual
				? 'text-destructive'
				: 'text-emerald-500';

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
						{formatRoas(bigNumbersData.roasAtingido)} <Goal />
					</CardTitle>
					<CardDescription>ROAS Atingido</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle
						className={`w-full flex items-center justify-between ${forecastColor}`}>
						{formatRoas(bigNumbersData.roasPrevisto)}
						<Goal />
					</CardTitle>
					<CardDescription>Previsão de ROAS</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}
