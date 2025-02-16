/** @format */

// app/actions/user.ts
'use server';

import { prisma } from '@/lib/prisma'; // ajuste o caminho conforme sua estrutura
// Importante: lembre-se de tratar a senha (por exemplo, usando hash) antes de salvar.
import { revalidateTag } from 'next/cache';

export async function deleteUserAction(userId: string) {
	try {
		const user = await prisma.user.delete({
			where: { id: userId },
		});

		if (!user) {
			return {
				error: 'Algo deu errado, user não encontrado',
				ok: false,
				user: null,
			};
		}
		//enviar credenciais para e-mail cadastrado
		revalidateTag('users');
		return {
			error: null,
			ok: true,
			user: null,
		};
	} catch (error) {
		return {
			error: error,
			ok: false,
			user: null,
		};
	}
	// Crie o usuário e vincule à organização pelo organizationId.
}
