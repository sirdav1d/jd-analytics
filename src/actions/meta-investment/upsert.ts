/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { startOfMonth } from 'date-fns';
import { revalidatePath, updateTag } from 'next/cache';

interface UpsertMetaInvestmentInput {
	periodEnd: Date;
	totalInvestment: number;
}

export async function UpsertMetaInvestmentAction({
	periodEnd,
	totalInvestment,
}: UpsertMetaInvestmentInput) {
	await requireAdmin();
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

		updateTag('goals-current');
		revalidatePath('/dashboard/meta-investments');
		revalidatePath('/marketing-report/current');
		revalidatePath('/dashboard');

		return { ok: true, investment, error: null };
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Internal error';
		return { ok: false, investment: null, error: message };
	}
}
