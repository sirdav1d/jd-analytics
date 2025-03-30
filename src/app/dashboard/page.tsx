/** @format */
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { addDays } from 'date-fns';
import {
	DollarSign,
	ShoppingBag,
	SquarePercent,
	TrendingUp,
	Trophy,
	UserPlus,
	UsersRound,
	Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import {
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

export default function OverviewPage() {
	const salesData = [
		{ name: 'Jan', centro: 18000, icarai: 13000 },
		{ name: 'Feb', centro: 20000, icarai: 14000 },
		{ name: 'Mar', centro: 18000, icarai: 29500 },
		{ name: 'Apr', centro: 22000, icarai: 15800 },
		{ name: 'May', centro: 25000, icarai: 19000 },
		{ name: 'Jun', centro: 30000, icarai: 17800 },
	];

	const customerData = React.useMemo(
		() => [
			{ name: 'centro', value: 390000 },
			{ name: 'icarai', value: 130000 },
		],
		[],
	);

	const customerData2 = React.useMemo(
		() => [
			{ name: 'centro', value: 320 },
			{ name: 'icarai', value: 125 },
		],
		[],
	);

	const customerData3 = React.useMemo(
		() => [
			{ name: 'centro', value: 3500 },
			{ name: 'icarai', value: 2100 },
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
		to: addDays(new Date(), 7),
	});
	const [customerType, setCustomerType] = useState('all');

	const chartConfig = {
		centro: {
			label: 'JD Centro',
			color: 'hsl(var(--chart-1))',
		},
		icarai: {
			label: 'JD Icaraí',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const salesChartConfig = {
		centro: {
			label: 'JD Centro',
			color: 'hsl(var(--chart-1))',
		},
		icarai: {
			label: 'JD Icaraí',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	const totalSales = React.useMemo(() => {
		return customerData.reduce((acc, curr) => acc + curr.value, 0);
	}, [customerData]);

	const totalSales2 = React.useMemo(() => {
		return customerData2.reduce((acc, curr) => acc + curr.value, 0);
	}, [customerData2]);

	const totalSales3 = React.useMemo(() => {
		return customerData3.reduce((acc, curr) => acc + curr.value, 0);
	}, [customerData3]);

	return (
		<div className='pb-4 w-full mx-auto space-y-5 min-h-screen'>
			<div className='flex flex-wrap gap-5 mb-4'>
				<Button className='disabled:opacity-70 w-full md:w-fit'>
					Atualizar <Zap />
				</Button>
				<DatePickerWithRange
					date={dateRange}
					setDate={() => setDateRange}
				/>
				<Select
					value={customerType}
					onValueChange={setCustomerType}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Tipo de Cliente' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas as unidades</SelectItem>
						<SelectItem value='new'>JD Centro</SelectItem>
						<SelectItem value='recurring'>JD Icaraí</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium '>
							Total de Faturamento
						</CardTitle>
						<DollarSign className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>R$ 150,000</div>
						<p className='text-xs text-muted-foreground'>
							+20% em relação ao período anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium '>Ticket Médio</CardTitle>
						<SquarePercent className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>R$ 500</div>
						<p className='text-xs text-muted-foreground'>
							+5% em relação ao período anterior
						</p>
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
						<p className='text-xs text-muted-foreground'>
							Comparado ao mês anterior
						</p>
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
						<p className='text-xs text-muted-foreground'>
							30% do total de clientes
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium '>
							Leads Gerados
						</CardTitle>
						<UsersRound className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>1,200</div>
						<p className='text-xs text-muted-foreground'>
							+15% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium '>
							Total de Vendas
						</CardTitle>
						<ShoppingBag className='h-4 w-4 text-primary' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold '>1,250</div>
						<p className='text-xs text-muted-foreground'>
							+15% em relação ao mês anterior
						</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Faturamento total por unidade
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={chartConfig}
							className='mx-auto aspect-square w-full max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'>
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent />}
								/>
								<Pie
									data={customerData}
									dataKey='value'
									nameKey='name'
									innerRadius={88}
									label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
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
															className='fill-foreground text-xl font-bold'>
															{totalSales.toLocaleString('pt-br', {
																style: 'currency',
																currency: 'brl',
															})}
														</tspan>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) + 24}
															className='fill-muted-foreground'>
															Faturamento
														</tspan>
													</text>
												);
											}
										}}
									/>
								</Pie>
								<ChartLegend
									content={<ChartLegendContent nameKey='name' />}
									className='text-xs '
								/>
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>{' '}
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Total de vendas por unidade
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={chartConfig}
							className='mx-auto aspect-square w-full max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'>
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent />}
								/>
								<Pie
									data={customerData2}
									dataKey='value'
									nameKey='name'
									innerRadius={88}
									label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
									labelLine={false}>
									{customerData2.map((entry, index) => (
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
															{totalSales2.toLocaleString('pt-br')}
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
									content={<ChartLegendContent nameKey='name' />}
									className='text-xs '
								/>
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='text-base text-balance md:text-2xl'>
							Total de leads por unidade
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartContainer
							config={chartConfig}
							className='mx-auto aspect-square w-full max-h-[340px] [&_.recharts-pie-label-text]:fill-foreground'>
							<PieChart>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent />}
								/>
								<Pie
									data={customerData3}
									dataKey='value'
									nameKey='name'
									innerRadius={88}
									label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
									labelLine={false}>
									{customerData3.map((entry, index) => (
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
															{totalSales3.toLocaleString('pt-br')}
														</tspan>
														<tspan
															x={viewBox.cx}
															y={(viewBox.cy || 0) + 24}
															className='fill-muted-foreground'>
															Leads
														</tspan>
													</text>
												);
											}
										}}
									/>
								</Pie>
								<ChartLegend
									content={<ChartLegendContent nameKey='name' />}
									className='text-xs '
								/>
							</PieChart>
						</ChartContainer>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Vendas por unidade
					</CardTitle>
				</CardHeader>
				<CardContent>
					<SalesVsRepairRevenue />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance md:text-2xl'>
						Faturamento por Unidade
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer
						className='h-72 mx-auto w-full'
						config={salesChartConfig}>
						<LineChart
							accessibilityLayer
							margin={{ top: 28, left: 40, right: 40 }}
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

							<Line
								dataKey='icarai'
								dot={{
									fill: 'var(--color-icarai)',
								}}
								activeDot={{
									r: 6,
								}}
								type='natural'
								stroke='var(--color-icarai)'
								radius={4}>
								<LabelList
									position='top'
									offset={12}
									className='fill-foreground'
									fontSize={12}
									formatter={(value: number) =>
										value.toLocaleString('pt-BR', {
											style: 'currency',
											currency: 'brl',
										})
									}
								/>
							</Line>
							<Line
								dataKey='centro'
								dot={{
									fill: 'var(--color-centro)',
								}}
								activeDot={{
									r: 6,
								}}
								type='natural'
								stroke='var(--color-centro)'
								radius={4}>
								<LabelList
									position='top'
									offset={12}
									className='fill-foreground'
									fontSize={12}
									formatter={(value: number) =>
										value.toLocaleString('pt-BR', {
											style: 'currency',
											currency: 'brl',
										})
									}
								/>
							</Line>
							<ChartLegend
								content={<ChartLegendContent />}
								className='text-xs'
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-5 mb-4'>
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
									<TableHead>Unidade</TableHead>
									<TableHead className='text-nowrap'>Total de Vendas</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									{
										posicao: 1,
										nome: 'Ana Silva',
										unidade: 'JD Centro',
										vendas: 'R$ 150.000,00',
									},
									{
										posicao: 2,
										nome: 'Carlos Santos',
										unidade: 'JD Icaraí',
										vendas: 'R$ 145.000,00',
									},
									{
										posicao: 3,
										nome: 'Mariana Oliveira',
										unidade: 'JD Centro',
										vendas: 'R$ 140.000,00',
									},
									{
										posicao: 4,
										nome: 'Roberto Alves',
										unidade: 'JD Centro',
										vendas: 'R$ 135.000,00',
									},
									{
										posicao: 5,
										nome: 'Juliana Costa',
										unidade: 'JD Icaraí',
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
											{vendedor.unidade}
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
		</div>
	);
}
