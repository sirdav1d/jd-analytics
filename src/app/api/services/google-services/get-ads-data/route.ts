import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { assertActiveUser } from '@/lib/authorization';
import { googleAdsFiltersSchema } from '@/services/app-read-contracts';
import { getGoogleAdsData } from '@/services/google-services/shared-operations';
import { serviceErrorResponse } from '@/app/api/services/response';

export async function GET(request: NextRequest) {
	try {
		const currentUser = await getCurrentUserFromRequest(request);
		assertActiveUser(currentUser);
		const filters = googleAdsFiltersSchema.parse(Object.fromEntries(request.nextUrl.searchParams));

		return NextResponse.json(await getGoogleAdsData(currentUser, filters));
	} catch (error) {
		return serviceErrorResponse(error, 'GET Google Ads data');
	}
}
