/** @format */

// src/app/api/analytics/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
	const accessToken =
		'ya29.a0AXeO80TvvrBG4gfaByJXmUAmPFZfOLMtrjhgsnb0xVQo19BIVDO8LzNutxVHZcKkARKfG5aYl61v4JVUUIGhX5oPq3srnNNFjpVWLETlOdwU8RVh9lUy2q2rEFIfSwrb_VNHdnQ5nuxphE9DJsc4jjnoL9X0zId_ZHAEBPv9aCgYKAeASARESFQHGX2Mis1ghQYr_G-SWj4O7ALcdow0175'; // Substitua com o token de acesso obtido anteriormente

	const apiUrl =
		'https://analyticsreporting.googleapis.com/v4/reports:batchGet'; // Endpoint para Google Analytics

	const body = JSON.stringify({
		reportRequests: [
			{
				viewId: '9888485792', // Substitua pelo ID da vista do Google Analytics
				dateRanges: [
					{
						startDate: '7daysAgo',
						endDate: 'today',
					},
				],
				metrics: [
					{
						expression: 'ga:sessions', // Métrica a ser obtida
					},
				],
				dimensions: [
					{
						name: 'ga:browser', // Exemplo de dimensão
					},
				],
			},
		],
	});

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body,
		});

		const data = await response.json();

		console.log(data);
		if (!response.ok) {
			NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
