/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MetaComercialForm() {
	const [commercialGoalType, setCommercialGoalType] = useState('revenue');
	const [commercialGoalVendor, setCommercialGoalVendor] = useState('');
	const [commercialGoalValue, setCommercialGoalValue] = useState('');
	const [commercialDate, setCommercialDate] = useState('');

	const handleCommercialSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send this data to your backend
		console.log('Commercial Goal:', {
			type: commercialGoalType,
			value: commercialGoalValue,
		});
		toast('Meta Comercial Definida', {
			description: `Tipo: ${commercialGoalType}, Valor: R$ ${commercialGoalValue}`,
		});
	};
	return (
		<form
			onSubmit={handleCommercialSubmit}
			className='space-y-4'>
			<div className='space-y-2'>
				<Label htmlFor='commercialGoalType'>Tipo de Meta</Label>
				<Select
					value={commercialGoalType}
					onValueChange={setCommercialGoalType}>
					<SelectTrigger id='commercialGoalType'>
						<SelectValue placeholder='Selecione o tipo de meta' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='revenue'>Faturamento</SelectItem>
						<SelectItem value='averageTicket'>Ticket Médio</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='space-y-2'>
				<Label htmlFor='commercialGoalValue'>Valor da Meta</Label>
				<Input
					id='commercialGoalValue'
					type='number'
					placeholder='Digite o valor da meta'
					value={commercialGoalValue}
					onChange={(e) => setCommercialGoalValue(e.target.value)}
					className='placeholder:text-slate-500'
					required
				/>
			</div>
			<div className='space-y-2'>
				<Label htmlFor='commercialGoalVendor'>Vendedor</Label>
				<Select
					value={commercialGoalVendor}
					onValueChange={setCommercialGoalVendor}>
					<SelectTrigger id='commercialGoalVendor'>
						<SelectValue
							className='placeholder:text-muted-foreground'
							placeholder='Selecione o vendedor'
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='a'>VICTOR DE SOUZA SILVEIRA</SelectItem>
						<SelectItem value='b'>WELITON ALEXANDRE</SelectItem>
						<SelectItem value='c'>
							Paulo Vinicius da Conceição de Sousa
						</SelectItem>
						<SelectItem value='d'>ROBERTO PEREIRA PESSOA</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='space-y-2 flex flex-col'>
				<Label htmlFor='commercialGoalDateValue'>Validade</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={'outline'}
							className={cn(
								'w-full pl-3 text-left font-normal',
								!commercialDate && 'text-muted-foreground',
							)}>
							{commercialDate ? (
								format(commercialDate, 'PPP')
							) : (
								<span className='text-muted-foreground'>Escolha uma data</span>
							)}
							<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className='w-auto p-0'
						align='start'>
						<Calendar
							mode='single'
							selected={new Date(commercialDate)}
							onSelect={(date) => setCommercialDate(date?.toISOString() || '')}
							disabled={(date) =>
								date > new Date() || date < new Date('1900-01-01')
							}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>
			<Button
				disabled
				type='submit'
				className='bg-red-600 w-full text-white hover:bg-red-700'>
				Definir Meta Comercial
			</Button>
		</form>
	);
}
