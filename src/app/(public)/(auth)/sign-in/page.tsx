/** @format */

import Logo from '@/components/logo';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { SignInForm } from './_components/sign-in-form';
import Image from 'next/image';
import svg from '@/assets/data-analysis.svg';

export default function SignIn() {
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				<div className='flex justify-between  w-full gap-2'>
					<Logo />
					<ModeToggle />
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<div className='flex flex-col items-center gap-1 text-center'>
						<h1 className='text-2xl font-bold capitalize'>
							Entre em sua conta
						</h1>
						<p className='text-balance text-sm text-muted-foreground max-w-xs'>
							Preencha seus dados abaixo para entrar na plataforma
						</p>

						<div className='w-full max-w-xs text-left mt-5'>
							<SignInForm />
						</div>
					</div>
				</div>
			</div>
			<div className='relative hidden bg-muted lg:flex items-center justify-center'>
				<Image
					src={svg}
					alt='Analise de dados'
					width={580}
					height={180}></Image>
			</div>
		</div>
	);
}
