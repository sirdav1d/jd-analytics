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
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { PieStore } from './_components/charts/pie-store';
import SellerComparison from './_components/charts/seller-comparison';
import SalesmanList from './_components/salesman-list';

// Mock data
const storeData = {
	name: 'JD INFO CENTRO NITEROI',
	meta: 408000,
	realizado: 211760.93,
	percentual: 52,
};

const centroData = [
	{ name: 'Jan', value: 85000 },
	{ name: 'Fev', value: 95000 },
	{ name: 'Mar', value: 211760.93 },
	{ name: 'Abr', value: 150000 },
	{ name: 'Mai', value: 180000 },
	{ name: 'Jun', value: 200000 },
];

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

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.6 } },
	};

	return (
		<div className='w-full  mx-auto space-y-8'>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={fadeIn}>
				{/* Header e Filtros */}
				<div className='space-y-6'>
					<div className='flex flex-wrap gap-4 items-end'>
						<Button
							onClick={handleRefresh}
							disabled={isLoading}
							className='bg-red-600 hover:bg-red-700'>
							<RefreshCw
								className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
							/>
							Atualizar
						</Button>
						<div className='flex-1 max-w-[220px]'>
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
						<div className='flex-1 min-w-[300px]'>
							<DatePickerWithRange
								date={dateRange}
								setDate={() => setDateRange}
							/>
						</div>
					</div>
				</div>

				{/* Card da Loja do Centro */}
				<div className='grid xl:grid-cols-2 my-5 gap-4 md:items-center h-full w-full'>
					<Card className='w-full h-full'>
						<CardHeader>
							<CardTitle className='text-lg font-bold'>
								{storeData.name}
							</CardTitle>
							<p className='text-sm '>Meta: {formatCurrency(storeData.meta)}</p>
						</CardHeader>
						<CardContent>
							<PieStore />
						</CardContent>
					</Card>
					<Card className='w-full h-full'>
						<CardHeader>
							<CardTitle>Comparação entre Vendedores</CardTitle>
						</CardHeader>
						<CardContent>
							<SellerComparison />
						</CardContent>
					</Card>{' '}
				</div>

				{/* Gráficos */}

				<SalesmanList />
				<div className='grid grid-cols-1 gap-6 my-5'>
					{/* Vendas ao Longo do Tempo - Centro */}
					<Card>
						<CardHeader>
							<CardTitle className=''>
								Vendas ao Longo do Tempo - Centro
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='h-[400px]'>
								<ResponsiveContainer
									width='100%'
									height='100%'>
									<LineChart data={centroData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip
											formatter={(value: number) => formatCurrency(value)}
										/>
										<Line
											type='monotone'
											dataKey='value'
											stroke='#DC2626'
											strokeWidth={2}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>

					{/* Comparação entre Vendedores */}
				</div>
			</motion.div>
		</div>
	);
}
