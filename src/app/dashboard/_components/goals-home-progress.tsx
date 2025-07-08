/** @format */
'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { use, useEffect, useState } from 'react';

interface GoalsHomeProgress {
	canShowComercial: boolean;
	canShowMarketing: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: Promise<any>;
}

export default function GoalsHomeProgress({
	canShowComercial,
	canShowMarketing,
	data,
}: GoalsHomeProgress) {
	const allData = use(data);

	const comercial = allData.data.commercial;
	const marketing = allData.data.roas;
	const [percentComercialState, setPercentComercial] = useState(10);
	const [percentMarketingState, setPercentMarketing] = useState(10);

	useEffect(() => {
		const timer = setTimeout(() => {
			setPercentComercial(comercial.percentage);
			setPercentMarketing(marketing.percentage);
		}, 500);
		return () => clearTimeout(timer);
	}, [comercial.percentage, marketing.percentage]);

	if (!allData.ok) {
		console.log(allData.error);
		return (
			<Card>
				<CardHeader>
					<CardTitle className='text-base text-balance xl:text-xl'>
						Sem dados encontrados
					</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className='flex flex-col gap-5 w-full mb-5'>
			{canShowComercial && (
				<div className='flex flex-col gap-2'>
					<div className='flex items-center justify-between gap-4'>
						<p className='font-medium text-xs text-nowrap'>
							Fat. Atual{' '}
							{comercial.currentRevenue.toLocaleString('pt-br', {
								style: 'currency',
								currency: 'brl',
							})}
						</p>
						<p className='font-medium text-xs text-nowrap'>
							Meta{' '}
							{comercial.revenueGoal.toLocaleString('pt-br', {
								style: 'currency',
								currency: 'brl',
							})}
						</p>
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Progress
								value={
									percentComercialState > 100 ? 100 : percentComercialState
								}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								Faturamento Atingido {percentComercialState.toFixed(0) + '%'}
							</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
			{canShowMarketing && (
				<div className='flex flex-col gap-2'>
					<div className='flex items-center gap-4 justify-between'>
						<p className='font-medium text-xs text-nowrap'>
							ROAS Atual {marketing.currentRoas.toFixed(2)}x
						</p>
						<p className='font-medium text-xs text-nowrap'>
							Meta {marketing.roasTarget.toFixed(0)}x
						</p>
					</div>
					<Tooltip>
						<TooltipTrigger asChild>
							<Progress
								bgIndicator='bg-blue-500'
								value={
									percentMarketingState > 100 ? 100 : percentMarketingState
								}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>ROAS Atingido {percentMarketingState.toFixed(0) + '%'}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			)}
		</div>
	);
}
