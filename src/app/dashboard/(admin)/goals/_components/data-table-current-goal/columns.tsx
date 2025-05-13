/** @format */
'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

export interface CurentGoal {
	monthRef: string | Date;
	sellerName: string;
	revenue: number | string;
	realized: number | string;
}

export const columns: ColumnDef<CurentGoal>[] = [
	{
		accessorKey: 'monthRef',
		header: 'Data',
		cell: ({ row }) => {
			const goal = row.original;
			return (
				<p>
					{typeof goal.monthRef === 'string'
						? goal.monthRef.slice(0, 7)
						: goal.monthRef.toISOString().slice(0, 7)}
				</p>
			);
		},
	},
	{
		accessorKey: 'sellerName',
		header: 'Nome',
	},
	{
		accessorKey: 'revenue',
		header: 'Meta de Faturamento',
		cell: ({ row }) => {
			const goal = row.original;
			return (
				<p>
					{goal.revenue.toLocaleString('pt-br', {
						style: 'currency',
						currency: 'brl',
					})}
				</p>
			);
		},
	},
	{
		accessorKey: 'realized',
		header: 'Faturamento Realizado',
		cell: ({ row }) => {
			const goal = row.original;
			return (
				<p>
					{goal.realized.toLocaleString('pt-br', {
						style: 'currency',
						currency: 'brl',
					})}
				</p>
			);
		},
	},

	{
		id: 'actions',
		header: 'Ações',
		cell: ({ row }) => {
			const goal = row.original;
			console.log(goal);
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
								<DialogTitle className='leading-8'>
									Editar Meta de {goal.sellerName}
								</DialogTitle>
								<DialogDescription>
									Faça alterações no usuário aqui
								</DialogDescription>
							</DialogHeader>
							formulario de update aqui
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
						<DialogContent className='sm:max-w-[425px]'>
							<DialogHeader>
								<DialogTitle className='leading-8 capitalize'>
									Excluir Meta de {goal.sellerName}
								</DialogTitle>
								<DialogDescription>
									Essa ação não é reversível
								</DialogDescription>
							</DialogHeader>
							<p className='text-balance'>
								Tem certeza que deseja excluir a meta definida para{' '}
								{goal.sellerName} no valor de{' '}
								{goal.revenue.toLocaleString('pt-br', {
									style: 'currency',
									currency: 'brl',
								})}
								?
							</p>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant={'outline'}>Voltar</Button>
								</DialogClose>
								<Button>Excluir</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			);
		},
	},
];
