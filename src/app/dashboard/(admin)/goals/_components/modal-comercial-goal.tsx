/** @format */

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
import MetaComercialForm from './meta-comercial-form';

export default function ModalFormComercialGoal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='w-full md:w-fit'>
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
				<MetaComercialForm />
			</DialogContent>
		</Dialog>
	);
}
