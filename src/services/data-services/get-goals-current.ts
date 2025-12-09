/** @format */

import type { GoogleAdsScope } from '@/lib/google-ads-account';

export async function FetchGoalsCurrentData(scope: GoogleAdsScope = 'products') {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/data-services/goals-current?scope=${scope}`,
		{
			method: 'GET',
			next: { revalidate: 30, tags: ['goals-current'] },
		},
	);

	if (!response.ok) {
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado - Erro interno do servidor',
		};
	}

	const data = await response.json();

	if (!data.ok) {
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado ' + data.error,
		};
	}
	return data;
}
