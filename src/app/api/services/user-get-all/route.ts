/** @format */

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const users = await prisma.user.findMany();
		if (!users || users.length == 0) {
			return NextResponse.json({
				error: 'nenhum usuário encontrado',
				ok: false,
				data: null,
			});
		}

		return NextResponse.json({
			error: null,
			ok: true,
			data: users,
		});
	} catch (error) {
		return NextResponse.json({ error: error, ok: false, data: null });
	}
}
