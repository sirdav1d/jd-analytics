/** @format */

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
// 	Accordion,
// 	AccordionContent,
// 	AccordionItem,
// 	AccordionTrigger,
// } from '@/components/ui/accordion';
import getAllSellers from '@/actions/user/get-all';
import { Separator } from '@/components/ui/separator';
import { FetchGoalTargetData } from '@/services/data-services/get-goal-target';
import FilterCompany from './_components/filter-company';
import ModalFormComercialGoal from './_components/modal-comercial-goal';
import ModalFormGoal from './_components/modal-form-goal';

export default async function GoalsPage() {
	const data = await getAllSellers();

	const newData = await FetchGoalTargetData();

	if (!newData.ok) {
		console.log(data.error);
		return <div>Dados não encontrados</div>;
	}

	const today = new Date();

	const formattedToday = today.toLocaleString('pt-BR', {
		month: '2-digit',
		year: 'numeric',
	});

	const currentGoals = newData.currentGoals;
	const history = newData.history;

	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<Tabs
				defaultValue='Marketing'
				className='w-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='Marketing'>Marketing</TabsTrigger>
					<TabsTrigger value='Comercial'>Comercial</TabsTrigger>
				</TabsList>
				<TabsContent value='Marketing'>
					<Card className='w-full md:max-w-full mx-auto '>
						<CardHeader>
							<CardTitle className='flex flex-col-reverse md:flex-row gap-5 items-center justify-between'>
								Meta Atual de Marketing <ModalFormGoal />
							</CardTitle>
							<CardDescription>
								Meta válida para{' '}
								{new Date().toLocaleDateString('pt-Br', { dateStyle: 'short' })}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col md:flex-row md:items-center md:gap-10'>
								<p className='space-x-2'>
									<small>Faturamento:</small>
									<span className='font-semibold text-lg'>R$ 100.000,00</span>
								</p>
								<p className='space-x-2'>
									<small>ROAS:</small>
									<span className='font-semibold text-lg'>20x</span>
								</p>
							</div>
							<Separator
								orientation='horizontal'
								className='my-10'
							/>
							<FilterCompany />
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Data</TableHead>
										<TableHead>Faturamento</TableHead>
										<TableHead className='text-nowrap text-center'>
											Investimento
										</TableHead>
										<TableHead className='text-nowrap text-center'>
											ROAS
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{[
										{
											data: '02/2025',
											nome: 'Ana Silva',
											faturamento: 'R$ 150.000,00',
											ticketAvarage: 'R$ 7500,00',
											roas: 20,
										},
										{
											data: '03/2025',
											nome: 'Carlos Santos',
											faturamento: 'R$ 145.000,00',
											ticketAvarage: 'R$ 7250,00',
											roas: 20,
										},
										{
											data: '04/2025',
											nome: 'Mariana Oliveira',
											faturamento: 'R$ 140.000,00',
											ticketAvarage: 'R$ 7000,00',
											roas: 20,
										},
										{
											data: '05/2025',
											nome: 'Roberto Alves',
											faturamento: 'R$ 135.000,00',
											ticketAvarage: 'R$ 6750,00',
											roas: 20,
										},
										{
											data: '06/2025',
											nome: 'Juliana Costa',
											faturamento: 'R$ 130.000,00',
											ticketAvarage: 'R$ 6500,00',
											roas: 20,
										},
									].map((vendedor) => (
										<TableRow key={vendedor.data}>
											<TableCell className='flex items-center gap-3'>
												{vendedor.data}
											</TableCell>
											<TableCell className='text-nowrap'>
												{vendedor.faturamento}
											</TableCell>
											<TableCell className='text-nowrap text-center'>
												{vendedor.ticketAvarage}
											</TableCell>
											<TableCell className='text-nowrap text-center'>
												{vendedor.roas}x
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='Comercial'>
					<Card className='w-full md:max-w-full mx-auto bg-background border-none '>
						<CardHeader>
							<CardTitle className='flex flex-col-reverse md:flex-row gap-5 items-center justify-between text-3xl'>
								<span>
									JD Info Centro <br />
									<span className='text-muted-foreground font-normal text-xl'>
										{formattedToday}
									</span>
								</span>
								{data.data && <ModalFormComercialGoal sellers={data.data} />}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
								<Card>
									<CardHeader>
										<CardTitle>
											{newData.companyGoal.toLocaleString('pt-BR', {
												style: 'currency',
												currency: 'brl',
											})}
										</CardTitle>
										<CardDescription>Meta de faturamento atual</CardDescription>
									</CardHeader>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>100</CardTitle>
										<CardDescription>
											Média móvel de vendas atual
										</CardDescription>
									</CardHeader>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>R$ 1.000,00</CardTitle>
										<CardDescription>
											Ticket médio previsto atual
										</CardDescription>
									</CardHeader>
								</Card>
							</div>

							{/* <FilterCompany /> */}
							<div className='rounded-md border mt-10'>
								<Table title='Meta do mês atual'>
									<TableHeader>
										<TableRow className='bg-secondary'>
											<TableHead className='text-foreground font-semibold'>
												Data
											</TableHead>
											<TableHead className='text-foreground font-semibold'>
												Nome
											</TableHead>
											<TableHead className='text-foreground font-semibold'>
												Meta de Faturamento
											</TableHead>
											<TableHead className='text-nowrap text-center text-foreground font-semibold'>
												Média Móvel de Vendas
											</TableHead>
											<TableHead className='text-nowrap text-center text-foreground font-semibold'>
												Ticket Médio Previsto
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className='border rounded-xl'>
										{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
										{currentGoals.map((item: any, index: number) => {
											return (
												<TableRow key={index}>
													<TableCell className='text-nowrap'>
														{item.monthRef.slice(0, 7)}
													</TableCell>
													<TableCell className='text-nowrap'>
														{item.sellerName}
													</TableCell>
													<TableCell className='text-nowrap'>
														{item.revenue.toLocaleString('pt-br', {
															style: 'currency',
															currency: 'brl',
														})}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
							<div className='flex flex-col gap-10 mt-20'>
								{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
								{history.map((item: any, index: number) => {
									return (
										index < 4 && (
											<Table
												key={index}
												title={`Meta do mês ${item.month}`}>
												<TableHeader>
													<TableRow className='bg-secondary'>
														<TableHead className='text-foreground font-semibold'>
															Data
														</TableHead>
														<TableHead className='text-foreground font-semibold'>
															Nome
														</TableHead>
														<TableHead className='text-foreground font-semibold'>
															Meta de Faturamento
														</TableHead>
														<TableHead className='text-nowrap text-center text-foreground font-semibold'>
															Média Móvel de Vendas
														</TableHead>
														<TableHead className='text-nowrap text-center text-foreground font-semibold'>
															Ticket Médio Previsto
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody className='border rounded-xl'>
													{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
													{item.goals.map((item: any, index: number) => {
														return (
															<TableRow key={index}>
																<TableCell className='text-nowrap'>
																	{item.month}
																</TableCell>
																<TableCell className='text-nowrap'>
																	{item.sellerName}
																</TableCell>
																<TableCell className='text-nowrap'>
																	{item.revenue.toLocaleString('pt-br', {
																		style: 'currency',
																		currency: 'brl',
																	})}
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										)
									);
								})}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
