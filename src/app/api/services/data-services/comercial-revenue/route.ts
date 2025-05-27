/** @format */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const category = searchParams.get('category');
	const customerType = searchParams.get('customerType');
	const org = searchParams.get('org');

	if (!startDate || !endDate) {
		return NextResponse.json(
			{
				ok: false,
				error: 'Parâmetros startDate e endDate são obrigatórios.',
				data: null,
			},
			{ status: 400 },
		);
	}

	const start = new Date(`${startDate}T00:00:00`);
	const end = new Date(`${endDate}T23:59:59`);

	try {
		console.log('Fetching data with filters:', {
			start,
			end,
			category,
			customerType,
			org,
		});
	} catch (error) {
		console.error('Error fetching data:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch data' },
			{ status: 500 },
		);
	}
}
