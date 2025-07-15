/** @format */

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';
import MetaMarketingForm from '../../goals-marketing/_components/meta-marketing-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ModalFormGoal() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className='w-full md:w-fit'>
					Cadastrar Nova Meta <Plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cadastrar Meta</DialogTitle>
					<DialogDescription>
						Preencha os dados abaixo para registrar nova meta
					</DialogDescription>
				</DialogHeader>
				<MetaMarketingForm />
			</DialogContent>
		</Dialog>
	);
}
