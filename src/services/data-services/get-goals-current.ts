import { requireActiveUser } from '@/lib/auth';
import {
	getGoalsCurrent,
	type GoalsCurrentResponse,
} from '@/services/data-services/goals-shared-services';
import type { GoogleAdsScope } from '@/lib/google-ads-account';

export { getGoalsCurrent } from '@/services/data-services/goals-shared-services';
export type { GoalsCurrentResponse } from '@/services/data-services/goals-shared-services';

export async function FetchGoalsCurrentData(
	scope: GoogleAdsScope = 'products',
): Promise<GoalsCurrentResponse> {
	const user = await requireActiveUser();

	return getGoalsCurrent(user, scope);
}
