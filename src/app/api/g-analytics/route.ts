/** @format */

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);

	const startDate = searchParams?.get('startDate') || '60daysAgo';
	const endDate = searchParams?.get('endDate') || 'today';

	try {
		const organization = await prisma.organization.findFirst();
		const propertyId = '465499652';

		if (!organization || !organization.googleAccessToken || !propertyId) {
			return NextResponse.json(
				{ error: 'Token de acesso ou ID da propriedade ausente', ok: false },
				{ status: 401 },
			);
		}

		const response = await fetch(
			`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${organization.googleAccessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
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
				}),
			},
		);

		if (!response.ok) {
			console.log(response);
			console.log(searchParams?.get('startDate'));
			return NextResponse.json({
				error: 'Erro ao buscar dados do Google Analytics',
				ok: false,
				data: null,
			});
		}

		const data = await response.json();
		const formattedMetrics: { [key: string]: string | null } = {};
		if (data?.metricHeaders && data?.rows && data.rows.length > 0) {
			const headers = data.metricHeaders;
			const firstRow = data.rows[0];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			headers.forEach((header: any, index: number) => {
				formattedMetrics[header.name] =
					firstRow.metricValues[index]?.value || null;
			});
		}

		return NextResponse.json({
			ok: true,
			data: formattedMetrics,
			error: null,
		});
	} catch (error) {
		return NextResponse.json({ error: error, ok: false, data: null });
	}
}
