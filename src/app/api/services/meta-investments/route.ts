/** @format */

import { prisma } from '@/lib/prisma';
import { startOfMonth } from 'date-fns';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const parseDateOnly = (value: string) => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
	if (!match) return new Date(value);
	const [, year, month, day] = match;
	return new Date(Number(year), Number(month) - 1, Number(day));
};

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const dateParam = searchParams.get('date');
		const targetDate = dateParam ? parseDateOnly(dateParam) : new Date();
		const periodStart = startOfMonth(targetDate);

		const investments = dateParam
			? await prisma.metaInvestment.findFirst({
					where: { periodStart },
					orderBy: { periodEnd: 'desc' },
			  })
			: await prisma.metaInvestment.findMany({
					orderBy: { periodStart: 'desc' },
			  });

		return NextResponse.json({ ok: true, data: investments, error: null });
	} catch (error) {
		console.error('GET /meta-investments', error);
		return NextResponse.json(
			{ ok: false, data: null, error: 'Internal error' },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const rawPeriodEnd = body?.periodEnd;
		const periodEnd =
			typeof rawPeriodEnd === 'string'
				? parseDateOnly(rawPeriodEnd)
				: new Date(rawPeriodEnd);
		const totalInvestment = Number(body?.totalInvestment);

		if (!body?.periodEnd || Number.isNaN(periodEnd.getTime())) {
			return NextResponse.json(
				{ ok: false, data: null, error: 'periodEnd inválido' },
				{ status: 400 },
			);
		}

		if (!Number.isFinite(totalInvestment) || totalInvestment <= 0) {
			return NextResponse.json(
				{ ok: false, data: null, error: 'totalInvestment inválido' },
				{ status: 400 },
			);
		}

		const periodStart = startOfMonth(periodEnd);

		const investment = await prisma.metaInvestment.upsert({
			where: { periodStart },
			update: {
				periodEnd,
				totalInvestment,
				lastSyncAt: new Date(),
			},
			create: {
				periodStart,
				periodEnd,
				totalInvestment,
			},
		});

		revalidateTag('meta-investments');
		revalidateTag('marketing-report');
		revalidatePath('/dashboard/meta-investments');
		revalidatePath('/marketing-report/current');

		return NextResponse.json({ ok: true, data: investment, error: null });
	} catch (error) {
		console.error('POST /meta-investments', error);
		return NextResponse.json(
			{ ok: false, data: null, error: 'Internal error' },
			{ status: 500 },
		);
	}
}
