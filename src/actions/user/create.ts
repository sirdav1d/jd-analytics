/** @format */

// app/actions/user.ts
'use server';

import { prisma } from '@/lib/prisma'; // ajuste o caminho conforme sua estrutura
import { $Enums } from '@prisma/client';
// Importante: lembre-se de tratar a senha (por exemplo, usando hash) antes de salvar.
import bcrypt from 'bcrypt';
import { revalidateTag } from 'next/cache';

export async function createUserAction(
	name: string,
	email: string,
	role: $Enums.Role,

	password: string,
	externalId: string,
) {
	try {
		

		const hashPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				externalId,
				password: hashPassword, // Certifique-se de criptografar a senha antes de salvar!
				role,
				
			},
		});

		if (!user) {
			return {
				error: 'Algo deu errado, user não criado',
				ok: false,
				user: null,
			};
		}
		//enviar credenciais para e-mail cadastrado
		revalidateTag('users');
		return {
			error: null,
			ok: true,
			user: user,
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
