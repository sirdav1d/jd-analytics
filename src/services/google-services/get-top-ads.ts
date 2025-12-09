/** @format */

import type { GoogleAdsScope } from '@/lib/google-ads-account';

export async function FetchTopADSData(
	startDate: string,
	endDate: string,
	scope: GoogleAdsScope = 'products',
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/google-services/top-ads?startDate=${startDate}&endDate=${endDate}&scope=${scope}`,
		{
			method: 'GET',
			next: { revalidate: 60 },
		},
	);

	if (!response.ok) {
		console.log(response);
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado - Erro interno do servidor',
		};
	}

	const dataADS = await response.json();

	if (!dataADS.ok) {
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado ' + dataADS.error,
		};
	}
	return dataADS;
}
