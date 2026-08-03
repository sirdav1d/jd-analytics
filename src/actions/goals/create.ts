/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

interface ICreateSalesGoalAction {
	userId: string;
	goalDateRef: Date;
	revenue: number;
}

export async function CreateSalesGoalAction({
	goalDateRef,
	revenue,
	userId,
}: ICreateSalesGoalAction) {
	await requireAdmin();
	try {
		const goal = await prisma.salesGoal.create({
			data: {
				goalDateRef,
				revenue,
				userId,
			},
		});

		if (!goal) {
			return {
				error: 'Algo deu errado, meta não criada',
				ok: false,
				goal: null,
			};
		}

		revalidateTag('users', { expire: 0 });
		revalidateTag('rankings', { expire: 0 });
		revalidateTag('tracking-goal', { expire: 0 });
		revalidateTag('goal', { expire: 0 });
		revalidateTag('sales-by', { expire: 0 });
		revalidateTag('big-numbers-comercial', { expire: 0 });

		return {
			error: null,
			ok: true,
			goal: goal,
		};
	} catch (error) {
		return {
			error: error,
			ok: false,
			goal: null,
		};
	}
}
