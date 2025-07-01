/** @format */

export async function FetchBotConversaData() {
	const baseURL = process.env.NEXT_PUBLIC_BOT_CONVERSA_BASE_URL;
	const response = await fetch(`${baseURL}/subscribers`, {
		method: 'GET',
		headers: new Headers({
			Accept: 'application/json',
			'API-KEY': '0aa832fc-c740-4f13-b6a7-4e5c790d5a0f',
		}),
		next: { revalidate: 30, tags: ['bot-conversa'] },
	});

	if (!response.ok) {
		console.log(response);
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado - Erro interno do servidor',
		};
	}

	const data = await response.json();

	if (!data) {
		return {
			ok: false,
			data: null,
			error: 'Algo deu errado ' + data,
		};
	}
	return {
		ok: true,
		data: data,
		error: null,
	};
}
