/** @format */

import { requireAdmin } from '@/lib/auth';
import { AuthorizationError } from '@/lib/authorization';
import { createMarketingGoalLoaders } from '@/services/data-services/get-marketing-goals';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		await requireAdmin();
		const scope =
			req.nextUrl.searchParams.get('scope') === 'services'
				? 'services'
				: 'products';
		const result = await createMarketingGoalLoaders(scope).response;
		if (!result.ok) {
			return NextResponse.json(
				{ ok: false, error: result.error, data: null },
				{ status: result.status },
			);
		}
		return NextResponse.json({
			ok: true,
			data: result.data,
			bigNumbers: result.bigNumbers,
			error: null,
		});
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		console.error('Erro ao buscar ROAS goals:', error);
		return NextResponse.json(
			{ ok: false, error: 'Erro ao buscar metas de ROAS', data: null },
			{ status: 500 },
		);
	}
}
