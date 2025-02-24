/** @format */

export async function FetchAnalyticsData(
	startDate: string,
	endDate: string,
	Channel: string,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/google-services/get-analytics-data?startDate=${startDate}&endDate=${endDate}&channelFilter=${Channel}`,
		{
			method: 'GET',
			next: { revalidate: 3600 },
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
