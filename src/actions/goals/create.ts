/** @format */

'use server';

import { prisma } from '@/lib/prisma';
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

		revalidateTag('users');
		revalidateTag('rankings');
		revalidateTag('tracking-goal');
		revalidateTag('goal');
		revalidateTag('sales-by');
		revalidateTag('big-numbers-comercial');

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
