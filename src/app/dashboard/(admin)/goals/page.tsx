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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import getAllSellers from '@/actions/user/get-all';
import { Separator } from '@/components/ui/separator';
import { FetchGoalTargetData } from '@/services/data-services/get-goal-target';
import FilterCompany from './_components/filter-company';
import ModalFormComercialGoal from './_components/modal-comercial-goal';
import ModalFormGoal from './_components/modal-form-goal';
import { Coins, DatabaseBackup } from 'lucide-react';
import { DataTable } from './_components/data-table-current-goal/data-table';
import { columns } from './_components/data-table-current-goal/columns';

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

	const months = [
		{ id: 1, month: 'Janeiro' },
		{ id: 2, month: 'Fevereiro' },
		{ id: 3, month: 'Março' },
		{ id: 4, month: 'Abril' },
		{ id: 5, month: 'Maio' },
		{ id: 6, month: 'Junho' },
		{ id: 7, month: 'Julho' },
		{ id: 8, month: 'Agosto' },
		{ id: 9, month: 'Setembro' },
		{ id: 10, month: 'Outubro' },
		{ id: 11, month: 'Novembro' },
		{ id: 12, month: 'Dezembro' },
	];

	return (
		<div className='w-full  mx-auto pb-4 space-y-4 min-h-screen'>
			<Tabs defaultValue='Marketing'>
				<TabsList className='grid grid-cols-2'>
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
					<div className=' bg-background w-full  max-w-full'>
						<div className='my-5'>
							<h2 className='flex flex-col-reverse md:flex-row gap-5 items-center justify-between text-3xl font-semibold'>
								JD Info Centro
								{data.data && <ModalFormComercialGoal sellers={data.data} />}
							</h2>
							<p className='text-muted-foreground font-normal text-xl text-center md:text-start'>
								{formattedToday}
							</p>
						</div>
						<div>
							<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5'>
								<Card>
									<CardHeader>
										<CardTitle className='flex justify-between items-center'>
											{newData.companyGoal.meta.toLocaleString('pt-BR', {
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
											{newData.companyGoal.realized.toLocaleString('pt-BR', {
												style: 'currency',
												currency: 'brl',
											})}
											<Coins size={20} />
										</CardTitle>
										<CardDescription>
											Faturamento realizado atual
										</CardDescription>
									</CardHeader>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle className='flex justify-between items-center'>
											{newData.companyGoal.remaining.toLocaleString('pt-BR', {
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
											className={`flex justify-between items-center ${newData.companyGoal.predicted < newData.companyGoal.meta ? 'text-destructive' : 'text-foreground'}`}>
											{newData.companyGoal.predicted.toLocaleString('pt-BR', {
												style: 'currency',
												currency: 'brl',
											})}
											<Coins size={20} />
										</CardTitle>
										<CardDescription>Faturamento previsto</CardDescription>
									</CardHeader>
								</Card>
							</div>

							{/* <FilterCompany /> */}
							<div className='rounded-md mt-10 max-w-full w-full'>
								<DataTable
									columns={columns}
									data={currentGoals}
								/>
							</div>
							<Separator className='w-full my-10' />
							<div className='flex flex-col gap-5'>
								<h2 className='font-bold text-xl flex items-center gap-2'>
									<DatabaseBackup size={20} />
									Histórico de metas
								</h2>
								<Accordion
									type='single'
									collapsible
									className='w-full'>
									{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
									{history.map((item: any, index: number) => {
										return (
											index < history.length - 1 && (
												<AccordionItem
													key={index}
													value={`item-${index}`}>
													<AccordionTrigger>
														{months[index].month}
													</AccordionTrigger>
													<AccordionContent>
														<Table title={`Meta do mês ${item.month}`}>
															<TableHeader>
																<TableRow className='bg-secondary'>
																	<TableHead className='text-foreground font-semibold'>
																		Data
																	</TableHead>
																	<TableHead className='text-foreground font-semibold text-nowrap'>
																		Nome
																	</TableHead>
																	<TableHead className='text-foreground font-semibold text-nowrap'>
																		Meta de Faturamento
																	</TableHead>
																	<TableHead className='text-nowrap text-center text-foreground font-semibold'>
																		Faturamento realizado
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
																			<TableCell className='text-nowrap text-center'>
																				{item.realized.toLocaleString('pt-br', {
																					style: 'currency',
																					currency: 'brl',
																				})}
																			</TableCell>
																		</TableRow>
																	);
																})}
															</TableBody>
														</Table>
													</AccordionContent>
												</AccordionItem>
											)
										);
									})}
								</Accordion>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
