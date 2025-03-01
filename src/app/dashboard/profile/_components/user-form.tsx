/** @format */
'use client';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Este campo deve conter no mínimo 3 dígitos' })
		.max(30, 'Este campo deve conter no máximo 30 dígitos'),
});

export default function UserForm({
	name,
	email,
}: {
	name: string;
	email: string;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: name ?? '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { name } = values;
		const response = await updateUserAction({
			userUp: { name: name, email: email },
		});
		form.setValue('name', name);

		if (!response.ok) {
			toast.error('Algo deu errado', { description: String(response.error) });
		} else {
			toast.success('Usuário atualizado com sucesso');
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col md:flex-row gap-5 md:items-end w-full md:justify-between '>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome Completo</FormLabel>
							<FormControl>
								<Input
									className='w-full min-w-48 md:min-w-60 text-sm'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					disabled={form.formState.isLoading || form.formState.isSubmitting}
					className='disabled:opacity-70 w-full md:w-fit'>
					{form.formState.isLoading || form.formState.isSubmitting ? (
						<>
							Atualizar <Loader2 className='animate-spin' />
						</>
					) : (
						<>
							Atualizar <ArrowRight />
						</>
					)}
				</Button>
			</form>
		</Form>
	);
}
