/** @format */
'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import MetaComercialForm from './forms/meta-comercial-form';
import { use } from 'react';

interface IModalFormComercialGoal {
	ok: boolean;
	data: { name: string; id: string }[] | null;
	error: string | null;
}

interface ISelllers {
	sellers: Promise<IModalFormComercialGoal>;
}

export default function ModalFormComercialGoal({ sellers }: ISelllers) {
	const data = use(sellers);

	if (!data.ok || data.data === null) {
		console.log(data.error);
		return <div>Erro ao carregar vendedores</div>;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='w-full md:w-fit tracking-wide antialiased'>
					Cadastrar Nova Meta <Plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cadastrar Meta Comercial</DialogTitle>
					<DialogDescription>
						Preencha os dados abaixo para registrar nova meta
					</DialogDescription>
				</DialogHeader>
				<MetaComercialForm sellers={data.data} />
			</DialogContent>
		</Dialog>
	);
}
