import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { assertActiveUser } from '@/lib/authorization';
import { getCommercialOriginData, parseCommercialFilters } from '@/services/data-services/shared-read-services';
import { serviceErrorResponse } from '@/app/api/services/response';

export async function GET(request: NextRequest) {
	try {
		const currentUser = await getCurrentUserFromRequest(request);
		assertActiveUser(currentUser);
		const filters = parseCommercialFilters(Object.fromEntries(request.nextUrl.searchParams));

		return NextResponse.json(await getCommercialOriginData(currentUser, filters));
	} catch (error) {
		return serviceErrorResponse(error, 'GET data-origin');
	}
}
