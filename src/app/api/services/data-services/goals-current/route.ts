import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserForRequest } from '@/lib/auth';
import { assertActiveUser } from '@/lib/authorization';
import { getGoalsCurrent } from '@/services/data-services/goals-shared-services';
import { serviceErrorResponse } from '@/app/api/services/response';

export async function GET(request?: NextRequest) {
	try {
		const currentUser = await getCurrentUserForRequest(request);
		assertActiveUser(currentUser);
		const scope = request?.nextUrl.searchParams.get('scope') === 'services' ? 'services' : 'products';

		return NextResponse.json(await getGoalsCurrent(currentUser, scope));
	} catch (error) {
		return serviceErrorResponse(error, 'GET goals-current');
	}
}
