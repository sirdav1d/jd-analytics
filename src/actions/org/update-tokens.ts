/** @format */

// app/actions/updateOrganization.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function updateOrganizationTokens(
	organizationId: string,
	accessToken: string,
	refreshToken: string,
	expiresIn: number,
) {
	// Opcional: calcular a data de expiração, se preferir armazenar essa informação
	// const expiresAt = new Date(Date.now() + expiresIn * 1000);

	try {
		const updatedOrganization = await prisma.organization.update({
			where: { id: organizationId },
			data: {
				googleAccessToken: accessToken,
				googleRefreshToken: refreshToken,
				googleExpiresAt: expiresIn,
				// Se tiver o campo para data de expiração, pode atualizar assim:
				// googleExpiresAt: expiresAt,
			},
		});

		if (!updatedOrganization) {
			console.log(updatedOrganization);
			return {
				error: 'Algo deu errado, org tokens não atualizados',
				ok: false,
				org: null,
			};
		}
		
		return {
			error: null,
			ok: true,
			org: updatedOrganization,
		};
	} catch (error) {
		console.log(error);
		return {
			error: error,
			ok: false,
			org: null,
		};
	}
}
