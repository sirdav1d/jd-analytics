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
import { ArrowRight, Loader2, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function DialogDeleteUser({ userId }: { userId: string }) {
	const [isLoading, setIsLoading] = useState(false);
	async function handleClick(
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		setIsLoading(true);
		e.preventDefault();
		e.stopPropagation();
		const response = await deleteUserAction(userId);
		if (!response.ok) {
			toast.error('Algo deu errado', { description: String(response.error) });
		} else {
			toast.success('Usuário deletado com sucesso');
		}
		console.log(response);
		setIsLoading(false);
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
					<DialogClose asChild>
						<Button variant='outline'>Cancelar</Button>
					</DialogClose>
					<Button
						disabled={isLoading}
						className='disabled:opacity-70'
						onClick={(e) => handleClick(e)}>
						{isLoading ? (
							<>
								Deletar usuário <Loader2 className='animate-spin' />
							</>
						) : (
							<>
								Deletar usuário <ArrowRight />
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
