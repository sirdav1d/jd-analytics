import { requireActiveUser } from '@/lib/auth';
import {
	getCommercialRankings,
	type CommercialRankingsData,
} from '@/services/data-services/shared-read-services';
import type { CommercialFilters } from '@/services/app-read-contracts';

export { getCommercialRankings } from '@/services/data-services/shared-read-services';
export type { CommercialRankingsData } from '@/services/data-services/shared-read-services';

export async function FetchRankings(
	startDate: string,
	endDate: string,
	category: string,
	customerType: string,
	org: string,
) {
	const user = await requireActiveUser();
	const filters: CommercialFilters = { startDate, endDate, category, customerType, org };

	return getCommercialRankings(user, filters);
}

export type CommercialRankingsResponse = Awaited<ReturnType<typeof getCommercialRankings>>;
export type CommercialRankings = CommercialRankingsData;
