/** @format */

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { AuthorizationError } from '@/lib/authorization';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		await requireAdmin();
		const users = await prisma.user.findMany({
			where: { isActive: true },
			select: {
				id: true,
				name: true,
				email: true,
				externalId: true,
				role: true,
				isActive: true,
				createdAt: true,
			},
		});
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
		if (error instanceof AuthorizationError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		return NextResponse.json({ error: error, ok: false, data: null });
	}
}
