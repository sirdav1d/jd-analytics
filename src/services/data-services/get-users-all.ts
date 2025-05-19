/** @format */

export async function FetchGoalTargetData() {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}/api/services/user-get-all`, {
		next: { tags: ['users'], revalidate: 60 },
	});

	if (!response.ok) {
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado - Erro interno do servidor',
		};
	}

	const data = await response.json();
	new Promise((resolve) => {
		setTimeout(() => {
			resolve('hello');
		}, 3000);
	});

	if (!data.ok) {
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado ' + data.error,
		};
	}
	return data;
}
