/** @format */

import { prisma } from '@/lib/prisma';
import { getCachedAccessToken, setCachedAccessToken } from '@/lib/token-cache';

export async function refreshAccessToken() {
	try {
		// 1. Tenta usar a cache
		const cached = getCachedAccessToken();
		if (cached) {
			return { success: true, accessToken: cached };
		}

		// 2. Consulta o banco
		const organization = await prisma.organization.findFirst();
		if (!organization || !organization.googleRefreshToken) {
			return { success: false, error: 'Refresh token não encontrado' };
		}

		const {
			googleAccessToken,
			googleRefreshToken,
			googleExpiresIn,
			updatedAt,
		} = organization;

		// 3. Verifica validade do token no banco
		if (googleAccessToken && googleExpiresIn && updatedAt) {
			const expiresAt = new Date(updatedAt.getTime() + googleExpiresIn * 1000);
			if (new Date() < expiresAt) {
				setCachedAccessToken(googleAccessToken, googleExpiresIn);
				return {
					success: true,
					accessToken: googleAccessToken,
					error: null,
					organization,
				};
			}
		}

		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: process.env.GOOGLE_CLIENT_ID!,
				client_secret: process.env.GOOGLE_CLIENT_SECRET!,
				refresh_token: googleRefreshToken,
				grant_type: 'refresh_token',
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.log('Erro ao atualizar token:', errorData);
			return {
				success: false,
				error: 'Falha ao atualizar token',
				accessToken: null,
				organization: null,
			};
		}

		const { access_token, expires_in } = await response.json();

		const updatedOrg = await prisma.organization.update({
			where: { id: organization.id },
			data: {
				googleAccessToken: access_token,
				googleExpiresIn: expires_in,
				updatedAt: new Date(),
			},
		});
		setCachedAccessToken(access_token, expires_in);

		return {
			success: true,
			accessToken: access_token,
			error: null,
			organization: updatedOrg,
		};
	} catch (err) {
		console.error('Erro no refresh token:', err);
		return {
			success: false,
			error: 'Erro interno no servidor',
			accessToken: null,
			organization: null,
		};
	}
}
