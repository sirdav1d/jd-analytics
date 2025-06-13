/** @format */
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { use } from 'react';
import Image from 'next/image';
import linx from '@/../public/linx-logo.png';
import { ChartBarActive } from './charts/revenue-by-origin';

export default function SectionLinx({
	data,
}: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
}) {
	const response = use(data);
	console.log(response);

	if (!response.ok || !response.data) {
		console.log('LINX', response.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Dados não encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}
	return (
		<div className='grid gap-5 pt-10'>
			<div className='flex items-center gap-2 scale-110 md:scale-100'>
				<Image
					src={linx}
					alt='Logo Linx ERP'
					height={24}
					width={24}
				/>
				<h2 className='font-semibold text-sm'>Linx ERP</h2>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Faturamento Por Origem</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartBarActive />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Vendas Por Origem</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartBarActive />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Ticket Médio Por Origem</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartBarActive />
				</CardContent>
			</Card>
		</div>
	);
}
