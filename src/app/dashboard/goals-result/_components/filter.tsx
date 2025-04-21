/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { addDays, format } from 'date-fns';
import { Loader2, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function Filter() {
	const vendedoresData = [
		{
			name: 'PAULO',
			meta: 143000,
			realizado: 137761.22,
			percentual: 96,
			metaProjetada: 275522.44,
			metaProjetadaPercentual: 193,
		},
		{
			name: 'WELITON',
			meta: 120000,
			realizado: 35405.01,
			percentual: 30,
			metaProjetada: 70810.02,
			metaProjetadaPercentual: 59,
		},
		{
			name: 'LUCAS SILVEIRA',
			meta: 55000,
			realizado: 18372.6,
			percentual: 33,
			metaProjetada: 55117.8,
			metaProjetadaPercentual: 100,
		},
		{
			name: 'B2B JOYCE',
			meta: 90000,
			realizado: 20222.1,
			percentual: 22,
			metaProjetada: 60666.3,
			metaProjetadaPercentual: 67,
		},
	];

	const searchParams = useSearchParams();
	const [dateRange, setDateRange] = useState({
		to: searchParams.get('endDate') || new Date(),
		from: searchParams.get('startDate') || addDays(new Date(), -7),
	});

	const [selectedVendedor, setSelectedVendedor] = useState('all');
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
					`/dashboard/goals-result?startDate=${encodeURIComponent(
						formattedFrom,
					)}&endDate=${encodeURIComponent(
						formattedTo,
					)}&vendor=${selectedVendedor}`,
					{ scroll: false },
				);
			});
		}

		// Atualiza a URL com os parâmetros de data
	};

	return (
		<div className=' flex items-center flex-col md:flex-row  w-full gap-4 h-fit'>
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

			<Select
				value={selectedVendedor}
				onValueChange={setSelectedVendedor}>
				<SelectTrigger className='w-full md:max-w-[220px] border-2'>
					<SelectValue placeholder='Selecione um vendedor' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Todos os Vendedores</SelectItem>
					{vendedoresData.map((vendedor, index) => (
						<SelectItem
							key={index}
							value={vendedor.name.toLowerCase()}>
							{vendedor.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
