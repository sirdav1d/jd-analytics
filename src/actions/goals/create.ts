/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath, updateTag } from 'next/cache';

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
