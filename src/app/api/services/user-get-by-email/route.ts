/** @format */

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

	const customHeader = req.headers.get('x-my-custom-header');
	try {
		const user = await prisma.user.findUnique({
			where: { email: customHeader! },
			include: { organization: { select: { name: true } } },
		});
		if (!user) {
			return NextResponse.json({
				error: 'nenhum usuário encontrado',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			error: null,
			ok: false,
			data: user,
		});
	} catch (error) {
		return NextResponse.json({ error: error, ok: false, data: null });
	}
}
