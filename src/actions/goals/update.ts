/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

interface IUpdateSalesGoalAction {
	revenue: number;
	goalId: string;
}

export async function UpdateSalesGoalAction({
	revenue,
	goalId,
}: IUpdateSalesGoalAction) {
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

		revalidateTag('tracking-goal');
		revalidateTag('goal');

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
