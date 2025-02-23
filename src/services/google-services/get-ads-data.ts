/** @format */

export async function FetchADSData(startDate: string, endDate: string) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/google-services/get-ads-data?startDate=${startDate}&endDate=${endDate}`,
		{
			method: 'GET',
			next: { revalidate: 3600 },
		},
	);

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
