import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { assertActiveUser } from '@/lib/authorization';
import { getResultsByOrganization } from '@/services/data-services/shared-read-services';
import { periodFiltersSchema } from '@/services/app-read-contracts';
import { serviceErrorResponse } from '@/app/api/services/response';

export async function GET(request: NextRequest) {
	try {
		const currentUser = await getCurrentUserFromRequest(request);
		assertActiveUser(currentUser);
		const filters = periodFiltersSchema.parse(Object.fromEntries(request.nextUrl.searchParams));

		return NextResponse.json(await getResultsByOrganization(currentUser, filters));
	} catch (error) {
		return serviceErrorResponse(error, 'GET home data-services');
	}
}
