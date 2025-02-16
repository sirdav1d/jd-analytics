/** @format */

import { refreshAccessTokenAction } from '@/actions/google/refresh-token';

export async function getAnalyticsData(
	startDate: string,
	endDate: string,
	channelFilter: string,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;

	const { success, error } = await refreshAccessTokenAction();
	if (!success) {
		console.log('Erro ao atualizar token:', error);
		return { data: 'erro ao atualizar token:', error };
	}
	const res = await fetch(
		`${baseURL}/api/g-analytics?startDate=${encodeURIComponent(
			startDate,
		)}&endDate=${encodeURIComponent(endDate)}&channel=${encodeURIComponent(
			channelFilter,
		)}`,
	);
	const data = await res.json();
	return { data: data };
}
