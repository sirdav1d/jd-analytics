/** @format */

'use client';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { addDays, format } from 'date-fns';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';

export default function Filters() {
	const [dateRange, setDateRange] = useState({
		from: new Date(),
		to: addDays(new Date(), 7),
	});
	const [trafficSource, setTrafficSource] = useState('all');
	const [campaign, setCampaign] = useState('all');

	const router = useRouter();

	const handleDateChange = (e: DateRange | undefined) => {
		if (e?.from && e?.to) {
			const formattedFrom = format(e.from, 'yyyy-MM-dd');
			const formattedTo = format(e.to, 'yyyy-MM-dd');
			// Atualiza a URL sem recarregar a página (opção shallow para evitar recarregamento total)
			router.push(
				`/dashboard/marketing?startDate=${encodeURIComponent(
					formattedFrom,
				)}&endDate=${encodeURIComponent(formattedTo)}`,
			);
			setDateRange({ from: e?.from, to: e.to });
		}
		// Atualiza a URL com os parâmetros de data
	};
	return (
		<>
			<DatePickerWithRange
				date={dateRange}
				setDate={(e) => handleDateChange(e)}
			/>
			<Select
				value={trafficSource}
				onValueChange={setTrafficSource}>
				<SelectTrigger className='w-full md:w-48'>
					<SelectValue placeholder='Fonte de Tráfego' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Todas as Fontes</SelectItem>
					<SelectItem value='organic'>Orgânico</SelectItem>
					<SelectItem value='paid'>Pago</SelectItem>
					<SelectItem value='social'>Social</SelectItem>
				</SelectContent>
			</Select>
			<Select
				value={campaign}
				onValueChange={setCampaign}>
				<SelectTrigger className='w-full md:w-48'>
					<SelectValue placeholder='Campanha' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Todas as Campanhas</SelectItem>
					<SelectItem value='summer'>Verão 2023</SelectItem>
					<SelectItem value='blackfriday'>Black Friday</SelectItem>
					<SelectItem value='christmas'>Natal</SelectItem>
				</SelectContent>
			</Select>
		</>
	);
}
