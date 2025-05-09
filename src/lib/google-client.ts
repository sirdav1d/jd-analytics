/** @format */

import { google } from 'googleapis';
import { GoogleAdsApi } from 'google-ads-api';

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

export const googleAdsClient = new GoogleAdsApi({
	client_id: process.env.GOOGLE_CLIENT_ID!,
	client_secret: process.env.GOOGLE_CLIENT_SECRET!,
	developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
});
