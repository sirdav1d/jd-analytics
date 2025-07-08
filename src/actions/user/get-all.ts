/** @format */

'use server';

import { prisma } from '@/lib/prisma';

export default async function getAllSellers() {
	const resp = await prisma.user.findMany({
		where: { role: 'SELLER', isActive: true },
		select: { name: true, id: true },
	});

	if (!resp) {
		return {
			ok: false,
			data: null,
			error: 'Dados não encontrados',
		};
	}

	return {
		ok: true,
		data: resp,
		error: null,
	};
}
