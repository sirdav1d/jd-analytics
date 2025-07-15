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

import { UpdateSalesGoalAction } from '@/actions/goals/update';
import { DialogClose } from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { CurrentGoal } from '../../_components/data-table-current-goal/columns';

interface IMetaComercialFormUpdate {
	goal: CurrentGoal;
	seller: string;
	goalId: string;
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

const MONTHS = [
	{ value: '01', label: 'Janeiro' },
	{ value: '02', label: 'Fevereiro' },
	{ value: '03', label: 'Março' },
	{ value: '04', label: 'Abril' },
	{ value: '05', label: 'Maio' },
	{ value: '06', label: 'Junho' },
	{ value: '07', label: 'Julho' },
	{ value: '08', label: 'Agosto' },
	{ value: '09', label: 'Setembro' },
	{ value: '10', label: 'Outubro' },
	{ value: '11', label: 'Novembro' },
	{ value: '12', label: 'Dezembro' },
];

export default function UpdateComercialForm({
	goal,
	seller,
	goalId,
}: IMetaComercialFormUpdate) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			seller: seller ?? '',
			goal: Number(goal.revenue) ?? 0,
			month: new Date().getMonth(),
			year: new Date().getFullYear(),
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { goal } = values;

		startTransition(async () => {
			const resp = await UpdateSalesGoalAction({
				goalId,
				revenue: goal,
			});

			if (!resp.ok) {
				console.log(resp.error);
				toast.error('Algo deu errado, tente novamente');
			} else {
				const btn = document.getElementById('closeComercialUpdate');
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
							<FormControl>
								<Input
									disabled
									required
									type='text'
									{...field}
									value={seller}
								/>
							</FormControl>
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
									disabled
									required
									onValueChange={field.onChange}
									defaultValue={field.value.toString()}>
									<FormControl>
										<SelectTrigger className='w-[220px]'>
											<SelectValue placeholder='Selecione o mês' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{MONTHS.map((item, index) => (
											<SelectItem
												key={index}
												value={`${index}`}>
												{item.label}
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
										disabled
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

				<DialogClose
					id='closeComercialUpdate'
					className='hidden'></DialogClose>
				<Button
					disabled={isPending}
					type='submit'
					className='mt-5 w-full'>
					Atualizar {isPending && <Loader2 className='animate-spin' />}
				</Button>
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
