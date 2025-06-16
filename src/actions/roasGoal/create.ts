/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ICreateRoasGoalAction {
	goalDateRef: Date;
	roas: number;
}

export async function CreateRoasGoalAction({
	goalDateRef,
	roas,
}: ICreateRoasGoalAction) {
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
