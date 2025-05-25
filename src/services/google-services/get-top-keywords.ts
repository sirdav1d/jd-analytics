/** @format */

export async function FetchKeywordADSData(startDate: string, endDate: string) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/google-services/top-keywords?startDate=${startDate}&endDate=${endDate}`,
		{
			method: 'GET',
			next: { revalidate: 60 },
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
