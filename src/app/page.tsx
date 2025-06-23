/** @format */

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { BarChart3, LineChart, Users, Zap } from 'lucide-react';
import Link from 'next/link';

//teste

export default function Home() {
	const content = [
		{
			icon: BarChart3,
			title: 'Dashboard de Vendas',
			description:
				'Visualize seus dados de vendas, ranking de produtos, vendedores e todos os indicarores relevantes para o seu negócio',
		},
		{
			icon: Users,
			title: 'Gerenciamento de Usuários',
			description:
				'Gerencie facilmente contas de usuários, funções e permissões com nossa interface de administração intuitiva',
		},
		{
			icon: LineChart,
			title: 'Marketing Analytics',
			description:
				'Obtenha insights profundos sobre seus esforços de marketing com nossa integração do Google Analytics e do Google Ads',
		},
	];

	return (
		<main className='w-full min-h-screen h-full xl:h-screen bg-background '>
			<div className=' container w-full mx-auto h-full relative pt-10 px-5 pb-5'>
				<div className='absolute top-5 right-5 z-40'>
					<ModeToggle />
				</div>
				<span className='absolute z-10 inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] md:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-background to-background' />

				<div className='flex relative h-full z-20 justify-center items-center text-center flex-col gap-5 px-5'>
					<Logo />
					<h2 className='2xl:text-nowrap text-center text-balance text-3xl lg:text-5xl 2xl:text-7xl font-bold'>
						Impulsione Sua{' '}
						<span className='text-primary'>Inteligência de Negócios</span>
					</h2>
					<p className='text-sm lg:text-xl 2xl:text-2xl text-balance text-foreground max-w-4xl'>
						Aproveite o poder das decisões baseadas em dados com a plataforma{' '}
						<strong className='text-primary'>JD Analytics</strong>
					</p>
					<Button
						size={'lg'}
						asChild
						className='text-lg mt-5'>
						<Link href={'/sign-in'}>
							Entrar na plataforma <Zap />
						</Link>
					</Button>
					<div className='grid mt-10 2xl:mt-32 gap-5 md:gap-10 grid-cols-1 md:grid-cols-3 relative'>
						{content.map((feature, index) => {
							return (
								<Card
									key={index}
									className=' bg-opacity-40 backdrop-blur-sm border-red-500/20 '>
									<CardHeader>
										<CardTitle className='flex text-left flex-col 2xl:flex-row items-start gap-2 text-red-500'>
											<feature.icon className='h-6 w-6 mr-2' />
											{feature.title}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription className='text-muted-foreground text-balance text-left'>
											{feature.description}
										</CardDescription>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</main>
	);
}
