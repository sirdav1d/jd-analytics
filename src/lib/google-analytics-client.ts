/**
 * lib/google-analytics-client.ts
 *
 * @format
 */

import { google } from 'googleapis';
import { refreshAccessToken } from '@/lib/refresh-token';
import type { OAuth2Client } from 'google-auth-library';
import { GoogleAdsApi } from 'google-ads-api';

export async function createAnalyticsDataClient() {
	const { success, accessToken, error, refreshToken } =
		await refreshAccessToken();
	if (!success || error || !accessToken || !refreshToken) {
		console.error('[AnalyticsService] Falha ao obter access token:', error);
		throw new Error('Falha ao obter access token: ' + error);
	}
	const auth = new google.auth.OAuth2();
	(auth as unknown as OAuth2Client).setCredentials({
		access_token: accessToken,
	});
	auth.forceRefreshOnFailure = true;

	const analyticsData = google.analyticsdata('v1beta');

	const client = new GoogleAdsApi({
		client_id: process.env.GOOGLE_CLIENT_ID!,
		client_secret: process.env.GOOGLE_CLIENT_SECRET!,
		developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
	});

	const customer = client.Customer({
		customer_id: '2971952651', // ID do cliente
		refresh_token: refreshToken, // O refresh token
		login_customer_id: '8251122454',
	});

	return { analyticsData, auth, customer };
}
