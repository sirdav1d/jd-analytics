/** @format */

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
import HistoryGoal from './_components/history-goals';
import ModalFormComercialGoal from './_components/modal-comercial-goal';
import ModalFormGoal from './_components/modal-form-goal';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Goal } from 'lucide-react';

export default function GoalsPage() {
	const data = getAllSellers();

	const newData = FetchGoalTargetData();

	const today = new Date();

	const formattedToday = today.toLocaleString('pt-BR', {
		month: '2-digit',
		year: 'numeric',
	});

	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<Tabs
				defaultValue='Comercial'
				className='items-center'>
				<TabsList className='h-auto rounded-none border-b bg-transparent p-0'>
					<TabsTrigger
						value='Marketing'
						className='data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'>
						Marketing
					</TabsTrigger>
					<TabsTrigger
						value='Comercial'
						className='data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none'>
						Comercial
					</TabsTrigger>
				</TabsList>
				<TabsContent
					value='Marketing'
					className='w-full'>
					<div className=' bg-background w-full grid grid-cols-1 max-w-full'>
						<div className='my-5 w-full flex flex-col md:flex-row gap-2 items-center justify-between'>
							<div>
								<h2 className=' text-3xl font-semibold'>JD Info Centro</h2>
								<p className='text-muted-foreground font-normal text-xl text-center md:text-start'>
									{formattedToday}
								</p>
							</div>
							<div className='w-full md:w-fit mt-5'>
								<ModalFormGoal />
							</div>
						</div>
						<div className='grid grid-cols-3 gap-5 w-full'>
							<Card>
								<CardHeader>
									<CardTitle className='w-full flex items-center justify-between'>
										20x
										<Goal />
									</CardTitle>
									<CardDescription>Meta de ROAS Atual</CardDescription>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className='w-full flex items-center justify-between'>
										15x <Goal />
									</CardTitle>
									<CardDescription>ROAS Atingido</CardDescription>
								</CardHeader>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle className='w-full flex items-center justify-between text-destructive'>
										17x
										<Goal />
									</CardTitle>
									<CardDescription>Previsão de ROAS</CardDescription>
								</CardHeader>
							</Card>
						</div>
						<Separator
							orientation='horizontal'
							className='my-10'
						/>
						<Table>
							<TableHeader>
								<TableRow className='bg-secondary text-foreground'>
									<TableHead className='bg-secondary text-foreground'>
										Data
									</TableHead>
									<TableHead className='text-center text-foreground'>
										Meta de Roas
									</TableHead>
									<TableHead className='text-nowrap text-center text-foreground'>
										Roas Atingido
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{[
									{
										data: '02/2025',
										nome: 'Ana Silva',
										faturamento: 20,
										ticketAvarage: 15,
										roas: 20,
									},
									{
										data: '03/2025',
										nome: 'Carlos Santos',
										faturamento: 20,
										ticketAvarage: 15,
										roas: 20,
									},
									{
										data: '04/2025',
										nome: 'Mariana Oliveira',
										faturamento: 20,
										ticketAvarage: 15,
										roas: 20,
									},
									{
										data: '05/2025',
										nome: 'Roberto Alves',
										faturamento: 20,
										ticketAvarage: 15,
										roas: 20,
									},
									{
										data: '06/2025',
										nome: 'Juliana Costa',
										faturamento: 20,
										ticketAvarage: 15,
										roas: 20,
									},
								].map((vendedor) => (
									<TableRow key={vendedor.data}>
										<TableCell className='flex items-center gap-3'>
											{vendedor.data}
										</TableCell>
										<TableCell className='text-nowrap text-center'>
											{vendedor.faturamento}
										</TableCell>
										<TableCell className='text-nowrap text-center'>
											{vendedor.ticketAvarage}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</TabsContent>
				<TabsContent value='Comercial' className='w-full'>
					<div className=' bg-background w-full grid grid-cols-1 max-w-full'>
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
