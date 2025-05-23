/** @format */

import { analyticsdata_v1beta } from 'googleapis';

interface generateBodyChannelAnalyticsProps {
	startDate: string;
	endDate: string;
	channel?: string;
}

export function generateBodyChannelAnalytics({
	endDate,
	startDate,
}: generateBodyChannelAnalyticsProps) {
	const body: analyticsdata_v1beta.Schema$RunReportRequest = {
		dateRanges: [{ startDate: startDate, endDate: endDate }],
		dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
		metrics: [
			{ name: 'eventCount' }, // eventos
			{ name: 'sessions' }, // sessões
		],
	};

	return body;
}
