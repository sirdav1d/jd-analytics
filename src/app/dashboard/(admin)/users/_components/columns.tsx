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
import { User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import DialogDeleteUser from './dialog-delete-user';
import FormUpdate from './form-update';
import SelectRole from './select-role';

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Nome',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
	{
		accessorKey: 'role',
		header: 'Cargo',
		cell: ({ row }) => <SelectRole user={row.original} />,
	},
	{
		id: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className='flex gap-2 justify-center items-center'>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='outline'
								size='icon'>
								<Pencil className='h-4 w-4' />
							</Button>
						</DialogTrigger>
						<DialogContent className='sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle>Editar Usuário</DialogTitle>
								<DialogDescription>
									Faça alterações no usuário aqui
								</DialogDescription>
							</DialogHeader>
							<FormUpdate user={user} />
						</DialogContent>
					</Dialog>
					<DialogDeleteUser userId={user.id} />
				</div>
			);
		},
	},
];
