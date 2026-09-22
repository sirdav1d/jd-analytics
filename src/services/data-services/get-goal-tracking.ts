import { requireActiveUser } from '@/lib/auth';
import {
	getGoalTracking,
	type GoalTrackingResponse,
} from '@/services/data-services/goals-shared-services';

export { getGoalTracking } from '@/services/data-services/goals-shared-services';
export type { GoalTrackingResponse } from '@/services/data-services/goals-shared-services';

export async function FetchGoalTrackingData(
	startDate: string,
	endDate: string,
): Promise<GoalTrackingResponse> {
	const user = await requireActiveUser();

	return getGoalTracking(user, { startDate, endDate });
}
