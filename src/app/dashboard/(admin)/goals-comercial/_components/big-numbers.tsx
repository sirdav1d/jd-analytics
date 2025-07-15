/** @format */

'use client';

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Coins } from 'lucide-react';
import React, { use } from 'react';

interface BigNumbersProps {
	companyGoal: {
		meta: number;
		realized: number;
		remaining: number;
		predicted: number;
	};
}

export default function BigNumbers({
	newData,
}: {
	newData: Promise<BigNumbersProps>;
}) {
	const data = use(newData);
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5'>
			<Card>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						{data.companyGoal.meta.toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'brl',
						})}
						<Coins size={20} />
					</CardTitle>
					<CardDescription>Meta de faturamento atual</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						{data.companyGoal.realized.toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'brl',
						})}
						<Coins size={20} />
					</CardTitle>
					<CardDescription>Faturamento realizado atual</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className='flex justify-between items-center'>
						{data.companyGoal.remaining.toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'brl',
						})}
						<Coins size={20} />
					</CardTitle>
					<CardDescription>
						Faturamento restante para atingir a meta
					</CardDescription>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle
						className={`flex justify-between items-center ${data.companyGoal.predicted < data.companyGoal.meta ? 'text-destructive' : 'text-foreground'}`}>
						{data.companyGoal.predicted.toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'brl',
						})}
						<Coins size={20} />
					</CardTitle>
					<CardDescription>Faturamento previsto</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}
