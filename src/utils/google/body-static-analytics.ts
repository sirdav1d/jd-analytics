/** @format */

import { analyticsdata_v1beta } from 'googleapis';

interface generateBodyStaticAnalyticsProps {
	startDate: string;
	endDate: string;
	channel?: string;
}

export function generateBodyStaticAnalytics({
	channel,
	endDate,
	startDate,
}: generateBodyStaticAnalyticsProps) {
	const body: analyticsdata_v1beta.Schema$RunReportRequest = {
		dateRanges: [{ startDate: startDate, endDate: endDate }],

		metrics: [
			{ name: 'sessions' }, // Sessões
			{ name: 'totalUsers' }, // Usuários
			{ name: 'bounceRate' }, // Taxa de rejeição
			{ name: 'sessionConversionRate' }, // Taxa de conversão do site
			{ name: 'purchaseRevenue' }, // ecommerce faturamento
			{ name: 'averageSessionDuration' }, //duração média de sessão
			{ name: 'eventCount' }, // Conversões
			{ name: 'screenPageViews' }, // Total de visualizações de página
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
