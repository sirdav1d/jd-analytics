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

import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { addDays } from 'date-fns';
import { motion } from 'framer-motion';
import {
	BarChartIcon,
	DollarSign,
	Target,
	TrendingUp,
	Trophy,
	UserPlus,
	Users,
} from 'lucide-react';
import { useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Label,
	LabelList,
	Line,
	LineChart,
	Pie,
	PieChart,
	XAxis,
} from 'recharts';
import { SalesVsRepairRevenue } from './_components/sales-vs-repair-revenue';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

import React from 'react';

export default function OverviewPage() {
	// Mock data (replace with actual data in a real application)
	const salesData = [
		{ name: 'Jan', total: 15000 },
		{ name: 'Feb', total: 20000 },
		{ name: 'Mar', total: 18000 },
		{ name: 'Apr', total: 22000 },
		{ name: 'May', total: 25000 },
		{ name: 'Jun', total: 30000 },
	];

	const customerData = React.useMemo(
		() => [
			{ name: 'Novos', value: 30 },
			{ name: 'Recorrentes', value: 70 },
		],
		[],
	);

	const topProducts = [
		{ name: 'Laptop Pro X', sales: 200, revenue: 400000, posicao: 1 },
		{ name: 'Smartphone Y', sales: 180, revenue: 180000, posicao: 2 },
		{ name: 'Tablet Z', sales: 150, revenue: 112500, posicao: 3 },
		{ name: 'Smartwatch A', sales: 120, revenue: 48000, posicao: 4 },
		{ name: 'Wireless Earbuds B', sales: 100, revenue: 20000, posicao: 5 },
	];

	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: addDays(new Date(), 30),
	});
	const [customerType, setCustomerType] = useState('all');
	const [salesChannel, setSalesChannel] = useState('all');

	const chartConfig = {
		Novos: {
			label: 'Novos',
			color: 'hsl(var(--chart-1))',
		},
		Recorrentes: {
			label: 'Recorrentes',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const ROIChartConfig = {
		total: {
			label: 'ROI',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	const salesChartConfig = {
		total: {
			label: 'Faturamento',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } },
	};

	const totalSales = React.useMemo(() => {
		return customerData.reduce((acc, curr) => acc + curr.value, 0);
	}, [customerData]);

	return (
		<div className='pb-4 w-full mx-auto space-y-4 min-h-screen'>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={fadeIn}
				className='space-y-4'>
				{/* Filters */}
				<div className='flex flex-wrap gap-4 mb-4'>
					<DatePickerWithRange
						date={dateRange}
						setDate={() => setDateRange}
					/>
					<Select
						value={customerType}
						onValueChange={setCustomerType}>
						<SelectTrigger className='w-full md:w-[220px]'>
							<SelectValue placeholder='Tipo de Cliente' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Todos os Clientes</SelectItem>
							<SelectItem value='new'>Novos Clientes</SelectItem>
							<SelectItem value='recurring'>Clientes Recorrentes</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={salesChannel}
						onValueChange={setSalesChannel}>
						<SelectTrigger className='w-full md:w-[220px]'>
							<SelectValue placeholder='Canal de Venda' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>Todos os Canais</SelectItem>
							<SelectItem value='physical'>Loja Física</SelectItem>
							<SelectItem value='ecommerce'>E-commerce</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Main KPIs */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium '>
								Total de Vendas
							</CardTitle>
							<DollarSign className='h-4 w-4 text-primary' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>R$ 150,000</div>
							<p className='text-xs '>+20% em relação ao período anterior</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium '>
								Ticket Médio
							</CardTitle>
							<Users className='h-4 w-4 text-primary' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold '>R$ 500</div>
							<p className='text-xs '>+5% em relação ao período anterior</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium '>
								Crescimento de Vendas
							</CardTitle>
							<TrendingUp className='h-4 w-4 text-primary' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold '>15%</div>
							<p className='text-xs '>Comparado ao trimestre anterior</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium '>
								Novos Clientes
							</CardTitle>
							<UserPlus className='h-4 w-4 text-primary' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold '>250</div>
							<p className='text-xs '>30% do total de clientes</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium '>
								Leads Gerados
							</CardTitle>
							<Target className='h-4 w-4 text-primary' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold '>1,200</div>
							<p className='text-xs '>+15% em relação ao mês anterior</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium '>
								Número de Vendas
							</CardTitle>
							<BarChartIcon className='h-4 w-4 text-primary' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold '>1,250</div>
							<p className='text-xs '>+15% em relação ao mês anterior</p>
						</CardContent>
					</Card>
				</div>

				{/* Charts */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Vendas por Período
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ChartContainer
								className='max-h-96 mx-auto'
								config={salesChartConfig}>
								<BarChart
									accessibilityLayer
									margin={{ top: 28 }}
									data={salesData}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey='name'
										tickLine={false}
										tickMargin={10}
										axisLine={false}
										tickFormatter={(value) => value.slice(0, 3)}
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent indicator='dot' />}
									/>
									<Bar
										dataKey='total'
										fill='var(--color-total)'
										radius={4}>
										<LabelList
											position='top'
											offset={12}
											className='fill-foreground'
											fontSize={12}
										/>
									</Bar>
								</BarChart>
							</ChartContainer>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Novos vs. Recorrentes
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ChartContainer
								config={chartConfig}
								className='mx-auto aspect-square max-h-[364px] w-full [&_.recharts-pie-label-text]:fill-foreground'>
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent />}
									/>
									<Pie
										data={customerData}
										dataKey='value'
										nameKey='name'
										innerRadius={80}
										label={({ name, percent }) =>
											`${name} ${(percent * 100).toFixed(0)}%`
										}
										labelLine={false}>
										{customerData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={`var(--color-${entry.name})`}
											/>
										))}
										<Label
											content={({ viewBox }) => {
												if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
													return (
														<text
															x={viewBox.cx}
															y={viewBox.cy}
															textAnchor='middle'
															dominantBaseline='middle'>
															<tspan
																x={viewBox.cx}
																y={viewBox.cy}
																className='fill-foreground text-3xl font-bold'>
																{totalSales.toLocaleString()}
															</tspan>
															<tspan
																x={viewBox.cx}
																y={(viewBox.cy || 0) + 24}
																className='fill-muted-foreground'>
																Vendas
															</tspan>
														</text>
													);
												}
											}}
										/>
									</Pie>
									<ChartLegend
										content={
											<ChartLegendContent
												nameKey='name'
												className='md:text-sm'
											/>
										}
										className='text-sm'
									/>
								</PieChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</div>

				{/* ROI of Marketing Campaigns */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4'>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								ROI das Campanhas de Marketing
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ChartContainer
								className='max-h-96 mx-auto'
								config={ROIChartConfig}>
								<LineChart
									accessibilityLayer
									data={salesData}
									margin={{
										top: 28,
										left: 28,
										right: 28,
									}}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey='name'
										tickLine={false}
										axisLine={false}
										tickMargin={12}
										tickFormatter={(value) => value.slice(0, 3)}
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent indicator='dot' />}
									/>
									<Line
										dataKey='total'
										type='natural'
										fill='var(--color-total)'
										fillOpacity={0.4}
										stroke='var(--color-total)'
										strokeWidth={2}
										dot={{
											fill: 'var(--color-total)',
										}}
										activeDot={{
											r: 6,
										}}>
										<LabelList
											position='top'
											offset={12}
											className='fill-foreground'
											fontSize={12}
										/>
									</Line>
								</LineChart>
							</ChartContainer>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Receita de Vendas vs. Serviços
							</CardTitle>
						</CardHeader>
						<CardContent>
							<SalesVsRepairRevenue />
						</CardContent>
					</Card>
				</div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4'>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Top 5 Vendedores
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Posição</TableHead>
										<TableHead>Nome</TableHead>
										<TableHead className='text-nowrap'>
											Total de Vendas
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{[
										{ posicao: 1, nome: 'Ana Silva', vendas: 'R$ 150.000,00' },
										{
											posicao: 2,
											nome: 'Carlos Santos',
											vendas: 'R$ 145.000,00',
										},
										{
											posicao: 3,
											nome: 'Mariana Oliveira',
											vendas: 'R$ 140.000,00',
										},
										{
											posicao: 4,
											nome: 'Roberto Alves',
											vendas: 'R$ 135.000,00',
										},
										{
											posicao: 5,
											nome: 'Juliana Costa',
											vendas: 'R$ 130.000,00',
										},
									].map((vendedor) => (
										<TableRow key={vendedor.posicao}>
											<TableCell className='flex items-center gap-3'>
												{vendedor.posicao}
												{vendedor.posicao == 1 ? (
													<Trophy
														size={20}
														className='text-amber-500'
													/>
												) : vendedor.posicao == 2 ? (
													<Trophy
														size={20}
														className='text-zinc-400'
													/>
												) : vendedor.posicao == 3 ? (
													<Trophy
														size={20}
														className='text-rose-700'
													/>
												) : null}
											</TableCell>
											<TableCell className='text-nowrap'>
												{vendedor.nome}
											</TableCell>
											<TableCell className='text-nowrap'>
												{vendedor.vendas}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className='text-base text-balance md:text-2xl'>
								Top 5 Produtos
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Posição</TableHead>
										<TableHead>Produto</TableHead>
										<TableHead>Vendas</TableHead>
										<TableHead>Receita</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{topProducts.map((product) => (
										<TableRow key={product.name}>
											<TableCell className='flex items-center gap-3'>
												{product.posicao}
												{product.posicao == 1 ? (
													<Trophy
														size={20}
														className='text-amber-500'
													/>
												) : product.posicao == 2 ? (
													<Trophy
														size={20}
														className='text-zinc-400'
													/>
												) : product.posicao == 3 ? (
													<Trophy
														size={20}
														className='text-rose-700'
													/>
												) : null}
											</TableCell>
											<TableCell className='text-nowrap'>
												{product.name}
											</TableCell>
											<TableCell>{product.sales}</TableCell>
											<TableCell className='text-nowrap'>
												R$ {product.revenue.toLocaleString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</motion.div>
		</div>
	);
}
