/**
 * lib/google-analytics-client.ts
 *
 * @format
 */

import { google } from 'googleapis';
import { refreshAccessToken } from '@/lib/refresh-token';
import type { OAuth2Client } from 'google-auth-library';

export async function createAnalyticsDataClient() {
	const { success, accessToken, error } = await refreshAccessToken();
	if (!success || error || !accessToken) {
		console.error('[AnalyticsService] Falha ao obter access token:', error);
		throw new Error('Falha ao obter access token: ' + error);
	}
	const auth = new google.auth.OAuth2();
	(auth as unknown as OAuth2Client).setCredentials({
		access_token: accessToken,
	});
	auth.forceRefreshOnFailure = true;

	const analyticsData = google.analyticsdata('v1beta');
	return { analyticsData, auth };
}
