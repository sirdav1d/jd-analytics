/** @format */

import 'server-only';
import { NextRequest } from 'next/server';
import type { GoogleAdsScope } from '@/lib/google-ads-account';
import { GET as readMarketingGoals } from '@/app/api/services/data-services/marketing-goal/route';

export async function FetchGoalMarketingData(scope: GoogleAdsScope = 'products') {
	const request = new NextRequest(
		`http://internal.invalid/api/services/data-services/marketing-goal?scope=${scope}`,
	);
	const response = await readMarketingGoals(request);
	return response.json();
}
