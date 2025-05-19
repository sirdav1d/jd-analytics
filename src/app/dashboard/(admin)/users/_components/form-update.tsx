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
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Este campo deve conter mais de 3 caracteres' })
		.max(50)
		.optional(),
	email: z.string().email({ message: 'Email inválido' }).optional(),
	role: z.enum(['ADMIN', 'MANAGER', 'SELLER']).optional(),
	password: z.string().optional(),
});

export default function FormUpdate({ user }: { user: Partial<User> }) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user.name ?? '',
			email: user.email ?? '',
			role: user.role ?? 'MANAGER',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const { name, email, role, password } = values;

		startTransition(async () => {
			const response = await updateUserAction({
				userUp: { name, email, role, password },
			});
			if (!response.ok) {
				console.log(response.error);
				toast.error('Algo deu errado');
			} else {
				const btn = document.getElementById('closeUpUser');
				btn?.click();
				toast.success('Usuário atualizado com sucesso');
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
									placeholder='Senha do usuário'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DialogClose
					id='closeUpUser'
					className='hidden'></DialogClose>

				<Button
					className='disabled:opacity-70 mt-5 w-full'
					disabled={isPending}>
					Atualizar Usuário
					{isPending && <Loader2 className='animate-spin' />}
				</Button>
			</form>
		</Form>
	);
}
