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

interface IMetaComercialForm {
	sellers: { name: string }[];
}

export default function MetaComercialForm({ sellers }: IMetaComercialForm) {
	const [commercialGoalType, setCommercialGoalType] = useState('revenue');
	const [commercialGoalVendor, setCommercialGoalVendor] = useState('');
	const [commercialGoalValue, setCommercialGoalValue] = useState('');
	const [year, setYear] = useState(new Date().getFullYear());

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
						{sellers.map((seller, index) => {
							return (
								<SelectItem
									key={index}
									value={seller.name}>
									{seller.name}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>
			<div className='justify-between gap-5 flex items-center'>
				<div className='w-full space-y-2'>
					<Label htmlFor='meta-mes'>Mês</Label>
					<Select
						value={commercialGoalVendor}
						onValueChange={setCommercialGoalVendor}>
						<SelectTrigger id='meta-mes'>
							<SelectValue
								className='placeholder:text-muted-foreground'
								placeholder='Selecione o mês'
							/>
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 12 }).map((_, index) => (
								<SelectItem
									key={index}
									value={`${index}`}>
									{index + 1}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='w-full space-y-2'>
					<Label htmlFor='meta-ano'>Ano</Label>
					<Input
						value={year}
						onChange={(e) => setYear(Number(e.target.value))}
						id='meta-ano'
						min={2025}
						type='number'
						placeholder='Selecione o ano'></Input>
				</div>
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
