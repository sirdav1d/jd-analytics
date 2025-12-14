/** @format */

'use client';

import { UpsertMetaInvestmentAction } from '@/actions/meta-investment/upsert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isValid, parseISO } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const formSchema = z.object({
	periodEnd: z.string().nonempty('Selecione a data final (inclusive)'),
	totalInvestment: z
		.number({
			coerce: true,
			required_error: 'Informe o valor acumulado do periodo',
		})
		.positive('Informe um valor maior que zero'),
});

export default function MetaInvestmentForm() {
	const [isPending, startTransition] = useTransition();
	const todayISO = new Date().toISOString().split('T')[0];

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			periodEnd: todayISO,
			totalInvestment: 0,
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(async () => {
			const resp = await UpsertMetaInvestmentAction({
				periodEnd: new Date(values.periodEnd),
				totalInvestment: values.totalInvestment,
			});

			if (!resp.ok) {
				console.error(resp.error);
				toast.error('Nao foi possivel salvar o investimento. Tente novamente.');
				return;
			}

			toast.success('Investimento atualizado com sucesso.');
		});
	}

	return (
		<Form {...form}>
			<form
				className='space-y-4'
				onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name='periodEnd'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Data final</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='outline'
											className={cn(
												'w-full justify-start text-left font-normal',
												!field.value && 'text-muted-foreground',
											)}>
											<CalendarIcon className='mr-2 h-4 w-4' />
											{field.value
												? format(
														isValid(parseISO(field.value))
															? parseISO(field.value)
															: new Date(field.value),
														'dd/MM/yyyy',
													)
												: 'Selecione a data'}
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent
									className='w-auto p-0'
									align='start'>
									<Calendar
										mode='single'
										selected={
											field.value && isValid(new Date(field.value))
												? new Date(field.value)
												: undefined
										}
										onSelect={(date) => {
											if (date) {
												field.onChange(format(date, 'yyyy-MM-dd'));
											}
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
							<FormDescription>
								Preencha com a data final do perヴodo analisado, geralmente a
								カltima segunda feira
							</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='totalInvestment'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Valor acumulado no mês (R$)</FormLabel>
							<FormControl>
								<Input
									inputMode='numeric'
									placeholder='Ex: 2000'
									value={
										Number.isFinite(field.value)
											? Intl.NumberFormat('pt-BR', {
													style: 'currency',
													currency: 'BRL',
											  }).format(field.value)
											: field.value
									}
									onChange={(e) => {
										const raw = e.target.value.replace(/[^0-9]/g, '');
										const asNumber = Number(raw) / 100;
										field.onChange(asNumber);
									}}
								/>
							</FormControl>
							<FormMessage />
							<FormDescription>
								Preencha com o valor total investido do dia 01 até a data final,
								preenchida acima
							</FormDescription>
						</FormItem>
					)}
				/>
				<Button
					type='submit'
					disabled={isPending}
					className='w-full'>
					Salvar {isPending && <Loader2 className='animate-spin h-4 w-4' />}
				</Button>
			</form>
		</Form>
	);
}
