/** @format */

import { createAnalyticsDataClient } from '@/lib/google-analytics-client';
import { formatMetricsChannel } from '@/utils/format-channel-data-google';
import { formatMetrics } from '@/utils/format-static-data-google';
import { formatMetricsTraffic } from '@/utils/format-traffic-data-google';
import { generateBodyChannelAnalytics } from '@/utils/google/body-channel-analytics';
import { generateBodyStaticAnalytics } from '@/utils/google/body-static-analytics';
import { generateBodyTrafficAnalytics } from '@/utils/google/body-traffic-analytics';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const propertyId = '295260064';

	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const channelFilter = searchParams.get('channelFilter');

	if (!startDate || !endDate || !channelFilter) {
		return NextResponse.json({
			error: 'Parametros de URL não encontrados',
			ok: false,
			data: null,
		});
	}

	try {
		const [staticBody, trafficBody, channelBody] = [
			generateBodyStaticAnalytics({
				startDate,
				endDate,
				channel: channelFilter,
			}),
			generateBodyTrafficAnalytics({
				startDate,
				endDate,
				channel: channelFilter,
			}),
			generateBodyChannelAnalytics({
				startDate,
				endDate,
				channel: channelFilter,
			}),
		];

		const { analyticsData, auth } = await createAnalyticsDataClient();

		const [responseStatic, responseTraffic, responseChannel] =
			await Promise.all([
				analyticsData.properties.runReport({
					property: `properties/${propertyId}`,
					requestBody: staticBody,
					auth,
				}),
				analyticsData.properties.runReport({
					property: `properties/${propertyId}`,
					requestBody: trafficBody,
					auth,
				}),
				analyticsData.properties.runReport({
					property: `properties/${propertyId}`,
					requestBody: channelBody,
					auth,
				}),
			]);

		const [dataStatic, dataTraffic, dataChannel] = [
			responseStatic.data,
			responseTraffic.data,
			responseChannel.data,
		];

		if (!dataStatic || !dataTraffic || !dataChannel) {
			return NextResponse.json({
				error: 'Erro ao buscar dados do Google Analytics',
				ok: false,
				data: null,
			});
		}

		const [staticMetrics, trafficMetrics, channelMetrics] = [
			formatMetrics(dataStatic),
			formatMetricsTraffic(dataTraffic),
			formatMetricsChannel(dataChannel),
		];

		return NextResponse.json({
			ok: true,
			data: [staticMetrics, trafficMetrics, channelMetrics],
			error: null,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			error: 'Erro ao buscar dados do Google Analytics' + error,
			ok: false,
			data: null,
		});
	}
}
