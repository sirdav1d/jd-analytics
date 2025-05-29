/** @format */

import { getOAuth2Client } from '@/lib/google-client';
import { prisma } from '@/lib/prisma';
import type { OAuth2Client } from 'google-auth-library';

export async function getAuthenticatedClient(
	orgId: string,
): Promise<{ oauth2Client: OAuth2Client; refreshToken: string }> {
	// 1) Se já tivermos um cliente em memória, retorne imediatamente

	// 2) Caso contrário, busque as credenciais no banco
	const org = await prisma.organization.findUnique({ where: { id: orgId } });
	if (
		!org ||
		!org.googleAccessToken ||
		!org.googleRefreshToken ||
		!org.googleExpiresAt
	) {
		throw new Error('Tokens do Google não encontrados para esta organização');
	}

	// 3) Instancia e configura o OAuth2Client
	const oauth2Client = getOAuth2Client();
	oauth2Client.setCredentials({
		access_token: org.googleAccessToken,
		refresh_token: org.googleRefreshToken,
		expiry_date: Number(org.googleExpiresAt),
	});

	// 4) Registra o listener UMA ÚNICA VEZ (no primeiro cold-start)
	oauth2Client.on('tokens', async (tokens) => {
		const updateData: {
			googleAccessToken?: string;
			googleRefreshToken?: string;
			googleExpiresAt?: number;
		} = {};

		if (tokens.access_token) {
			updateData.googleAccessToken = tokens.access_token;
		}
		if (tokens.refresh_token) {
			updateData.googleRefreshToken = tokens.refresh_token;
		}
		if (tokens.expiry_date) {
			updateData.googleExpiresAt = tokens.expiry_date;
		}

		await prisma.organization.update({
			where: { id: orgId },
			data: updateData,
		});
	});

	// 5) Armazena em cache para chamadas futuras

	return {
		oauth2Client,
		refreshToken: org.googleRefreshToken,
	};
}
