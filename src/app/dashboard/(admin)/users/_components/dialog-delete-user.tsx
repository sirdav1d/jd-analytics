/** @format */
'use client';

import { deleteUserAction } from '@/actions/user/delete';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

export default function DialogDeleteUser({ userId }: { userId: string }) {
	const [isPending, startTransition] = useTransition();
	async function handleClick(
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		e.preventDefault();
		e.stopPropagation();

		startTransition(async () => {
			const response = await deleteUserAction(userId);
			if (!response.ok) {
				console.log(response.error);
				toast.error('Algo deu errado');
			} else {
				const btn = document.getElementById('closeDeleteUser');
				btn?.click();
				toast.success('Usuário deletado com sucesso');
			}
		});
	}
	return (
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
				</DialogHeader>
				<p className='text-muted-foreground'>
					Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta
					do usuário e removerá seus dados dos nossos servidores.
				</p>
				<DialogFooter>
					<DialogClose
						className='hidden'
						id='closeDeleteUser'></DialogClose>
					<Button
						disabled={isPending}
						className='disabled:opacity-70 w-full mt-5'
						onClick={(e) => handleClick(e)}>
						Deletar usuário
						{isPending && <Loader2 className='animate-spin' />}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
