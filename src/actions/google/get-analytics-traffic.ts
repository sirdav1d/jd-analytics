/** @format */

'use server';

import { prisma } from '@/lib/prisma';
import { analyticsdata_v1beta, google } from 'googleapis';
import { refreshAccessTokenAction } from './refresh-token';

interface getAnalyticsDataActionProps {
	body: analyticsdata_v1beta.Schema$RunReportRequest;
}

export async function getAnalyticsTrafficAction({
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
	const propertyId = '465499652';

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

		if (!data) {
			return {
				error: 'Erro ao buscar dados do Google Analytics',
				ok: false,
				data: null,
			};
		}
		const userByChannel: { [key: string]: number } = {
			'Organic Search': 0,
			'Paid Search': 0,
			Social: 0,
			Direct: 0,
		};

		if (data?.metricHeaders && data?.rows && data.rows.length > 0) {
			// Processando os usuários por canal
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			data.rows.forEach((row: any) => {
				const channel = row.dimensionValues[0]?.value || 'Outros';
				const totalUsers = row.metricValues[0]?.value || 0;

				// Convertendo o valor para inteiro, para somar corretamente
				if (channel && totalUsers) {
					userByChannel[channel] =
						(userByChannel[channel] || 0) + parseInt(totalUsers, 10);
				}
			});
		}

		return {
			ok: true,
			data: userByChannel,
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
