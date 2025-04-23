/** @format */

export async function FetchADSDataCampaign(
	startDate: string,
	endDate: string,
	campaignId: string,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/google-services/get-ads-data/campaign?startDate=${startDate}&endDate=${endDate}&campaignId=${campaignId}`,
		{
			method: 'GET',
			next: { revalidate: 30 },
			cache: 'force-cache',
		},
	);
	if (!response.ok) {
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
