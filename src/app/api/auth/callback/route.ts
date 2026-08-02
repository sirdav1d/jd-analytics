/** @format */

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { AuthorizationError } from '@/lib/authorization';
import {
	decodeGoogleOAuthRequest,
	GOOGLE_OAUTH_COOKIE,
	matchesGoogleOAuthState,
} from '@/lib/google-oauth';
import { NextResponse, NextRequest } from 'next/server';
import { getOAuth2Client } from '@/lib/google-client';

export async function GET(request: NextRequest) {
	try {
		await requireAdmin();
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		throw error;
	}
	const clearOAuthCookie = (response: NextResponse) => {
		response.cookies.set({
			name: GOOGLE_OAUTH_COOKIE,
			value: '',
			maxAge: 0,
			path: '/api/auth',
		});
		return response;
	};
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const oauthRequest = decodeGoogleOAuthRequest(
		request.cookies.get(GOOGLE_OAUTH_COOKIE)?.value,
	);

	if (
		!code ||
		!state ||
		!oauthRequest ||
		!matchesGoogleOAuthState(oauthRequest.state, state)
	) {
		return clearOAuthCookie(
			NextResponse.json({ error: 'Estado OAuth inválido' }, { status: 400 }),
		);
	}

	const oauth2Client = getOAuth2Client();

	let tokens;
	try {
		const { tokens: t } = await oauth2Client.getToken({
			code,
			codeVerifier: oauthRequest.codeVerifier,
		});
		tokens = t;
	} catch (err) {
		console.error(
			'[Google OAuth Callback] Erro ao trocar code por token:',
			err,
		);
		return clearOAuthCookie(NextResponse.json(
			{ error: 'Falha na autenticação com o Google' },
			{ status: 500 },
		));
	}

	try {
		const organizationId = process.env.JD_CENTRO_ID;

		const updatedOrganization = await prisma.organization.update({
			where: { id: organizationId },
			data: {
				googleAccessToken: tokens.access_token!,
				googleRefreshToken: tokens.refresh_token!,
				googleExpiresAt: tokens.expiry_date!,
				googleScopes: tokens.scope!,
			},
		});

		if (!updatedOrganization) {
			return clearOAuthCookie(
				NextResponse.json({
					error: 'Algo deu errado, org tokens não atualizados',
					ok: false,
					org: null,
				}),
			);
		}

		return clearOAuthCookie(
			NextResponse.redirect(new URL('/dashboard/marketing', request.url)),
		);
	} catch (error) {
		console.log('Erro na requisição de callback:', error);
		return clearOAuthCookie(NextResponse.json(
			{
				error: 'Erro interno',
			},
			{ status: 500 },
		));
	}
}
