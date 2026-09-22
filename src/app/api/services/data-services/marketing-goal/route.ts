import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { assertActiveAdmin } from '@/lib/authorization';
import { serviceErrorResponse } from '@/app/api/services/response';

export async function GET(request: NextRequest) {
	try {
		const currentUser = await getCurrentUserFromRequest(request);
		assertActiveAdmin(currentUser);
		const scope = request.nextUrl.searchParams.get('scope') === 'services' ? 'services' : 'products';
		const { getMarketingGoals } = await import('@/services/data-services/get-marketing-goals');
		const result = await getMarketingGoals(currentUser, scope);

		if (!result.ok) {
			return NextResponse.json({ ok: false, error: result.error, data: null }, { status: result.status });
		}

		return NextResponse.json({ ok: true, data: result.data, bigNumbers: result.bigNumbers, error: null });
	} catch (error) {
		return serviceErrorResponse(error, 'GET marketing-goal');
	}
}
