/** @format */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

	if (!code) {
		return NextResponse.json(
			{ error: 'Código de autorização ausente' },
			{ status: 400 },
		);
	}

	const tokenEndpoint = 'https://oauth2.googleapis.com/token';
	const clientId = process.env.GOOGLE_CLIENT_ID!;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
	const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

	try {
		const response = await fetch(tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				code,
				client_id: clientId,
				client_secret: clientSecret,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code',
			}),
		});

		const tokens = await response.json();

		if (!response.ok) {
			console.error('Erro ao obter token:', tokens);
			return NextResponse.json(
				{ error: 'Falha ao obter token' },
				{ status: 500 },
			);
		}

		// Salvar tokens no Supabase futuramente
		return NextResponse.json(tokens);
	} catch (error) {
		console.error('Erro na requisição do token:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
