/** @format */

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

export default function MetaMarketingForm() {
	const [marketingGoalType, setMarketingGoalType] = useState('revenue');
	const [company, setCompany] = useState('centro');
	const [marketingGoalValue, setMarketingGoalValue] = useState('');
	const handleMarketingSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send this data to your backend
		console.log('Marketing Goal:', {
			type: marketingGoalType,
			value: marketingGoalValue,
		});
		toast('Meta de Marketing Definida', {
			description: `Tipo: ${marketingGoalType}, Valor: ${
				marketingGoalType === 'revenue' ? 'R$' : ''
			}${marketingGoalValue}${marketingGoalType === 'roas' ? 'x' : ''}`,
		});
	};
	return (
		<form onSubmit={handleMarketingSubmit}>
			<div className=' gap-5 grid items-start'>
				<div className='space-y-2'>
					<Label htmlFor='marketingGoalType'>Tipo de Meta</Label>
					<Select
						value={marketingGoalType}
						onValueChange={setMarketingGoalType}>
						<SelectTrigger id='marketingGoalType'>
							<SelectValue placeholder='Selecione o tipo de meta' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='revenue'>Faturamento</SelectItem>
							<SelectItem value='roas'>ROAS</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='marketingGoalValue'>Valor da Meta</Label>
					<Input
						id='marketingGoalValue'
						type='number'
						placeholder='Digite o valor da meta'
						className='placeholder:text-slate-500'
						value={marketingGoalValue}
						onChange={(e) => setMarketingGoalValue(e.target.value)}
						required
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='marketingGoalDateValue'>Vigência</Label>
					<Input
						id='marketingGoalDateValue'
						type='date'
						value={marketingGoalValue}
						onChange={(e) => setMarketingGoalValue(e.target.value)}
						required
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='marketingGoalType'>Unidade</Label>
					<Select
						value={company}
						onValueChange={setCompany}>
						<SelectTrigger id='centro'>
							<SelectValue placeholder='Selecione o tipo de meta' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='centro'>JD Centro</SelectItem>
							<SelectItem value='icarai'>JD Icaraí</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<Button
				type='submit'
				className='bg-red-600 w-full text-white hover:bg-red-700 mt-5'>
				Definir Meta de Marketing
			</Button>
		</form>
	);
}
