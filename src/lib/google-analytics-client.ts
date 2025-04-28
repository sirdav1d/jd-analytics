/**
 * lib/google-analytics-client.ts
 *
 * @format
 */

import { refreshAccessToken } from '@/lib/refresh-token';
import type { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

export async function createAnalyticsDataClient() {
	const { success, accessToken, error } = await refreshAccessToken();
	if (!success || error || !accessToken) {
		console.error('[AnalyticsService] Falha ao obter access token:', error);
		return {
			ok: false,
			error: 'Falha ao obter access token: ' + error,
		};
	}
	const auth = new google.auth.OAuth2();
	(auth as unknown as OAuth2Client).setCredentials({
		access_token: accessToken,
	});
	auth.forceRefreshOnFailure = true;

	const analyticsData = google.analyticsdata('v1beta');

	return { analyticsData, auth };
}
