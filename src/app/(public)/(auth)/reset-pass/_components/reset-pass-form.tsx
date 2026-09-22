/** @format */
'use client';

import {
	completePasswordResetAction,
	resetPasswordAction,
} from '@/actions/user/reset-password';
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
import { useTransition } from 'react';
import { type Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const requestSchema = z.object({
	email: z
		.coerce.string<string>({ error: 'Este campo é obrigatório' })
		.pipe(z.email({ error: 'Este campo é obrigatório' })),
});
const redeemSchema = z.object({
	newPassword: z.string().min(12, 'Use pelo menos 12 caracteres'),
	confirmPassword: z.string(),
}).refine((value) => value.newPassword === value.confirmPassword, {
	message: 'As senhas não coincidem',
	path: ['confirmPassword'],
});

type ResetPassFormValues = {
	email?: string;
	newPassword?: string;
	confirmPassword?: string;
};

export function ResetPassForm({
	token,
	className,
	...props
}: React.ComponentPropsWithoutRef<'form'> & { token?: string }) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<ResetPassFormValues>({
		resolver: zodResolver(token ? redeemSchema : requestSchema) as Resolver<ResetPassFormValues>,
		defaultValues: {
			email: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: ResetPassFormValues) {
		startTransition(async () => {
			try {
				if (token) {
					const result = await completePasswordResetAction({
						token,
						newPassword: values.newPassword,
					});
					if (!result.ok) {
						toast.error('Este link é inválido, expirou ou já foi usado');
						return;
					}
					toast.success('Senha alterada com sucesso');
					form.reset();
					return;
				}
				await resetPasswordAction({ email: values.email });
			} catch {
				toast.error('Algo deu errado');
				return;
			}
			toast.success('Se a conta existir, enviaremos um link de recuperação');
			form.reset();
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn('flex flex-col gap-5', className)}
				{...props}>
				{token ? (
					<>
						<FormField
							control={form.control}
							name='newPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nova senha</FormLabel>
									<FormControl>
										<Input type='password' autoComplete='new-password' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirmar nova senha</FormLabel>
									<FormControl>
										<Input type='password' autoComplete='new-password' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				) : (
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder='email@email.com' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
				<Button
					disabled={isPending}
					type='submit'
					className='w-full font-semibold'>
					{token ? 'Escolher nova senha' : 'Enviar link de recuperação'}
					{isPending && <Loader2 className='animate-spin' />}
				</Button>
			</form>
		</Form>
	);
}
