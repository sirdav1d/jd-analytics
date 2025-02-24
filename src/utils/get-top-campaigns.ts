/** @format */

import { CampagnComponentProps } from '@/app/dashboard/marketing/_components/charts/campaings';

export function getTop5CampaignsByConversions(
	campaigns: CampagnComponentProps[],
) {
	return campaigns
		.sort((a, b) => b.metrics.conversions - a.metrics.conversions)
		.slice(0, 5);
}
