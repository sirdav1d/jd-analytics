/** @format */

'use server';

import { prisma } from '@/lib/prisma';

export async function refreshAccessTokenAction() {
	try {
		const organization = await prisma.organization.findFirst();

		if (!organization) {
			return { success: false, error: 'Organização não encontrada' };
		}

		const {
			googleAccessToken,
			googleRefreshToken,
			googleExpiresIn,
			updatedAt,
		} = organization;

		if (!googleRefreshToken) {
			return { success: false, error: 'Refresh token não encontrado' };
		}

		// Verifica se o token ainda é válido
		if (googleExpiresIn && updatedAt) {
			const expiresAt = new Date(updatedAt.getTime() + googleExpiresIn * 1000);
			if (new Date() < expiresAt) {
				return { success: true, accessToken: googleAccessToken };
			}
		}

		console.log('Token expirado, renovando...');

		const tokenEndpoint = 'https://oauth2.googleapis.com/token';
		const clientId = process.env.GOOGLE_CLIENT_ID!;
		const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

		const response = await fetch(tokenEndpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: googleRefreshToken,
				grant_type: 'refresh_token',
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.log('Erro ao atualizar token:', errorData);
			return { success: false, error: 'Falha ao atualizar token' };
		}

		const newTokens = await response.json();
		const newAccessToken = newTokens.access_token;
		const newExpiresIn = newTokens.expires_in;

		// Atualiza os tokens no banco
		await prisma.organization.update({
			where: { id: organization.id },
			data: {
				googleAccessToken: newAccessToken,
				googleExpiresIn: newExpiresIn,
			},
		});

		console.log('Token atualizado com sucesso!');
		return { success: true, accessToken: newAccessToken };
	} catch (error) {
		console.log('Erro ao processar refresh token:', error);
		return {
			success: false,
			error: 'Erro inesperado ao processar refresh token',
		};
	}
}
