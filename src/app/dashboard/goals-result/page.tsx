/** @format */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { addDays } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import {
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

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

const vendedoresComparacaoData = vendedoresData.map((v) => ({
	name: v.name,
	value: v.realizado,
}));

const COLORS = ['#DC2626', '#2563eb'];

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

	const formatCurrency = (value: number) => {
		return value.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		});
	};

	return (
		<div className='container  mx-auto p-4 space-y-8'>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={fadeIn}>
				{/* Header e Filtros */}
				<div className='space-y-6'>
					<div className='flex justify-between items-center'>
						<h1 className='text-2xl font-bold'>Dashboard de Vendas</h1>
						<Button
							onClick={handleRefresh}
							disabled={isLoading}
							className='bg-red-600 hover:bg-red-700'>
							<RefreshCw
								className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
							/>
							Atualizar
						</Button>
					</div>

					<Card>
						<CardContent className='pt-6'>
							<div className='flex flex-wrap gap-4 items-end'>
								<div className='flex-1 min-w-[200px]'>
									<label className='text-sm font-medium  mb-2 block'>
										Vendedor
									</label>
									<Select
										value={selectedVendedor}
										onValueChange={setSelectedVendedor}>
										<SelectTrigger>
											<SelectValue placeholder='Selecione um vendedor' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='all'>Todos</SelectItem>
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
									<label className='text-sm font-medium  mb-2 block'>
										Período
									</label>
									<DatePickerWithRange
										date={dateRange}
										setDate={() => setDateRange}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Card da Loja do Centro */}
				<div className='grid grid-cols-2 gap-4 items-center'>
					<Card className='w-full'>
						<CardHeader>
							<CardTitle className='text-lg font-bold'>
								{storeData.name}
							</CardTitle>
							<p className='text-sm '>Meta: {formatCurrency(storeData.meta)}</p>
						</CardHeader>
						<CardContent className='flex flex-col items-center'>
							<div className='w-48 h-48 relative'>
								<ResponsiveContainer
									width='100%'
									height='100%'>
									<PieChart>
										<Pie
											data={[
												{ value: storeData.percentual },
												{ value: 100 - storeData.percentual },
											]}
											cx='50%'
											cy='50%'
											innerRadius={60}
											outerRadius={80}
											startAngle={90}
											endAngle={-270}
											dataKey='value'>
											{[0, 1].map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
								<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold'>
									{storeData.percentual}%
								</div>
							</div>
							<div className='mt-4 text-center'>
								<p className='text-sm '>Realizado</p>
								<p className='text-lg font-bold'>
									{formatCurrency(storeData.realizado)}
								</p>
							</div>
						</CardContent>
					</Card>
					<Card className='w-full'>
						<CardHeader>
							<CardTitle className=''>Comparação entre Vendedores</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='h-[400px]'>
								<ResponsiveContainer
									width='100%'
									height='100%'>
									<BarChart data={vendedoresComparacaoData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='name' />
										<YAxis />
										<Tooltip
											formatter={(value: number) => formatCurrency(value)}
										/>
										<Bar
											dataKey='value'
											fill='#DC2626'
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>{' '}
				</div>

				{/* Gráficos */}
				<div className='grid grid-cols-1 gap-6 mb-8'>
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

				{/* Cards dos Vendedores */}
				<div className='grid grid-cols-1 md:grid-cols-2  gap-6'>
					{vendedoresData.map((vendedor, index) => (
						<Card key={index}>
							<CardHeader>
								<CardTitle className='text-lg font-bold'>
									{vendedor.name} - VENDA REAL
								</CardTitle>
								<p className='text-sm '>
									META - {formatCurrency(vendedor.meta)}
								</p>
								<p className='text-xs '>ABERTAS + FECHADAS</p>
							</CardHeader>
							<CardContent className='flex flex-col items-center'>
								<div className='w-48 h-48 relative'>
									<ResponsiveContainer
										width='100%'
										height='100%'>
										<PieChart>
											<Pie
												data={[
													{ value: vendedor.percentual },
													{ value: 100 - vendedor.percentual },
												]}
												cx='50%'
												cy='50%'
												innerRadius={60}
												outerRadius={80}
												startAngle={90}
												endAngle={-270}
												dataKey='value'>
												{[0, 1].map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
										</PieChart>
									</ResponsiveContainer>
									<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold'>
										{vendedor.percentual}%
									</div>
								</div>
								<div className='mt-4 text-center'>
									<p className='text-sm '>Realizado</p>
									<p className='text-lg font-bold'>
										{formatCurrency(vendedor.realizado)}
									</p>
								</div>
								<div className='mt-4 w-full  p-2'>
									<div className='flex justify-between items-center'>
										<span className='font-bold text-sm'>META PROJETADA</span>
										<span className='font-bold text-sm'>
											{formatCurrency(vendedor.metaProjetada)}
										</span>
									</div>
									<div className='text-right text-sm '>
										{vendedor.metaProjetadaPercentual}%
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</motion.div>
		</div>
	);
}
