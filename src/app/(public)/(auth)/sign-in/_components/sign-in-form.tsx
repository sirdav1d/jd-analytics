/** @format */
'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	email: z.string().email({ message: 'Digite um e-mail válido' }),
	password: z
		.string()
		.min(6, { message: 'A senha deve conter no mínimo 6 dígitos' }),
});

export function SignInForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'form'>) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const email = values.email;
		const password = values.password;
		const response = await signIn('credentials', {
			email,
			password,
			redirect: false,
		});

		if (response?.ok) {
			router.refresh();
			router.push('/dashboard');
			toast.success('Usuário Logado com sucesso');
			form.reset();
		} else {
			toast.error('E-mail ou senha inválidos');
		}
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn('flex flex-col gap-6 mt-5', className)}
					{...props}>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-mail</FormLabel>
								<FormControl>
									<Input
										type='email'
										placeholder='admin@email.com'
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-xs' />
							</FormItem>
						)}></FormField>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='justify-between flex'>
									Senha{' '}
									<Link
										href='/reset-pass'
										className='ml-auto text-sm underline-offset-4 hover:underline'>
										Esqueceu sua senha?
									</Link>
								</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='Digite sua senha'
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-xs' />
							</FormItem>
						)}></FormField>

					<Button
						disabled={
							form.formState.isSubmitting ||
							form.formState.isLoading ||
							!form.formState.isValid
						}
						type='submit'
						className='w-full font-semibold disabled:opacity-70'>
						{form.formState.isSubmitting || form.formState.isLoading ? (
							<>
								Entrar
								<Loader2 className='animate-spin' />
							</>
						) : (
							<>Entrar</>
						)}
					</Button>
				</form>
			</Form>
		</>
	);
}
