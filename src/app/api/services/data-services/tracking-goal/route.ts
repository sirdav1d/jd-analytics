import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { assertActiveUser } from '@/lib/authorization';
import { getGoalTracking } from '@/services/data-services/goals-shared-services';
import { goalTrackingFiltersSchema } from '@/services/app-read-contracts';
import { serviceErrorResponse } from '@/app/api/services/response';

export async function GET(request: NextRequest) {
	try {
		const currentUser = await getCurrentUserFromRequest(request);
		assertActiveUser(currentUser);
		const filters = goalTrackingFiltersSchema.parse(Object.fromEntries(request.nextUrl.searchParams));

		return NextResponse.json(await getGoalTracking(currentUser, filters));
	} catch (error) {
		return serviceErrorResponse(error, 'GET tracking-goal');
	}
}
