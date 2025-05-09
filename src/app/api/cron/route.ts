/** @format */

import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	if (
		req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// 2) Busque todas as organizações configuradas
		const orgs = await prisma.organization.findMany({
			where: {
				googleRefreshToken: { not: null },
			},
			select: { id: true },
		});

		// 3) Para cada org, pegue o client e dispare o refresh
		await Promise.allSettled(
			orgs.map(async ({ id }) => {
				const { oauth2Client } = await getAuthenticatedClient(id);
				// Isso vai automaticamente emitir o evento 'tokens'
				// e o listener vai salvar o que for novo no banco
				await oauth2Client.getAccessToken();
			}),
		);

		return NextResponse.json({
			ok: true,
			message: `Organizações com toen revalidado ${orgs.length}`,
			error: null,
			status: 200,
		});
	} catch (err) {
		console.error('Erro no cron de refresh:', err);
		return NextResponse.json({
			ok: false,
			message: `Erro no cron de refresh: ${err}`,
			error: err,
			status: 500,
		});
	}
}
