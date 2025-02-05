/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Briefcase, HelpCircle, Mail, Moon, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function UserProfile() {
	const [isEditing, setIsEditing] = useState(false);
	const { theme, setTheme } = useTheme();

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } },
	};

	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={fadeIn}
				className='grid grid-cols-1 md:grid-cols-2 gap-5'>
				<Card>
					<CardHeader>
						<CardTitle className=' flex justify-between items-center'>
							Informações do Usuário
							<Button onClick={() => setIsEditing(!isEditing)}>
								{isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-8 '>
						<div className='flex items-center space-x-4'>
							<User className='text-red-600' />
							<div>
								<p className='font-medium'>Nome Completo</p>
								{isEditing ? (
									<Input
										defaultValue='John Doe'
										className='mt-1'
									/>
								) : (
									<p className='text-muted-foreground'>John Doe</p>
								)}
							</div>
						</div>
						<div className='flex items-center space-x-4'>
							<Mail className='text-red-600' />
							<div>
								<p className='font-medium'>E-mail Corporativo</p>
								<p className='text-muted-foreground text-sm'>
									john.doe@empresa.com
								</p>
							</div>
						</div>
						<div className='flex items-center space-x-4'>
							<Briefcase className='text-red-600' />
							<div>
								<p className='font-medium'>Cargo na Empresa</p>
								<p className='text-muted-foreground text-sm'>Gerente de Loja</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Account Settings */}
				<Card>
					<CardHeader>
						<CardTitle className=''>Configurações de Conta</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='current-password'>Senha Atual</Label>
							<Input
								id='current-password'
								type='password'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='new-password'>Nova Senha</Label>
							<Input
								id='new-password'
								type='password'
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='confirm-password'>Confirmar Nova Senha</Label>
							<Input
								id='confirm-password'
								type='password'
							/>
						</div>
						<div className='flex items-center space-x-2'>
							<Switch
								id='theme-mode'
								checked={theme === 'dark'}
								onCheckedChange={() =>
									setTheme(theme === 'light' ? 'dark' : 'light')
								}
							/>
							<Label htmlFor='theme-mode'>Modo Escuro</Label>
							{theme === 'light' ? (
								<Sun className='ml-2' />
							) : (
								<Moon className='ml-2' />
							)}
						</div>
					</CardContent>
					<CardFooter>
						<Button>Salvar Configurações</Button>
					</CardFooter>
				</Card>

				{/* Support Section */}
			</motion.div>
			<Card>
				<CardHeader>
					<CardTitle className='w-full'>Suporte</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex items-center space-x-4'>
						<HelpCircle className='text-red-600' />
						<div>
							<p className='font-medium'>Contato do Suporte Técnico</p>
							<p className='text-muted-foreground'>suporte@empresa.com</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
