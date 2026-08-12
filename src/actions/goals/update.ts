/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath, updateTag } from 'next/cache';

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

		updateTag('rankings');
		updateTag('tracking-goal');
		updateTag('sales-by');
		updateTag('big-numbers-comercial');
		updateTag('goals-current');
		revalidatePath('/dashboard/goals-comercial');
		revalidatePath('/dashboard');

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
