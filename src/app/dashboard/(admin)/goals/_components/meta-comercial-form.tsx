/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { CreateSalesGoalAction } from '@/actions/goals/create';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';

interface IMetaComercialForm {
	sellers: { name: string; id: string }[];
}

const formSchema = z.object({
	seller: z.string({
		coerce: true,
		required_error: 'É necessário incluir um vendedor',
	}),
	goal: z.number({
		coerce: true,
		required_error: 'É necessário incluir uma meta',
	}),
	month: z.number({
		coerce: true,
		required_error: 'É necessário incluir um mês',
	}),
	year: z.number({
		coerce: true,
		required_error: 'É necessário incluir um ano',
	}),
});

export default function MetaComercialForm({ sellers }: IMetaComercialForm) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			seller: '',
			goal: 0,
			month: new Date().getMonth(),
			year: new Date().getFullYear(),
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { goal, month, seller, year } = values;
		const goalDateRef = new Date(year, month);

		startTransition(async () => {
			const resp = await CreateSalesGoalAction({
				goalDateRef: goalDateRef,
				revenue: goal,
				userId: seller,
			});

			if (!resp.ok) {
				console.log(resp.error);
				toast.error('Algo deu errado, tente novamente');
			} else {
				const btn = document.getElementById('closeComercialCreate');
				btn?.click();
				toast.success(
					`Meta atualizada com sucesso: ${resp.goal?.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'brl' })}`,
				);
			}
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-5'>
				<FormField
					control={form.control}
					name='seller'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Vendedor</FormLabel>
							<Select
								required
								onValueChange={field.onChange}
								defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Selecione um vendedor' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{sellers.map((seller, index) => {
										return (
											<SelectItem
												key={index}
												value={seller.id}>
												{seller.name}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='goal'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Valor da Meta</FormLabel>
							<FormControl>
								<Input
									required
									placeholder='Digite uma meta de faturamento'
									type='text'
									inputMode='numeric'
									value={formatCurrency(field.value)}
									onChange={(e) => {
										const raw = e.target.value.replace(/\D/g, '');
										const numeric = Number(raw) / 100;
										form.setValue('goal', numeric, { shouldValidate: true });
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='justify-between gap-5 flex items-center'>
					<FormField
						control={form.control}
						name='month'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Mês</FormLabel>
								<Select
									required
									onValueChange={field.onChange}
									defaultValue={field.value.toString()}>
									<FormControl>
										<SelectTrigger className='w-[220px]'>
											<SelectValue placeholder='Selecione o mês' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.from({ length: 12 }).map((_, index) => (
											<SelectItem
												key={index}
												value={`${index}`}>
												{index + 1}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='year'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Valor da Meta</FormLabel>
								<FormControl>
									<Input
										required
										type='number'
										min={2025}
										placeholder='Selecione o ano'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex items-center justify-end gap-5 mt-5'>
					<DialogClose
						id='closeComercialCreate'
						asChild>
						<Button variant={'outline'}>Voltar</Button>
					</DialogClose>
					<Button
						disabled={isPending}
						type='submit'
						className=''>
						Definir Meta Comercial{' '}
						{isPending && <Loader2 className='animate-spin' />}
					</Button>
				</div>
			</form>
		</Form>
	);
}

function formatCurrency(value: number) {
	if (!value) return '';
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
}
