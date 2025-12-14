/** @format */

'use client';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format, isValid, parseISO } from 'date-fns';
import { Loader2, Zap } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { getDefaultDateRange } from '@/utils/date-range';

export default function FilterAnalytics() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { from: defaultFrom, to: defaultTo } = getDefaultDateRange();

	const resolveDate = (value: string | null, fallback: Date) => {
		if (!value) return fallback;
		const parsed = parseISO(value);
		return isValid(parsed) ? parsed : fallback;
	};

	const [dateRange, setDateRange] = useState({
		to: resolveDate(searchParams.get('endDate'), defaultTo),
		from: resolveDate(searchParams.get('startDate'), defaultFrom),
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleDateChange = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.stopPropagation();
		e.preventDefault();

		if (!dateRange.from || !dateRange.to) return;

		const formattedFrom = format(dateRange.from, 'yyyy-MM-dd');
		const formattedTo = format(dateRange.to, 'yyyy-MM-dd');

		const params = new URLSearchParams(Array.from(searchParams.entries()));
		params.set('startDate', formattedFrom);
		params.set('endDate', formattedTo);

		startTransition(async () => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div className='md:w-fit flex-wrap flex items-center flex-col md:flex-row w-full gap-4 h-fit'>
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
					setDateRange({ from: e?.from ?? defaultFrom, to: e?.to ?? defaultTo })
				}
			/>
		</div>
	);
}
