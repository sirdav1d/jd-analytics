/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MetaComercialForm() {
	const [commercialGoalType, setCommercialGoalType] = useState('revenue');
	const [commercialGoalValue, setCommercialGoalValue] = useState('');

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
				<Label htmlFor='commercialGoalDateValue'>Validade</Label>
				<Input
					id='commercialGoalDateValue'
					type='date'
					value={commercialGoalValue}
					onChange={(e) => setCommercialGoalValue(e.target.value)}
					required
				/>
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
