/** @format */

'use client';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format, isValid, parseISO, startOfMonth } from 'date-fns';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

function dateFromSearchParam(value: string | null, fallback: Date) {
	if (!value) return fallback;

	const parsed = parseISO(value);
	return isValid(parsed) ? parsed : fallback;
}

export default function Filter() {
	const now = new Date();
	const searchParams = useSearchParams();
	const [dateRange, setDateRange] = useState({
		from: dateFromSearchParam(searchParams.get('startDate'), startOfMonth(now)),
		to: dateFromSearchParam(searchParams.get('endDate'), now),
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	const handleDateChange = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.stopPropagation();
		e.preventDefault();

		if (dateRange.from && dateRange.to) {
			const formattedFrom = format(dateRange.from, 'yyyy-MM-dd');
			const formattedTo = format(dateRange.to, 'yyyy-MM-dd');
			const isCurrentRange =
				searchParams.get('startDate') === formattedFrom &&
				searchParams.get('endDate') === formattedTo;

			startTransition(() => {
				if (isCurrentRange) {
					router.refresh();
					return;
				}

				const nextParams = new URLSearchParams(searchParams.toString());
				nextParams.set('startDate', formattedFrom);
				nextParams.set('endDate', formattedTo);
				router.push(
					`${pathname}?${nextParams.toString()}`,
					{ scroll: false },
				);
			});
		}
	};

	return (
		<div className='md:w-fit flex-wrap flex items-center flex-col md:flex-row  w-full gap-4 h-fit'>
			<Button
				onClick={(e) => handleDateChange(e)}
				className='disabled:opacity-70 w-full md:w-fit'
				disabled={isPending}>
				<Search />	Buscar
			</Button>
			<DatePickerWithRange
				date={dateRange}
				setDate={(e) =>
					setDateRange({ from: e?.from ?? new Date(), to: e?.to ?? new Date() })
				}
			/>
		</div>
	);
}
