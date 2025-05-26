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
import { format, startOfMonth } from 'date-fns';
import { Loader2, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useState, useTransition } from 'react';

interface FilterComercialProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
}

export default function FilterComercial({ data }: FilterComercialProps) {
	const allData = use(data);

	const now = new Date();
	const searchParams = useSearchParams();
	const [dateRange, setDateRange] = useState({
		to: searchParams.get('endDate') || now,
		from: searchParams.get('startDate') || startOfMonth(now),
	});
	const [category, setCategory] = useState('all');
	const [customerType, setCustomerType] = useState('all');
	const [org, setOrg] = useState('all');
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
					`/dashboard/comercial?startDate=${encodeURIComponent(
						formattedFrom,
					)}&endDate=${encodeURIComponent(formattedTo)}&category=${category}&customerType=${customerType}&org=${org}`,
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

			<Select
				value={category}
				onValueChange={setCategory}>
				<SelectTrigger className='w-full md:w-52'>
					<SelectValue placeholder='Categoria' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Todas as Categorias</SelectItem>
					{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
					{allData.data?.catogories.map((category: any, index: number) => {
						return (
							<SelectItem
								key={index}
								value={category.sector}>
								{category.sector}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>

			<Select
				value={customerType}
				onValueChange={setCustomerType}>
				<SelectTrigger className='w-full md:w-48'>
					<SelectValue placeholder='Tipo de Cliente' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Todos os Clientes</SelectItem>
					{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
					{allData.data?.customerTypes.map((category: any, index: number) => {
						return (
							<SelectItem
								key={index}
								value={category.personType}>
								Pessoa {category.personType.toLowerCase()}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
			<Select
				value={org}
				onValueChange={setOrg}>
				<SelectTrigger className='w-full md:w-48'>
					<SelectValue placeholder='Tipo de Cliente' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Todos as unidades</SelectItem>
					{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
					{allData.data?.orgs.map((org: any, index: number) => {
						return (
							<SelectItem
								key={index}
								value={org.id}>
								{org.name}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
