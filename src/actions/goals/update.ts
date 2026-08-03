/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

interface IUpdateSalesGoalAction {
	revenue: number;
	goalId: string;
}

export async function UpdateSalesGoalAction({
	revenue,
	goalId,
}: IUpdateSalesGoalAction) {
	await requireAdmin();
	try {
		const goal = await prisma.salesGoal.update({
			where: { id: goalId },
			data: {
				revenue,
			},
		});

		if (!goal) {
			return {
				error: 'Algo deu errado, meta não atualizada',
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
