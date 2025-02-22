/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/utils/format-currency';
import { addDays } from 'date-fns';
import { Loader2, Zap } from 'lucide-react';
import { useState } from 'react';
import { PieStore } from './_components/charts/pie-store';
import { Revenue } from './_components/charts/revenue';
import SellerComparison from './_components/charts/seller-comparison';
import SalesmanList from './_components/salesman-list';
import SellerRevenue from './_components/charts/seller-revenue';

// Mock data
const storeData = {
	name: 'JD INFO CENTRO NITEROI',
	meta: 408000,
	realizado: 211760.93,
	percentual: 52,
};

const vendedoresData = [
	{
		name: 'PAULO',
		meta: 143000,
		realizado: 137761.22,
		percentual: 96,
		metaProjetada: 275522.44,
		metaProjetadaPercentual: 193,
	},
	{
		name: 'WELITON',
		meta: 120000,
		realizado: 35405.01,
		percentual: 30,
		metaProjetada: 70810.02,
		metaProjetadaPercentual: 59,
	},
	{
		name: 'LUCAS SILVEIRA',
		meta: 55000,
		realizado: 18372.6,
		percentual: 33,
		metaProjetada: 55117.8,
		metaProjetadaPercentual: 100,
	},
	{
		name: 'B2B JOYCE',
		meta: 90000,
		realizado: 20222.1,
		percentual: 22,
		metaProjetada: 60666.3,
		metaProjetadaPercentual: 67,
	},
];

export default function GoalResultPage() {
	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: addDays(new Date(), 30),
	});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedVendedor, setSelectedVendedor] = useState('all');

	const handleRefresh = async () => {
		setIsLoading(true);
		// Simular atualização dos dados
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsLoading(false);
	};

	return (
		<div className='w-full  mx-auto space-y-5 pb-5'>
			{/* Header e Filtros */}
			<div className='space-y-4'>
				<div className='grid grid-cols-1 md:flex items-start gap-4 '>
					<Button
						onClick={handleRefresh}
						disabled={isLoading}
						className='bg-red-600 disabled:opacity-70 w-full md:w-fit hover:bg-red-700'>
						{isLoading ? (
							<>
								Atualizar <Loader2 className='animate-spin' />
							</>
						) : (
							<>
								Atualizar <Zap />
							</>
						)}
					</Button>
					<div className='w-full md:max-w-[220px]'>
						<Select
							value={selectedVendedor}
							onValueChange={setSelectedVendedor}>
							<SelectTrigger>
								<SelectValue placeholder='Selecione um vendedor' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>Todos os Vendedores</SelectItem>
								{vendedoresData.map((vendedor, index) => (
									<SelectItem
										key={index}
										value={vendedor.name.toLowerCase()}>
										{vendedor.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='w-full md:max-w-[220px]'>
						<DatePickerWithRange
							date={dateRange}
							setDate={() => setDateRange}
						/>
					</div>
				</div>
			</div>

			{/* Card da Loja do Centro */}
			<div className='grid grid-cols-1 xl:grid-cols-2 w-full my-5 gap-4 md:items-center'>
				<Card className='w-full h-full'>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							{storeData.name}
						</CardTitle>
						<p className='text-sm'>Meta: {formatCurrency(storeData.meta)}</p>
					</CardHeader>
					<CardContent>
						<PieStore />
					</CardContent>
				</Card>
				<Card className='w-full h-full'>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Faturamento
						</CardTitle>
					</CardHeader>
					<CardContent>
						<SellerRevenue />
					</CardContent>
				</Card>
			</div>
			<Card className='w-full '>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Performance
					</CardTitle>
				</CardHeader>
				<CardContent>
					<SellerComparison />
				</CardContent>
			</Card>
			{/* Gráficos */}

			<SalesmanList />
			<div className='grid grid-cols-1 gap-6 my-5'>
				{/* Vendas ao Longo do Tempo - Centro */}
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Faturamento ao Longo do Tempo
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Revenue />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
