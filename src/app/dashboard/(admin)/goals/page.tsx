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

import { Separator } from '@/components/ui/separator';
import FilterCompany from './_components/filter-company';
import ModalFormComercialGoal from './_components/modal-comercial-goal';
import ModalFormGoal from './_components/modal-form-goal';

export default function GoalsPage() {
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
					<Card className='w-full md:max-w-full mx-auto '>
						<CardHeader>
							<CardTitle className='flex flex-col-reverse md:flex-row gap-5 items-center justify-between'>
								Meta Atual Comercial <ModalFormComercialGoal />
							</CardTitle>
							<CardDescription>
								Meta válida para{' '}
								{new Date().toLocaleDateString('pt-Br', {
									dateStyle: 'short',
								})}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col md:flex-row md:items-center md:gap-10'>
								<p className='space-x-2'>
									<small>Faturamento:</small>
									<span className='font-semibold text-lg'>R$ 100.000,00</span>
								</p>
								<p className='space-x-2'>
									<small>Ticket Médio:</small>
									<span className='font-semibold text-lg'>R$ 10.000,00</span>
								</p>
							</div>
							<Separator
								orientation='horizontal'
								className='my-10'
							/>
							<FilterCompany />
							<div className='rounded-md border'>
								<Table>
									<TableHeader>
										<TableRow className='bg-secondary'>
											<TableHead className='text-foreground font-semibold'>
												Data
											</TableHead>
											<TableHead className='text-foreground font-semibold'>
												Nome
											</TableHead>
											<TableHead className='text-foreground font-semibold'>
												Faturamento
											</TableHead>
											<TableHead className='text-nowrap text-center text-foreground font-semibold'>
												Total de Vendas
											</TableHead>
											<TableHead className='text-nowrap text-center text-foreground font-semibold'>
												Ticket Médio
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className='border rounded-xl'>
										{[
											{
												data: '02/2025',
												nome: 'Ana Silva',
												faturamento: 'R$ 150.000,00',
												ticketAvarage: 'R$ 1500,00',
												vendas: 256,
											},
											{
												data: '03/2025',
												nome: 'Carlos Santos',
												faturamento: 'R$ 145.000,00',
												ticketAvarage: 'R$ 1500,00',
												vendas: 256,
											},
											{
												data: '04/2025',
												nome: 'Mariana Oliveira',
												faturamento: 'R$ 140.000,00',
												ticketAvarage: 'R$ 1500,00',
												vendas: 256,
											},
											{
												data: '05/2025',
												nome: 'Roberto Alves',
												faturamento: 'R$ 135.000,00',
												ticketAvarage: 'R$ 1500,00',
												vendas: 256,
											},
											{
												data: '06/2025',
												nome: 'Juliana Costa',
												faturamento: 'R$ 130.000,00',
												ticketAvarage: 'R$ 1500,00',
												vendas: 256,
											},
										].map((vendedor) => (
											<TableRow key={vendedor.data}>
												<TableCell>{vendedor.data}</TableCell>
												<TableCell>{vendedor.nome}</TableCell>
												<TableCell className='text-nowrap'>
													{vendedor.faturamento}
												</TableCell>
												<TableCell className='text-nowrap text-center'>
													{vendedor.vendas}
												</TableCell>
												<TableCell className='text-nowrap text-center'>
													{vendedor.ticketAvarage}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
