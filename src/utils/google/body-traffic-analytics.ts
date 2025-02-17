/** @format */

import { analyticsdata_v1beta } from 'googleapis';

interface generateBodyTrafficAnalyticsProps {
	startDate: string;
	endDate: string;
	channel?: string;
}

export function generateBodyTrafficAnalytics({
	channel,
	endDate,
	startDate,
}: generateBodyTrafficAnalyticsProps) {
	const body: analyticsdata_v1beta.Schema$RunReportRequest = {
		dateRanges: [{ startDate: startDate, endDate: endDate }],
		dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
		metrics: [
			{ name: 'totalUsers' }, // Usuários
		],
	};

	if (channel && channel !== 'all') {
		body.dimensionFilter = {
			filter: {
				fieldName: 'sessionDefaultChannelGrouping',
				stringFilter: {
					matchType: 'EXACT',
					value: channel,
				},
			},
		};
	}
	return body;
}
