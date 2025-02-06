/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';

// Define the User type

export default function GoalsPage() {
	const [commercialGoalType, setCommercialGoalType] = useState('revenue');
	const [commercialGoalValue, setCommercialGoalValue] = useState('');
	const [marketingGoalType, setMarketingGoalType] = useState('revenue');
	const [marketingGoalValue, setMarketingGoalValue] = useState('');

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

	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.5 } },
	};

	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<div className='grid md:grid-cols-2 gap-5'>
				<Card>
					<CardHeader>
						<CardTitle>Meta Comercial Atual</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<h2 className='text-xl font-semibold mb-5'>02/2025</h2>
							<p className='space-x-2'>
								<small>Faturamento:</small>
								<span className='font-semibold text-lg'>R$500.000,00</span>
							</p>
							<p className='space-x-2'>
								<small>Ticket Médio:</small>
								<span className='font-semibold text-lg'>R$950,00</span>
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Meta de Marketing Atual</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<h2 className='text-xl font-semibold mb-5'>02/2025</h2>
							<p className='space-x-2'>
								<small>Faturamento:</small>
								<span className='font-semibold text-lg'>R$500.000,00</span>
							</p>
							<p className='space-x-2'>
								<small>ROAS:</small>
								<span className='font-semibold text-lg'>20</span>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
			<motion.div
				initial='hidden'
				animate='visible'
				variants={fadeIn}
				className='grid md:grid-cols-2 gap-5'>
				<Card>
					<CardHeader>
						<CardTitle>Meta Comercial</CardTitle>
					</CardHeader>
					<CardContent>
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
									required
								/>
							</div>
							<Button
								type='submit'
								className='bg-red-600 text-white hover:bg-red-700'>
								Definir Meta Comercial
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Meta de Marketing</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleMarketingSubmit}
							className='space-y-4'>
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
									value={marketingGoalValue}
									onChange={(e) => setMarketingGoalValue(e.target.value)}
									required
								/>
							</div>
							<Button
								type='submit'
								className='bg-red-600 text-white hover:bg-red-700'>
								Definir Meta de Marketing
							</Button>
						</form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
