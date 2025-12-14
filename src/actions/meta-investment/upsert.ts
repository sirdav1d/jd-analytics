/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { startOfMonth } from 'date-fns';
import { revalidatePath } from 'next/cache';

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

		const existing = await prisma.metaInvestment.findFirst({
			where: { periodEnd },
			select: { id: true },
		});

		const investment = existing
			? await prisma.metaInvestment.update({
					where: { id: existing.id },
					data: {
						periodStart,
						periodEnd,
						totalInvestment,
						lastSyncAt,
					},
			  })
			: await prisma.metaInvestment.create({
					data: {
						periodStart,
						periodEnd,
						totalInvestment,
						lastSyncAt,
					},
			  });

		revalidatePath('/dashboard/(admin)/meta-investments');

		return { ok: true, investment, error: null };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Internal error';
		return { ok: false, investment: null, error: message };
	}
}
