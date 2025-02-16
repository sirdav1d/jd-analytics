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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { $Enums, User } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import DialogDeleteUser from './dialog-delete-user';
import FormUpdate from './form-update';
import { updateUserAction } from '@/actions/user/update';
import { toast } from 'sonner';

async function handleUpdateRole(user: Partial<User>, role: $Enums.Role) {
	const { name, email } = user;
	const response = await updateUserAction({
		userUp: { role: role, name, email },
	});
	console.log(user, role, response);
	if (!response.ok) {
		toast.error('Algo deu errado', { description: String(response.error) });
	} else {
		toast.success('Usuário cadastrado com sucesso');
	}
}

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
		cell: ({ row }) => (
			<Select
				value={row.original.role}
				onValueChange={(value: 'ADMIN' | 'MANAGER') =>
					handleUpdateRole(row.original, value)
				}>
				<SelectTrigger className='w-[180px]'>
					<SelectValue>
						{row.original.role == 'ADMIN' ? 'Administrador' : 'Gerente'}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='ADMIN'>Administrador</SelectItem>
					<SelectItem value='MANAGER'>Gerente</SelectItem>
				</SelectContent>
			</Select>
		),
	},
	{
		id: 'actions',
		header: 'Ações',
		cell: ({ row }) => {
			const user = row.original;

			return (
				<div className='flex gap-2'>
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
