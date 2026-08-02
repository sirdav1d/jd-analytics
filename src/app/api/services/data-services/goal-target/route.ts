/** @format */

import { requireAdmin } from '@/lib/auth';
import { AuthorizationError } from '@/lib/authorization';
import { FetchGoalTargetData } from '@/services/data-services/get-goal-target';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		await requireAdmin();
		return NextResponse.json(await FetchGoalTargetData());
	} catch (err: unknown) {
		if (err instanceof AuthorizationError) {
			return NextResponse.json({ error: err.message }, { status: err.status });
		}
		console.error(err);
		return NextResponse.json(
			{
				ok: false,
				error: err instanceof Error ? err.message : 'Erro interno do servidor',
			},
			{ status: 500 },
		);
	}
}
