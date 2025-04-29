/** @format */

import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { formatMetricsChannel } from '@/utils/format-channel-data-google';
import { formatMetrics } from '@/utils/format-static-data-google';
import { formatMetricsTraffic } from '@/utils/format-traffic-data-google';
import { generateBodyChannelAnalytics } from '@/utils/google/body-channel-analytics';
import { generateBodyStaticAnalytics } from '@/utils/google/body-static-analytics';
import { generateBodyTrafficAnalytics } from '@/utils/google/body-traffic-analytics';
import { google } from 'googleapis';
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
		const orgId = process.env.JD_CENTRO_ID;

		const { oauth2Client } = await getAuthenticatedClient(orgId!);

		await oauth2Client.getAccessToken();

		const analytics = google.analyticsdata('v1beta').properties;

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

		const [responseStatic, responseTraffic, responseChannel] =
			await Promise.all([
				analytics.runReport({
					property: `properties/${propertyId}`,
					requestBody: staticBody,
					auth: oauth2Client,
				}),
				analytics.runReport({
					property: `properties/${propertyId}`,
					requestBody: trafficBody,
					auth: oauth2Client,
				}),
				analytics.runReport({
					property: `properties/${propertyId}`,
					requestBody: channelBody,
					auth: oauth2Client,
				}),
			]);

		const [dataStatic, dataTraffic, dataChannel] = [
			responseStatic.data,
			responseTraffic?.data,
			responseChannel?.data,
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
