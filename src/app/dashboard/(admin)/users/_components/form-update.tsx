/** @format */

'use client';

import { updateUserAction } from '@/actions/user/update';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().min(2).max(50).optional(),
	email: z.string().email().optional(),
	role: z.enum(['ADMIN', 'MANAGER']).optional(),
});

export default function FormUpdate({ user }: { user: Partial<User> }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user.name ?? '',
			email: user.email ?? '',
			role: user.role ?? 'MANAGER',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const { name, email, role } = values;
		const response = await updateUserAction(name, email, role);
		if (!response.ok) {
			toast.error('Algo deu errado', { description: String(response.error) });
		} else {
			toast.success('Usuário atualizado com sucesso');
			form.reset();
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='grid gap-4 py-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input
									placeholder='Nome do usuário'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder='E-mail do usuário'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='role'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cargo</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className='w-full col-span-3'>
										<SelectValue placeholder='Selecione o Cargo' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='ADMIN'>Administrador</SelectItem>
									<SelectItem value='MANAGER'>Gerente</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='mt-5 flex gap-4 items-center justify-end'>
					<DialogClose asChild>
						<Button
							type='button'
							variant={'outline'}>
							Voltar
						</Button>
					</DialogClose>

					<Button
						className='disabled:opacity-70'
						disabled={form.formState.isLoading || form.formState.isSubmitting}>
						{form.formState.isLoading || form.formState.isSubmitting ? (
							<>
								Atualizar Usuário
								<Loader2 className='animate-spin' />
							</>
						) : (
							<>
								Atualizar Usuário <ArrowRight />
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
