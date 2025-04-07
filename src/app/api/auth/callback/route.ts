/** @format */

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

	if (!code) {
		return NextResponse.json(
			{
				error: 'Código de autorização ausente',
				redirectUri: new URL('/dashboard/marketing', request.url),
			},
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

		const organizationId = '75d5e26d-5030-4abf-ac16-9351b73a4a20';
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const dataToUpdate: any = {
			googleAccessToken: tokens.access_token,
			googleExpiresIn: tokens.expires_in,
			googleScopes: tokens.scope,
		};

		if (tokens.refresh_token) {
			dataToUpdate.googleRefreshToken = tokens.refresh_token;
		}

		const updatedOrganization = await prisma.organization.update({
			where: { id: organizationId },
			data: dataToUpdate,
		});

		if (!updatedOrganization) {
			console.log(updatedOrganization);
			return NextResponse.json({
				error: 'Algo deu errado, org tokens não atualizados',
				ok: false,
				org: null,
			});
		}

		return NextResponse.redirect(new URL('/dashboard/marketing', request.url));
	} catch (error) {
		console.log('Erro na requisição do token:', error);
		return NextResponse.json(
			{
				error: 'Erro interno',
			},
			{ status: 500 },
		);
	}
}
