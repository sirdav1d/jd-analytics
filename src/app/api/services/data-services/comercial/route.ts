/** @format */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const startDate = searchParams.get('startDate');
	const endDate = searchParams.get('endDate');
	const category = searchParams.get('category');
	const customerType = searchParams.get('customerType');

	try {
		console.log('Start Date:', startDate);
		console.log('End Date:', endDate);
		console.log('Category:', category);
		console.log('Customer Type:', customerType);
	} catch (error) {
		console.error('Error fetching data:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch data' },
			{ status: 500 },
		);
	}
}
