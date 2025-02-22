/** @format */

export async function FetchADSData() {
	const response = await fetch(
		'http://localhost:3000/api/services/google-services/get-ads-data',
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
