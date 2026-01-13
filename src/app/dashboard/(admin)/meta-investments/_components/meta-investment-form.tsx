/** @format */

'use client';

import { upsertMetaInvestment } from '@/lib/api/meta-investments';
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
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const formSchema = z.object({
	periodEnd: z.string().nonempty('Selecione a data final (inclusive)'),
	totalInvestment: z
		.number({
			coerce: true,
			required_error: 'Informe o valor acumulado do período',
		})
		.positive('Informe um valor maior que zero'),
});

type MetaInvestmentFormValues = z.infer<typeof formSchema>;

interface MetaInvestmentFormProps {
	defaultValues?: Partial<MetaInvestmentFormValues>;
	mode?: 'create' | 'edit';
	onSuccess?: () => void;
}

const toInputDate = (dateStr?: string) => {
	if (!dateStr) return null;
	const parsed = new Date(dateStr);
	if (Number.isNaN(parsed.getTime())) return null;
	const year = parsed.getUTCFullYear();
	const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
	const day = String(parsed.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export default function MetaInvestmentForm({
	defaultValues,
	mode = 'create',
	onSuccess,
}: MetaInvestmentFormProps) {
	const [isPending, startTransition] = useTransition();
	const todayISO = new Date().toISOString().split('T')[0];
	const router = useRouter();

	const initialPeriodEnd =
		toInputDate(defaultValues?.periodEnd) ?? todayISO;
	const initialTotalInvestment =
		Number.isFinite(defaultValues?.totalInvestment)
			? Number(defaultValues?.totalInvestment)
			: 0;

	const form = useForm<MetaInvestmentFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			periodEnd: initialPeriodEnd,
			totalInvestment: initialTotalInvestment,
		},
	});

	useEffect(() => {
		form.reset({
			periodEnd: initialPeriodEnd,
			totalInvestment: initialTotalInvestment,
		});
	}, [form, initialPeriodEnd, initialTotalInvestment]);

	async function onSubmit(values: MetaInvestmentFormValues) {
		startTransition(async () => {
			const resp = await upsertMetaInvestment({
				periodEnd: values.periodEnd,
				totalInvestment: values.totalInvestment,
			});

			if (!resp.ok) {
				console.error(resp.error);
				toast.error('Não foi possível salvar o investimento. Tente novamente.');
				return;
			}

			toast.success(
				mode === 'edit'
					? 'Investimento atualizado com sucesso.'
					: 'Investimento registrado com sucesso.',
			);
			router.refresh();
			onSuccess?.();
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
					render={({ field }) => {
						const parsedDate = field.value ? parseISO(field.value) : null;
						const displayDate = parsedDate
							? isValid(parsedDate)
								? format(parsedDate, 'dd/MM/yyyy')
								: 'Selecione a data'
							: 'Selecione a data';

						return (
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
												{displayDate}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className='w-auto p-0'
										align='start'>
										<Calendar
											mode='single'
											selected={
												parsedDate && isValid(parsedDate) ? parsedDate : undefined
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
									Preencha com a data final do período analisado, geralmente a
									última segunda-feira
								</FormDescription>
							</FormItem>
						);
					}}
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
					{mode === 'edit' ? 'Atualizar' : 'Salvar'}{' '}
					{isPending && <Loader2 className='animate-spin h-4 w-4' />}
				</Button>
			</form>
		</Form>
	);
}
