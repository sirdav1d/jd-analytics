import { requireActiveUser } from '@/lib/auth';
import {
	getCommercialOriginData,
	type CommercialOriginData,
} from '@/services/data-services/shared-read-services';
import type { CommercialFilters } from '@/services/app-read-contracts';

export { getCommercialOriginData } from '@/services/data-services/shared-read-services';
export type { CommercialOriginData } from '@/services/data-services/shared-read-services';

export async function FetchOriginData(
	startDate: string,
	endDate: string,
	category: string,
	customerType: string,
	org: string,
) {
	const user = await requireActiveUser();
	const filters: CommercialFilters = { startDate, endDate, category, customerType, org };

	return getCommercialOriginData(user, filters);
}

export type CommercialOriginResponse = Awaited<ReturnType<typeof getCommercialOriginData>>;
export type CommercialOrigin = CommercialOriginData;
