/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DataTable } from '../_components/data-table';

// Define the User type
type User = {
	id: number;
	name: string;
	email: string;
	role: 'Administrador' | 'Gerente';
};

// Mock user data
const users: User[] = [
	{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Administrador' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Gerente' },
	{
		id: 3,
		name: 'Bob Johnson',
		email: 'bob@example.com',
		role: 'Administrador',
	},
	// Add more users as needed
];

export default function AdminPage() {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userData, setUserData] = useState(users);

	const updateUserRole = (
		userId: number,
		newRole: 'Administrador' | 'Gerente',
	) => {
		setUserData((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId ? { ...user, role: newRole } : user,
			),
		);
	};

	const columns: ColumnDef<User>[] = [
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
					onValueChange={(value: 'Administrador' | 'Gerente') =>
						updateUserRole(row.original.id, value)
					}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue>{row.original.role}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='Administrador'>Administrador</SelectItem>
						<SelectItem value='Gerente'>Gerente</SelectItem>
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
									size='icon'
									onClick={() => setCurrentUser(user)}>
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
								<div className='grid gap-4 py-4'>
									<div className='flex flex-col items-start gap-2'>
										<Label
											htmlFor='edit-name'
											className='text-right'>
											Nome
										</Label>
										<Input
											id='edit-name'
											defaultValue={currentUser?.name}
											className='col-span-3'
										/>
									</div>
									<div className='flex flex-col items-start gap-2'>
										<Label
											htmlFor='edit-email'
											className='text-right'>
											E-mail
										</Label>
										<Input
											id='edit-email'
											defaultValue={currentUser?.email}
											className='col-span-3'
										/>
									</div>
									<div className='flex flex-col items-start gap-2'>
										<Label
											htmlFor='edit-role'
											className='text-right'>
											Cargo
										</Label>
										<Select defaultValue={currentUser?.role}>
											<SelectTrigger className='w-full col-span-3'>
												<SelectValue>{currentUser?.role}</SelectValue>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='Administrador'>
													Administrador
												</SelectItem>
												<SelectItem value='Gerente'>Gerente</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter>
									<Button
										type='submit'
										className='bg-red-600 hover:bg-red-700'>
										Salvar Alterações
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<Dialog>
							<DialogTrigger asChild>
								<Button
									variant='outline'
									size='icon'>
									<Trash2 className='h-4 w-4 text-red-600' />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										Tem certeza de que deseja excluir este usuário?
									</DialogTitle>
									<DialogDescription>
										Esta ação não pode ser desfeita. Isso excluirá
										permanentemente a conta do usuário e removerá seus dados dos
										nossos servidores.
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button variant='outline'>Cancelar</Button>
									<Button>Deletar usuário</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				);
			},
		},
	];

	return (
		<div className='w-full mx-auto pb-5'>
			<div className='mb-4'>
				<Dialog>
					<DialogTrigger asChild>
						<Button className='bg-red-600 hover:bg-red-700'>
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
						<div className='grid gap-4 py-4'>
							<div className='flex flex-col items-start gap-2'>
								<Label
									htmlFor='name'
									className='text-right'>
									Nome
								</Label>
								<Input
									id='name'
									className='col-span-3'
								/>
							</div>
							<div className='flex flex-col items-start gap-2'>
								<Label
									htmlFor='email'
									className='text-right'>
									Email
								</Label>
								<Input
									id='email'
									className='col-span-3'
								/>
							</div>
							<div className='flex flex-col items-start gap-2'>
								<Label
									htmlFor='role'
									className='text-right'>
									Cargo
								</Label>
								<Select>
									<SelectTrigger className='w-full col-span-3'>
										<SelectValue placeholder='Selecione o Cargo' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='Administrador'>Administrador</SelectItem>
										<SelectItem value='Gerente'>Gerente</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								type='submit'
								className='bg-red-600 hover:bg-red-700'>
								Adicionar Usuário
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<DataTable
				columns={columns}
				data={userData}
			/>
		</div>
	);
}
