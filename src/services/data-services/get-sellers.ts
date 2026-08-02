/** @format */

import 'server-only';
import { prisma } from '@/lib/prisma';

export async function readAllSellers() {
	const sellers = await prisma.user.findMany({
		where: { role: 'SELLER', isActive: true },
		select: { name: true, id: true },
	});

	return {
		ok: true,
		data: sellers,
		error: null,
	};
}
