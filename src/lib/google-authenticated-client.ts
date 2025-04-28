/** @format */

import { prisma } from '@/lib/prisma';
import { getOAuth2Client } from '@/lib/google-client';
import type { OAuth2Client } from 'googleapis-common';

export async function getAuthenticatedClient(
	orgId: string,
): Promise<OAuth2Client> {
	// 1) Busca credenciais no banco
	const org = await prisma.organization.findUnique({ where: { id: orgId } });
	if (
		!org ||
		!org.googleAccessToken ||
		!org.googleRefreshToken ||
		!org.googleExpiresAt
	) {
		throw new Error('Tokens do Google não encontrados para esta organização');
	}

	// 2) Instancia o OAuth2Client
	const oauth2Client = getOAuth2Client();

	// 3) Seta as credenciais atuais
	oauth2Client.setCredentials({
		access_token: org.googleAccessToken,
		refresh_token: org.googleRefreshToken,
		expiry_date: org.googleExpiresAt,
	});

	// 4) Listener para atualização automática de tokens
	oauth2Client.on('tokens', async (tokens) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const updateData: any = { googleAccessToken: tokens.access_token! };
		if (tokens.refresh_token)
			updateData.googleRefreshToken = tokens.refresh_token;
		if (tokens.expiry_date) updateData.googleExpiresAt = tokens.expiry_date;

		await prisma.organization.update({
			where: { id: orgId },
			data: updateData,
		});
	});

	return oauth2Client;
}
