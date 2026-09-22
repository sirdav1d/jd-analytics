import { requireActiveUser } from '@/lib/auth';
import {
	getResultsByOrganization,
	type ResultsByOrganizationData,
} from '@/services/data-services/shared-read-services';
import type { PeriodFilters } from '@/services/app-read-contracts';

export { getResultsByOrganization } from '@/services/data-services/shared-read-services';
export type { ResultsByOrganizationData } from '@/services/data-services/shared-read-services';

export async function FetchResultByOrg(startDate: string, endDate: string) {
	const user = await requireActiveUser();
	const filters: PeriodFilters = { startDate, endDate };

	return getResultsByOrganization(user, filters);
}

export type ResultsByOrganizationResponse = Awaited<ReturnType<typeof getResultsByOrganization>>;
export type ResultsByOrganization = ResultsByOrganizationData;
