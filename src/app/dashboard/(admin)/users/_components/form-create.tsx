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
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Este campo deve conter mais de 3 caracteres' })
		.max(50),
	email: z.string().email({ message: 'Email inválido' }),
	role: z.enum(['ADMIN', 'MANAGER', 'SELLER']),
	organizationName: z.enum(['JD Centro', 'JD Icaraí', 'JSEG']),
	password: z
		.string()
		.min(6, { message: 'A senha deve ter no mínimo 6 dígitos' }),
});

export default function FormCreate() {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			role: 'MANAGER',
			organizationName: 'JD Centro',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const { name, email, role, organizationName, password } = values;
		const timestamp = Date.now();
		const random = Math.floor(Math.random() * 100000);
		const externalID = `${timestamp}${random}`;

		startTransition(async () => {
			const response = await createUserAction(
				name,
				email,
				role,
				organizationName,
				password,
				externalID,
			);
			if (!response.ok) {
				console.log(response.error);
				toast.error('Algo deu errado');
			} else {
				const btn = document.getElementById('closeCreateUser');
				btn?.click();
				toast.success('Usuário cadastrado com sucesso');
			}
		});
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
									<SelectItem
										disabled
										value='JD Icaraí'>
										JD Icaraí
									</SelectItem>
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
									<SelectItem value='SELLER'>Vendedor</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Senha</FormLabel>
							<FormControl>
								<Input
									placeholder='senha do usuário'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogClose
					id='closeCreateUser'
					className='hidden'></DialogClose>
				<Button
					className='disabled:opacity-70 w-full mt-5'
					disabled={isPending}>
					Adicionar Usuário
					{isPending && <Loader2 className='animate-spin' />}
				</Button>
			</form>
		</Form>
	);
}
