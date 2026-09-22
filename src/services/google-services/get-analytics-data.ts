import { requireActiveUser } from '@/lib/auth';
import type { PeriodFilters } from '@/services/app-read-contracts';
import { getGoogleAnalyticsData } from '@/services/google-services/shared-operations';

export { getGoogleAnalyticsData } from '@/services/google-services/shared-operations';

export async function FetchAnalyticsData(startDate: string, endDate: string) {
	const user = await requireActiveUser();
	const filters: PeriodFilters = { startDate, endDate };

	return getGoogleAnalyticsData(user, filters);
}
