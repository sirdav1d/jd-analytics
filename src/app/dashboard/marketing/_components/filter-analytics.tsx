/** @format */

'use client';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, format } from 'date-fns';
import { Loader2, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function FilterAnalytics() {
	const searchParams = useSearchParams();
	const [dateRange, setDateRange] = useState({
		to: searchParams.get('endDate') || new Date(),
		from: searchParams.get('startDate') || addDays(new Date(), -7),
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleDateChange = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.stopPropagation();
		e.preventDefault();

		if (dateRange.from && dateRange.to) {
			const formattedFrom = format(dateRange.from, 'yyyy-MM-dd');
			const formattedTo = format(dateRange.to, 'yyyy-MM-dd');

			// Atualiza a URL sem recarregar a página (opção shallow para evitar recarregamento total)
			startTransition(async () => {
				router.push(
					`/dashboard/marketing?startDate=${encodeURIComponent(
						formattedFrom,
					)}&endDate=${encodeURIComponent(formattedTo)}`,
					{ scroll: false },
				);
			});
		}

		// Atualiza a URL com os parâmetros de data
	};

	return (
		<div className='md:w-fit flex-wrap flex items-center flex-col md:flex-row  w-full gap-4 h-fit'>
			<Button
				onClick={(e) => handleDateChange(e)}
				className='disabled:opacity-70 w-full md:w-fit'
				disabled={isPending}>
				{isPending ? (
					<>
						Atualizar <Loader2 className='animate-spin' />
					</>
				) : (
					<>
						Atualizar <Zap />
					</>
				)}
			</Button>
			<DatePickerWithRange
				date={dateRange}
				setDate={(e) =>
					setDateRange({ from: e?.from ?? new Date(), to: e?.to ?? new Date() })
				}
			/>

			{/* <Select
				value={trafficSource}
				onValueChange={setTrafficSource}>
				<SelectTrigger className='w-full md:w-48'>
					<SelectValue placeholder='Fonte de Tráfego' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Todas as Fontes</SelectItem>
					<SelectItem value='Organic Search'>Orgânico</SelectItem>
					<SelectItem value='Paid Search'>Pago</SelectItem>
					<SelectItem value='Organic Social'>Social</SelectItem>
					<SelectItem value='Direct'>Direto</SelectItem>
				</SelectContent>
			</Select> */}
		</div>
	);
}
