/** @format */

export default function GoalsPage() {
	return (
		<>
			<div className='text-muted-foreground italic'>Em construção...</div>
			{/* <div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
				<div className='grid xl:grid-cols-2 gap-5'>
					<Card className='max-w-[348px] w-full md:max-w-full mx-auto'>
						<CardHeader>
							<CardTitle>Meta de Marketing</CardTitle>
							<CardDescription>Meta válida para 02/2025</CardDescription>
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
							<Separator className='my-10' />
							<MetaMarketingForm />
							<Separator className='my-10' />
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
					<Card className='opacity-50 max-w-[356px] w-full md:max-w-full mx-auto'>
						<CardHeader>
							<CardTitle>Meta Comercial Atual</CardTitle>
							<CardDescription>Meta válida para 02/2025</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center gap-10 w-full'>
								<p className='space-x-2'>
									<small>Faturamento:</small>
									<span className='font-semibold text-lg'>R$ 400.000,00</span>
								</p>
								<p className='space-x-2'>
									<small>Ticket Médio:</small>
									<span className='font-semibold text-lg'>R$ 950,00</span>
								</p>
							</div>
							<Separator className='my-10' />
							<MetaComercialForm />
							<Separator className='my-10' />
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Data</TableHead>
										<TableHead>Faturamento</TableHead>
										<TableHead className='text-nowrap text-center'>
											Ticket Médio
										</TableHead>
										<TableHead className='text-nowrap text-center'>
											Total de Vendas
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
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
												{vendedor.vendas}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</div> */}
		</>
	);
}
