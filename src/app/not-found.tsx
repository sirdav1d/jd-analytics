/** @format */

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='min-h-screen w-full flex items-center justify-center text-center p-8'>
			<div className='space-y-2'>
				<p className='text-3xl font-bold'>Página não encontrada</p>
				<p className='text-muted-foreground'>
					A página que você procura não existe ou foi movida.
				</p>
				<Link href={'/'}>
					Voltar
					<ChevronLeft />
				</Link>
			</div>
		</div>
	);
}
