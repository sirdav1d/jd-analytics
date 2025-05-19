/** @format */

'use client';
import { updateUserAction } from '@/actions/user/update';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { $Enums, User } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function SelectRole({ user }: { user: Partial<User> }) {
	const [isPending, startTransition] = useTransition();
	async function handleUpdateRole(user: Partial<User>, role: $Enums.Role) {
		const { name, email } = user;

		startTransition(async () => {
			const response = await updateUserAction({
				userUp: { role: role, name, email },
			});
			console.log(user, role, response);
			if (!response.ok) {
				console.log(response.error);
				toast.error('Algo deu errado');
			} else {
				toast.success('Usuário atualizado com sucesso');
			}
		});
	}

	return (
		<Select
			disabled={isPending}
			value={user.role}
			onValueChange={(value: 'ADMIN' | 'MANAGER' | 'SELLER') =>
				handleUpdateRole(user, value)
			}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue>
					<p className='flex items-center gap-2'>
						{user.role == 'ADMIN'
							? 'Administrador'
							: user.role == 'MANAGER'
								? 'Gerente'
								: 'Vendedor'}{' '}
						{isPending && (
							<Loader2
								size={16}
								className='animate-spin'
							/>
						)}
					</p>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='ADMIN'>Administrador</SelectItem>
				<SelectItem value='MANAGER'>Gerente</SelectItem>
				<SelectItem value='SELLER'>Vendedor</SelectItem>
			</SelectContent>
		</Select>
	);
}
