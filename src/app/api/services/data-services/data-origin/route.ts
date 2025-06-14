/** @format */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	console.log(searchParams);
	return NextResponse.json('Passou por aqui');
}
