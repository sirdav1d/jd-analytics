import { requireActiveUser } from '@/lib/auth';
import {
	getCommercialSalesBy,
	type CommercialSalesByData,
} from '@/services/data-services/shared-read-services';
import type { CommercialFilters } from '@/services/app-read-contracts';

export { getCommercialSalesBy } from '@/services/data-services/shared-read-services';
export type { CommercialSalesByData } from '@/services/data-services/shared-read-services';

export async function FetchSalesBy(
	startDate: string,
	endDate: string,
	category: string,
	customerType: string,
	org: string,
) {
	const user = await requireActiveUser();
	const filters: CommercialFilters = { startDate, endDate, category, customerType, org };

	return getCommercialSalesBy(user, filters);
}

export type CommercialSalesByResponse = Awaited<ReturnType<typeof getCommercialSalesBy>>;
export type CommercialSalesBy = CommercialSalesByData;
