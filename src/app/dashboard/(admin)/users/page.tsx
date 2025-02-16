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
import { DataTable } from '../_components/data-table';
import { columns } from './_components/columns';
import FormCreate from './_components/form-create';

export default async function AdminPage() {
	const response = await fetch(
		'http://localhost:3000/api/services/user-get-all',
		{
			next: { revalidate: 3600, tags: ['users'] },
		},
	);

	const { data } = await response.json();
	return (
		<div className='w-full mx-auto pb-5'>
			<div className='mb-4'>
				<Dialog>
					<DialogTrigger asChild>
						<Button className='bg-red-600 hover:bg-red-700 w-full md:w-fit'>
							<Plus className='mr-1 h-4 w-4' /> Adicionar Usuário
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Adicionar Novo Usuário</DialogTitle>
							<DialogDescription>
								Insira os detalhes do novo usuário aqui
							</DialogDescription>
						</DialogHeader>
						<FormCreate />
					</DialogContent>
				</Dialog>
			</div>
			<DataTable
				columns={columns}
				data={data}
			/>
		</div>
	);
}
