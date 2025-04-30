/** @format */

export async function FetchTopADSData(
	startDate: string,
	endDate: string,
	campaignId: string,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/google-services/top-ads?startDate=${startDate}&endDate=${endDate}&campaignId=${campaignId}`,
		{
			method: 'GET',
			next: { revalidate: 60 },
		},
	);

	console.log(response);

	if (!response.ok) {
		console.log(response);
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado - Erro interno do servidor',
		};
	}

	const dataADS = await response.json();

	console.log(dataADS);
	if (!dataADS.ok) {
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado ' + dataADS.error,
		};
	}
	return dataADS;
}
