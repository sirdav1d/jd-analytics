/** @format */

export async function FetchGoalsCurrentData() {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(
		`${baseURL}/api/services/data-services/goals-current`,
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
