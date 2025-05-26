/** @format */

export async function FetchSalesBy(
	startDate: string,
	endDate: string,
	category: string,
	customerType: string,
	org: string,
) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/data-services/comercial-sales-by?startDate=${startDate}&endDate=${endDate}&category=${category}&customerType=${customerType}&org=${org}`,

		{
			next: { revalidate: 60, tags: ['sales-by'] },
			method: 'GET',
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
