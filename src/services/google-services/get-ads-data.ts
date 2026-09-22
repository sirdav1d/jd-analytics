import { requireActiveUser } from '@/lib/auth';
import type { GoogleAdsScope } from '@/lib/google-ads-account';
import type { GoogleAdsFilters } from '@/services/app-read-contracts';
import { getGoogleAdsData } from '@/services/google-services/shared-operations';

export { getGoogleAdsData } from '@/services/google-services/shared-operations';

export async function FetchADSData(
	startDate: string,
	endDate: string,
	scope: GoogleAdsScope = 'products',
) {
	const user = await requireActiveUser();
	const filters: GoogleAdsFilters = { startDate, endDate, scope, campaignId: 'all' };

	return getGoogleAdsData(user, filters);
}
