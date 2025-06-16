/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface IUpdateRoasGoalAction {
	roas: number;
	goalId: string;
}

export async function UpdateRoasGoalAction({
	roas,
	goalId,
}: IUpdateRoasGoalAction) {
	try {
		const goal = await prisma.roasGoal.update({
			where: { id: goalId },
			data: {
				roas,
			},
		});

		if (!goal) {
			return {
				error: 'Algo deu errado, meta não atualizada',
				ok: false,
				goal: null,
			};
		}

		revalidatePath('/');

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
