/** @format */

import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import { getOAuth2Client } from '@/lib/google-client';

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

	if (!code) {
		return NextResponse.json(
			{ error: 'Código de autorização (code) não encontrado' },
			{ status: 400 },
		);
	}

	const oauth2Client = getOAuth2Client();

	let tokens;
	try {
		const { tokens: t } = await oauth2Client.getToken(code);
		tokens = t;
	} catch (err) {
		console.error(
			'[Google OAuth Callback] Erro ao trocar code por token:',
			err,
		);
		return NextResponse.json(
			{ error: 'Falha na autenticação com o Google' },
			{ status: 500 },
		);
	}

	try {
		const organizationId = process.env.JD_CENTRO_ID;

		const updatedOrganization = await prisma.organization.update({
			where: { id: organizationId },
			data: {
				googleAccessToken: tokens.access_token!,
				googleRefreshToken: tokens.refresh_token!,
				googleExpiresAt: tokens.expiry_date!,
			},
		});

		if (!updatedOrganization) {
			return NextResponse.json({
				error: 'Algo deu errado, org tokens não atualizados',
				ok: false,
				org: null,
			});
		}

		return NextResponse.redirect(new URL('/dashboard/marketing', request.url));
	} catch (error) {
		console.log('Erro na requisição de callback:', error);
		return NextResponse.json(
			{
				error: 'Erro interno',
			},
			{ status: 500 },
		);
	}
}
