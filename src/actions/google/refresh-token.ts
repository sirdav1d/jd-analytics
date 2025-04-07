/** @format */

'use server';

import { refreshAccessToken } from '@/lib/refresh-token';

export async function refreshAccessTokenAction() {
	return await refreshAccessToken();
}
