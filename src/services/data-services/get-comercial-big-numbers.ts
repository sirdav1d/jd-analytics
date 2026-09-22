import { requireActiveUser } from '@/lib/auth';
import {
	getCommercialBigNumbers,
	type CommercialBigNumbersData,
} from '@/services/data-services/shared-read-services';
import type { CommercialFilters } from '@/services/app-read-contracts';

export { getCommercialBigNumbers } from '@/services/data-services/shared-read-services';
export type { CommercialBigNumbersData } from '@/services/data-services/shared-read-services';

export async function FetchBigNumbers(
	startDate: string,
	endDate: string,
	category: string,
	customerType: string,
	org: string,
) {
	const user = await requireActiveUser();
	const filters: CommercialFilters = { startDate, endDate, category, customerType, org };

	return getCommercialBigNumbers(user, filters);
}

export type CommercialBigNumbersResponse = Awaited<ReturnType<typeof getCommercialBigNumbers>>;
export type CommercialBigNumbers = CommercialBigNumbersData;
