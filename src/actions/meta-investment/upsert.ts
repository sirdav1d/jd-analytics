/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { startOfMonth } from 'date-fns';
import { revalidatePath, revalidateTag } from 'next/cache';

interface UpsertMetaInvestmentInput {
	periodEnd: Date;
	totalInvestment: number;
}

export async function UpsertMetaInvestmentAction({
	periodEnd,
	totalInvestment,
}: UpsertMetaInvestmentInput) {
	try {
		const periodStart = startOfMonth(periodEnd);
		const lastSyncAt = new Date();

		const investment = await prisma.metaInvestment.upsert({
			where: { periodStart },
			update: {
				periodEnd,
				totalInvestment,
				lastSyncAt,
			},
			create: {
				periodStart,
				periodEnd,
				totalInvestment,
				lastSyncAt,
			},
		});

		revalidateTag('meta-investments');
		revalidatePath('/dashboard/meta-investments');

		return { ok: true, investment, error: null };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Internal error';
		return { ok: false, investment: null, error: message };
	}
}
