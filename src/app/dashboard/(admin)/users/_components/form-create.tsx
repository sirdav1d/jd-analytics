/** @format */

'use client';

import { createUserAction } from '@/actions/user/create';
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
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email(),
	role: z.enum(['ADMIN', 'MANAGER']),
	organizationName: z.enum(['JD Centro', 'JD Icaraí', 'JSEG']),
});

export default function FormCreate() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			role: 'MANAGER',
			organizationName: 'JD Centro',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const { name, email, role, organizationName } = values;
		const response = await createUserAction(
			name,
			email,
			role,
			organizationName,
		);
		if (!response.ok) {
			toast.error('Algo deu errado', { description: String(response.error) });
		} else {
			toast.success('Usuário cadastrado com sucesso');
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
					name='organizationName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Unidade</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className='w-full col-span-3'>
										<SelectValue placeholder='Selecione a Unidade' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='JD Centro'>JD Centro</SelectItem>
									<SelectItem value='JD Icaraí'>JD Icaraí</SelectItem>
									<SelectItem value='JSEG'>JSEG</SelectItem>
								</SelectContent>
							</Select>
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
								Adicionar Usuário
								<Loader2 className='animate-spin' />
							</>
						) : (
							<>
								Adicionar Usuário <ArrowRight />
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
