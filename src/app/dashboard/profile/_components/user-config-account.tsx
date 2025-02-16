/** @format */

'use client';
import { updateUserAction } from '@/actions/user/update';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, HelpCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z
	.object({
		newPassword: z
			.string()
			.min(6, { message: 'Este campo deve conter no mínimo 6 dígitos' }),
		confirmPassword: z
			.string()
			.min(6, { message: 'Este campo deve conter no mínimo 6 dígitos' }),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'As senhas devem ser iguais',
		path: ['confirmPassword'], // o erro será associado a este campo
	});

export default function UserConfigAccount({
	userEmail,
}: {
	userEmail: string;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const { newPassword } = values;

		const response = await updateUserAction({
			userUp: { password: newPassword, email: userEmail },
		});
		if (!response.ok) {
			toast.error('Algo deu errado', { description: String(response.error) });
		} else {
			toast.success('Usuário atualizado com sucesso');
			form.reset();
		}
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg md:text-2xl'>
					Configurações de Conta
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='grid gap-4 py-4'>
						<FormField
							control={form.control}
							name='newPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nova Senha</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Digite sua nova senha'
											{...field}
										/>
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
									<FormLabel>Confirmação de Senha</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Confirme sua nova senha'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={
								form.formState.isLoading ||
								form.formState.isSubmitting ||
								!form.formState.isValid
							}
							className='mt-5 disabled:opacity-70'>
							{form.formState.isLoading || form.formState.isSubmitting ? (
								<>
									Salvar Configurações <Loader2 className='animate-spin' />
								</>
							) : (
								<>
									Salvar Configurações <ArrowRight />
								</>
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter>
				<div className='flex items-center space-x-4'>
					<HelpCircle className='text-red-600' />
					<div>
						<p className='font-medium'>Contato do Suporte Técnico</p>
						<p className='text-muted-foreground'>ddavid.diniz@gmaill.com</p>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
