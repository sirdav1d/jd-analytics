/** @format */

// app/actions/user.ts
'use server';

import { prisma } from '@/lib/prisma'; // ajuste o caminho conforme sua estrutura
// Importante: lembre-se de tratar a senha (por exemplo, usando hash) antes de salvar.
import bcrypt from 'bcrypt';

export async function createUserAction(
	name: string,
	email: string,
	password: string,
	role: string,
	organizationId: string,
) {
	try {
		const hashPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashPassword, // Certifique-se de criptografar a senha antes de salvar!
				role,
				organizationId, // Associação com a organização
			},
		});

		if (!user) {
			return {
				error: 'Algo deu errado, oog não criada',
				ok: false,
				user: null,
			};
		}
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
