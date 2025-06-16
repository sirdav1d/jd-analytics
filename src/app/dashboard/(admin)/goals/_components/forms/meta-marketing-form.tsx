/** @format */

/** @format */

'use client';

import { CreateRoasGoalAction } from '@/actions/roasGoal/create';
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
import z from 'zod';

const formSchema = z.object({
	roas: z.number({
		coerce: true,
		required_error: 'É necessário incluir uma meta de roas',
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

export default function MetaMarketingForm() {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			roas: 10,
			month: new Date().getMonth(),
			year: new Date().getFullYear(),
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { roas, month, year } = values;
		const goalDateRef = new Date(year, month);

		startTransition(async () => {
			const resp = await CreateRoasGoalAction({
				goalDateRef: goalDateRef,
				roas: roas,
			});

			if (!resp.ok) {
				console.log(resp.error);
				if (
					String(resp.error).includes(
						'Unique constraint failed on the fields: (`goalDateRef`)',
					)
				) {
					toast.error(`Já existe uma meta cadastrada para o mês selecionado`);
				} else {
					toast.error('Algo deu errado, tente novamente');
				}
			} else {
				const btn = document.getElementById('closeMarketingCreate');
				btn?.click();
				toast.success(`Meta atualizada com sucesso: ROAS: ${resp.goal?.roas}`);
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className=' gap-5 grid items-start'>
					<FormField
						control={form.control}
						name='roas'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Valor de ROAS desejado</FormLabel>
								<FormControl>
									<Input
										required
										placeholder='Digite uma meta de faturamento'
										type='text'
										inputMode='numeric'
										{...field}
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
									<FormLabel>Ano</FormLabel>
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
				</div>
				<DialogClose
					id='closeMarketingCreate'
					className='hidden'></DialogClose>
				<Button
					disabled={isPending}
					type='submit'
					className='bg-red-600 w-full text-white hover:bg-red-700 mt-5'>
					Salvar {isPending && <Loader2 className='animate-spin' />}
				</Button>
			</form>
		</Form>
	);
}
