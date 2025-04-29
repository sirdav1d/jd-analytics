/** @format */

import { google } from 'googleapis';
// lib/google-ads-client.ts
/**
 * Cria e retorna uma instância do cliente OAuth2 do Google.
 *
 * @throws Error se as variáveis de ambiente não estiverem configuradas.
 */
export function getOAuth2Client() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const redirectUri = process.env.GOOGLE_REDIRECT_URI;

	if (!clientId || !clientSecret || !redirectUri) {
		throw new Error(
			'Variáveis de ambiente Google OAuth2 não configuradas: verificar GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e GOOGLE_REDIRECT_URI',
		);
	}

	return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}
