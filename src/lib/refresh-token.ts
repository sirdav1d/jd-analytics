/** @format */

import { prisma } from '@/lib/prisma';
import {
	getCachedAccessToken,
	getCachedRefreshToken,
	setCachedTokens,
} from '@/lib/token-cache';

export async function refreshAccessToken() {
	try {
		// 1. Tenta usar a cache
		const cachedAccess = getCachedAccessToken();
		const cachedRefresh = getCachedRefreshToken();
		if (cachedAccess && cachedRefresh) {
			return {
				success: true,
				accessToken: cachedAccess,
				refreshToken: cachedRefresh,
				error: null,
			};
		}

		// 2. Consulta o banco
		const organization = await prisma.organization.findFirst();
		if (
			!organization ||
			!organization.googleRefreshToken ||
			!organization.googleExpiresIn ||
			!organization.googleAccessToken
		) {
			return {
				success: false,
				error: 'Organization não encontrada',
				accessToken: null,
				refreshToken: null,
			};
		}

		// 3. Verifica validade do token salvo no banco
		const expiresAt =
			organization.updatedAt.getTime() + organization.googleExpiresIn * 1000;
		if (
			Date.now() < expiresAt &&
			organization.googleAccessToken &&
			organization.googleRefreshToken
		) {
			// Recoloca no cache e retorna
			setCachedTokens(
				organization.googleAccessToken,
				organization.googleRefreshToken,
				organization.googleExpiresIn,
			);
			return {
				success: true,
				accessToken: organization.googleAccessToken,
				refreshToken: organization.googleRefreshToken,
				error: null,
			};
		}

		// 4. Faz requisição de refresh junto ao Google

		const params = new URLSearchParams({
			client_id: process.env.GOOGLE_CLIENT_ID!,
			client_secret: process.env.GOOGLE_CLIENT_SECRET!,
			grant_type: 'refresh_token',
			refresh_token: organization.googleRefreshToken,
		});

		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: params,
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

		const { access_token, expires_in, refresh_token } = await response.json();

		const updatedOrg = await prisma.organization.update({
			where: { id: organization.id },
			data: {
				googleAccessToken: access_token,
				googleRefreshToken: refresh_token,
				googleExpiresIn: expires_in,
				updatedAt: new Date(),
			},
		});

		setCachedTokens(access_token, refresh_token, expires_in);

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
