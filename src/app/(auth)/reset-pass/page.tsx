/** @format */

import Logo from '@/components/logo';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ResetPassForm } from './_components/reset-pass-form';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function ResetPassPage() {
	return (
		<div className='grid min-h-svh lg:grid-cols-2'>
			<div className='flex flex-col gap-4 p-6 md:p-10'>
				<div className='flex justify-between  w-full gap-2'>
					<Logo />
					<ModeToggle />
				</div>
				<div className='flex flex-1 items-center justify-center'>
					<div className='flex flex-col items-center gap-2 text-center'>
						<h1 className='text-2xl font-bold capitalize'>
							Esqueceu sua senha?
						</h1>
						<p className='text-balance text-sm text-muted-foreground max-w-sm'>
							Preencha seu e-mail abaixo para receber uma nova senha
						</p>

						<div className='w-full max-w-xs mt-5 text-left'>
							<ResetPassForm />
						</div>
						<Separator className='my-5' />

						<Link
							href='/sign-in'
							className=' text-sm underline-offset-4 hover:underline flex gap-1 items-center'>
							<ArrowLeft size={16} />
							Voltar para login
						</Link>
					</div>
				</div>
			</div>
			<div className='relative hidden bg-muted lg:flex items-center justify-center'>
				<Image
					src={'/Dark-analytics-bro.svg'}
					alt='Analise de dados'
					width={580}
					height={180}></Image>
			</div>
		</div>
	);
}
