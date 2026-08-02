/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function CreateOrgAction(name: string) {
	await requireAdmin();
	try {
		const organization = await prisma.organization.create({
			data: { name: name },
		});

		if (!organization) {
			return {
				error: 'Algo deu errado, org não criada',
				ok: false,
				org: null,
			};
		}

		return {
			error: null,
			ok: true,
			org: organization,
		};
	} catch (error) {
		return {
			error: error,
			ok: false,
			org: null,
		};
	}
}
