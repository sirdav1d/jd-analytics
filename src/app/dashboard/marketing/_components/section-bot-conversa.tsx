/** @format */
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { use } from 'react';
import Image from 'next/image';
import botConversa from '@/../public/bot_conversa.png';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SectionBotConversa({ data }: { data: Promise<any> }) {
	const response = use(data);

	if (!response.ok) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Dados não encontrados</CardTitle>
				</CardHeader>
			</Card>
		);
	}

	const dataBotConversa = response.data.results;

	return (
		<div className='w-full my-10 flex items-start flex-col gap-5'>
			<div className='flex items-start gap-2 xl:mx-0 justify-center scale-110 md:scale-100'>
				<Image
					src={botConversa}
					alt='Logo Bot Conversa'
					height={24}
					width={24}
				/>
				<h2 className='font-semibold text-sm'>Bot Conversa</h2>
			</div>
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4 w-full'>
				{dataBotConversa.map(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(item: any, index: number) => (
						<Card key={index}>
							<CardHeader>
								<CardTitle className='text-xs'>
									{item.full_name ? item.first_name : item.phone}
								</CardTitle>
							</CardHeader>
							<CardContent></CardContent>
						</Card>
					),
				)}
			</div>
		</div>
	);
}
