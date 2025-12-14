/** @format */

'use client';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { addDays, format, isValid, parseISO } from 'date-fns';
import { Loader2, Zap } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getDefaultDateRange } from '@/utils/date-range';

interface CampaignProps {
	resource_name: string;
	status: number;
	name: string;
	id: number;
}

export interface CampagnComponentProps {
	campaign: CampaignProps;
}

interface DataProps {
	data: CampagnComponentProps[];
}

export default function Filters({ data }: DataProps) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const defaultRange = getDefaultDateRange();

	const resolveDate = (value: string | null, fallback: Date) => {
		if (!value) return fallback;
		const parsed = parseISO(value);
		return isValid(parsed) ? parsed : fallback;
	};

	const [dateRange, setDateRange] = useState<DateRange>({
		from: resolveDate(searchParams.get('startDate'), defaultRange.from),
		to: resolveDate(searchParams.get('endDate'), defaultRange.to),
	});
	const [trafficSource, setTrafficSource] = useState(
		searchParams.get('channel') || 'all',
	);

	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const queryClient = useQueryClient();

	const handleDateChange = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.stopPropagation();
		e.preventDefault();
		if (!dateRange?.from || !dateRange?.to) return;

		queryClient.invalidateQueries({ queryKey: ['adsData'] });
		const formattedFrom = format(dateRange.from, 'yyyy-MM-dd');
		const formattedTo = format(dateRange.to, 'yyyy-MM-dd');

		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('startDate', formattedFrom);
		params.set('endDate', formattedTo);
		params.set('channel', trafficSource);

		startTransition(async () => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div className='md:w-fit flex-wrap flex items-center flex-col md:flex-row w-full gap-4 h-fit'>
			<Button
				onClick={(e) => handleDateChange(e)}
				className='disabled:opacity-70 w-full md:w-fit gap-2'
				disabled={isPending}>
				{isPending ? (
					<>
						Atualizar <Loader2 className='animate-spin h-4 w-4' />
					</>
				) : (
					<>
						Atualizar <Zap className='h-4 w-4' />
					</>
				)}
			</Button>
			<DatePickerWithRange
				date={dateRange}
				setDate={(range) =>
					setDateRange((prev) => ({
						from: range?.from ?? prev?.from ?? addDays(new Date(), -7),
						to: range?.to ?? prev?.to ?? new Date(),
					}))
				}
			/>
			{data.length === 0 && (
				<Select
					value={trafficSource}
					onValueChange={setTrafficSource}>
					<SelectTrigger className='w-full md:w-48'>
						<SelectValue placeholder='Fonte de Trafego' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todas as Fontes</SelectItem>
						<SelectItem value='Organic Search'>Organico</SelectItem>
						<SelectItem value='Paid Search'>Pago</SelectItem>
						<SelectItem value='Organic Social'>Social</SelectItem>
						<SelectItem value='Direct'>Direto</SelectItem>
					</SelectContent>
				</Select>
			)}
		</div>
	);
}
