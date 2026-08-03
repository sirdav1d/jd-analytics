/** @format */

import { getOAuth2Client } from '@/lib/google-client';
import { requireAdmin } from '@/lib/auth';
import { AuthorizationError } from '@/lib/authorization';
import {
	createGoogleOAuthRequest,
	encodeGoogleOAuthRequest,
	GOOGLE_OAUTH_COOKIE,
	GOOGLE_OAUTH_MAX_AGE_SECONDS,
} from '@/lib/google-oauth';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		await requireAdmin();
		const scopesEnv = process.env.GOOGLE_SCOPES;
		if (!scopesEnv) {
			return NextResponse.json(
				{ error: 'GOOGLE_SCOPES não configurado' },
				{ status: 500 },
			);
		}

		const oauth2Client = getOAuth2Client();
		const oauthRequest = createGoogleOAuthRequest();

		const authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			prompt: 'consent',
			scope: scopesEnv.split(' '),
			state: oauthRequest.state,
			code_challenge: oauthRequest.codeChallenge,
			code_challenge_method: 'S256' as NonNullable<
				Parameters<typeof oauth2Client.generateAuthUrl>[0]
			>['code_challenge_method'],
		});

		const response = NextResponse.redirect(authUrl);
		response.cookies.set({
			name: GOOGLE_OAUTH_COOKIE,
			value: encodeGoogleOAuthRequest(oauthRequest),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: GOOGLE_OAUTH_MAX_AGE_SECONDS,
			path: '/api/auth',
		});
		return response;
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		throw error;
	}
}
