/** @format */

export async function FetchGoalTrackingData(
	startDate: string,
	endDate: string,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/data-services/tracking-goal?startDate=${startDate}&endDate=${endDate}`,
		{
			method: 'GET',
			next: { revalidate: 2 },
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
