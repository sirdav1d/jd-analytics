/** @format */
'use client';

import { Progress } from '@/components/ui/progress';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { useEffect, useState } from 'react';

interface GoalsHomeProgress {
	canShowComercial: boolean;
	canShowMarketing: boolean;
	goalComercial: number;
	goalMarketing: number;
	achievedComercial: number;
	achievedMarketing: number;
}

export default function GoalsHomeProgress({
	canShowComercial,
	canShowMarketing,
	achievedComercial,
	achievedMarketing,
	goalComercial,
	goalMarketing,
}: GoalsHomeProgress) {
	const percentMarketing = (achievedMarketing / goalMarketing) * 100;
	const percentComercial = (achievedComercial / goalComercial) * 100;
	const [percentComercialState, setPercentComercial] = useState(10);
	const [percentMarketingState, setPercentMarketing] = useState(10);

	useEffect(() => {
		const timer = setTimeout(() => {
			setPercentComercial(percentComercial);
			setPercentMarketing(percentMarketing);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className='flex flex-col gap-5 w-full mb-5'>
			{canShowComercial && (
				<div className='flex flex-col gap-2'>
					<div className='flex items-center justify-between gap-4'>
						<p className='font-medium text-xs text-nowrap'>
							Fat. Atual{' '}
							{achievedComercial.toLocaleString('pt-br', {
								style: 'currency',
								currency: 'brl',
							})}
						</p>
						<p className='font-medium text-xs text-nowrap'>
							Meta{' '}
							{goalComercial.toLocaleString('pt-br', {
								style: 'currency',
								currency: 'brl',
							})}
						</p>
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Progress value={percentComercialState} />
						</TooltipTrigger>
						<TooltipContent>
							<p>Faturamento Atingido {percentComercial.toFixed(0) + '%'}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
			{canShowMarketing && (
				<div className='flex flex-col gap-2'>
					<div className='flex items-center gap-4 justify-between'>
						<p className='font-medium text-xs text-nowrap'>
							ROAS Atual {achievedMarketing}x
						</p>
						<p className='font-medium text-xs text-nowrap'>
							Meta {goalMarketing}x
						</p>
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Progress
								bgIndicator='bg-blue-500'
								value={percentMarketingState}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>ROAS Atingido {percentMarketing.toFixed(0) + '%'}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</div>
	);
}
