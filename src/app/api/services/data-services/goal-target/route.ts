import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserForRequest } from '@/lib/auth';
import { getCommercialGoalTargets } from '@/services/data-services/get-goal-target';
import { assertActiveAdmin } from '@/lib/authorization';
import { serviceErrorResponse } from '@/app/api/services/response';

export async function GET(request?: NextRequest) {
	try {
		const currentUser = await getCurrentUserForRequest(request);
		assertActiveAdmin(currentUser);
		return NextResponse.json(await getCommercialGoalTargets(currentUser));
	} catch (error) {
		return serviceErrorResponse(error, 'GET goal-target');
	}
}
