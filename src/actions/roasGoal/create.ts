/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath, updateTag } from 'next/cache';

interface ICreateRoasGoalAction {
	goalDateRef: Date;
	roas: number;
}

export async function CreateRoasGoalAction({
	goalDateRef,
	roas,
}: ICreateRoasGoalAction) {
	await requireAdmin();
	try {
		const goal = await prisma.roasGoal.create({
			data: {
				goalDateRef,
				roas,
			},
		});

		if (!goal) {
			return {
				error: 'Algo deu errado, meta não criada',
				ok: false,
				goal: null,
			};
		}

		revalidatePath('/dashboard/goals-marketing');
		revalidatePath('/dashboard');
		updateTag('goals-current');

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
