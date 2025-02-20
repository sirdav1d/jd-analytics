/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { analyticsdata_v1beta, google } from 'googleapis';
import { refreshAccessTokenAction } from './refresh-token';

interface getAnalyticsDataActionProps {
	body: analyticsdata_v1beta.Schema$RunReportRequest;
}

export async function getAnalyticsChannelAction({
	body,
}: getAnalyticsDataActionProps) {
	const { success, error } = await refreshAccessTokenAction();

	if (!success || error) {
		console.log(error);
		return {
			error: 'Erro ao buscar dados do Google Analytics' + error,
			ok: false,
			data: null,
		};
	}

	const organization = await prisma.organization.findFirst();
	const propertyId = '295260064';

	if (!organization || !organization.googleAccessToken || !propertyId) {
		return {
			error: 'Token de acesso ou ID da propriedade ausente',
			ok: false,
			data: null,
		};
	}

	try {
		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: organization.googleAccessToken });

		// Instancia o cliente da API Analytics Data (v1beta)
		const analyticsData = google.analyticsdata('v1beta');

		const response = await analyticsData.properties.runReport({
			property: `properties/${propertyId}`,
			requestBody: body,
			auth, // passa o cliente de autenticação
		});

		const data = response.data;

		if (!data || !data.rows) {
			return {
				error: 'Erro ao buscar dados do Google Analytics',
				ok: false,
				data: null,
			};
		}

		const trafficByChannel: {
			[key: string]: { conversions: number; sessions: number };
		} = {
			'Organic Search': { conversions: 0, sessions: 0 },
			'Paid Search': { conversions: 0, sessions: 0 },
			Direct: { conversions: 0, sessions: 0 },
			Social: { conversions: 0, sessions: 0 },
			Other: { conversions: 0, sessions: 0 }, // Acumula as demais origens
		};
		data.rows.forEach((row) => {
			const channel = row.dimensionValues?.[0]?.value || 'Other';
			const conversions = Number(row.metricValues?.[0]?.value) || 0;
			const sessions = Number(row.metricValues?.[1]?.value) || 0;

			// Se o canal estiver nas categorias predefinidas, soma os valores, senão joga em "Other"
			if (trafficByChannel[channel]) {
				trafficByChannel[channel].conversions += conversions;
				trafficByChannel[channel].sessions += sessions;
			} else {
				trafficByChannel['Other'].conversions += conversions;
				trafficByChannel['Other'].sessions += sessions;
			}
		});

		return {
			ok: true,
			data: trafficByChannel,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			error: 'Erro ao buscar dados do Google Analytics' + error,
			ok: false,
			data: null,
		};
	}
}
