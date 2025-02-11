/** @format */

import { NextResponse } from 'next/server';

export async function GET() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const redirectUri = process.env.GOOGLE_REDIRECT_URI;
	const scopes = process.env.GOOGLE_SCOPES?.split(' ').join('%20'); // Formatar os escopos para URL

	if (!clientId || !redirectUri || !scopes) {
		return NextResponse.json(
			{ error: 'Credenciais do Google não configuradas corretamente' },
			{ status: 500 },
		);
	}

	const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&access_type=offline&prompt=consent`;

	return NextResponse.redirect(authUrl);
}
