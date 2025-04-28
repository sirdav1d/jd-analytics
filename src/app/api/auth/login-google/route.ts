/** @format */

import { getOAuth2Client } from '@/lib/google-client';
import { NextResponse } from 'next/server';

export async function GET() {
	const scopesEnv = process.env.GOOGLE_SCOPES;
	if (!scopesEnv) {
		return NextResponse.json(
			{ error: 'GOOGLE_SCOPES não configurado' },
			{ status: 500 },
		);
	}

	const oauth2Client = getOAuth2Client();

	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline', // Garante refresh_token
		prompt: 'consent', // Força o consentimento toda vez
		scope: process.env.GOOGLE_SCOPES?.split(' ') || [],
	});

	const response = NextResponse.redirect(authUrl);

	return response;
}
