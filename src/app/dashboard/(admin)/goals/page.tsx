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

import getAllSellers from '@/actions/user/get-all';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FetchGoalTargetData } from '@/services/data-services/get-goal-target';
import { Suspense } from 'react';
import BigNumbers from './_components/big-numbers';
import { columns } from './_components/data-table-current-goal/columns';
import { DataTable } from './_components/data-table-current-goal/data-table';
import FilterCompany from './_components/filter-company';
import HistoryGoal from './_components/history-goals';
import ModalFormComercialGoal from './_components/modal-comercial-goal';
import ModalFormGoal from './_components/modal-form-goal';

export default function GoalsPage() {
	const data = getAllSellers();

	const newData = FetchGoalTargetData();

	const today = new Date();

	const formattedToday = today.toLocaleString('pt-BR', {
		month: '2-digit',
		year: 'numeric',
	});

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
						<div className='my-5 flex flex-col md:flex-row gap-2 items-center justify-between'>
							<div>
								<h2 className=' text-3xl font-semibold'>JD Info Centro</h2>
								<p className='text-muted-foreground font-normal text-xl text-center md:text-start'>
									{formattedToday}
								</p>
							</div>
							<div className='w-full md:w-fit mt-5'>
								{<ModalFormComercialGoal sellers={data} />}
							</div>
						</div>
						<div>
							<Suspense
								fallback={
									<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5'>
										<Skeleton className='w-full h-24' />
										<Skeleton className='w-full h-24' />
										<Skeleton className='w-full h-24' />
										<Skeleton className='w-full h-24' />
									</div>
								}>
								<BigNumbers newData={newData} />
							</Suspense>
							<Suspense
								fallback={
									<div className='rounded-md mt-10 max-w-full w-full'>
										<Skeleton className='w-full h-60' />
									</div>
								}>
								<div className='rounded-md mt-10 max-w-full w-full'>
									<DataTable
										columns={columns}
										data={newData}
									/>
								</div>
							</Suspense>
							<Separator className='w-full my-10' />
							<Suspense
								fallback={
									<div className='rounded-md flex flex-col gap-2 max-w-full w-full'>
										<Skeleton className='w-full h-16' />
										<Skeleton className='w-full h-16' />
										<Skeleton className='w-full h-16' />
										<Skeleton className='w-full h-16' />
									</div>
								}>
								<HistoryGoal data={newData} />
							</Suspense>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
