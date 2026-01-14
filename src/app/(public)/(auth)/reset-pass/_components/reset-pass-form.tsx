/** @format */
'use client';

import { SendMailAction } from '@/actions/email/send-email';
import { updateUserAction } from '@/actions/user/update';
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
import { generatePasswordWithUUID } from '@/utils/generate-pass';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	email: z
		.string({ coerce: true, required_error: 'Este campo é obrigatório' })
		.email({ message: 'Este campo é obrigatório' }),
});

export function ResetPassForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'form'>) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.

		startTransition(async () => {
			const pass = generatePasswordWithUUID();
			const { email } = values;
			const updatedUser = await updateUserAction({
				userUp: { password: pass, email: email },
			});
			const resp = await SendMailAction({
				email: email,
				subject: 'Resetar senha',
				message: `Sua nova senha é ${pass}`,
			});
		
			if (!resp.ok || !updatedUser.ok) {
				console.log(resp.error, updatedUser.error);
				toast.error('Algo deu errado');
			} else {
				toast.success('Senha resetada, verifique seu e-mail');
				form.reset();
			}
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn('flex flex-col gap-5', className)}
				{...props}>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder='email@email.com'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					disabled={isPending}
					type='submit'
					className='w-full font-semibold'>
					Resetar Senha
					{isPending && <Loader2 className='animate-spin' />}
				</Button>
			</form>
		</Form>
	);
}
