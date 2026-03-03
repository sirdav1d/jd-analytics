/** @format */

import { getMarketingReportAggregate } from '@/services/marketing-report/get-marketing-report-aggregate';
import { formatMarketingReportText } from '@/services/marketing-report/format-marketing-report-text';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TEXT_HEADERS = {
	'Content-Type': 'text/plain; charset=utf-8',
};

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	if (id !== 'current') {
		return new NextResponse('Not found', {
			status: 404,
			headers: TEXT_HEADERS,
		});
	}

	const rawPeriod = req.nextUrl.searchParams.get('period');
	const period =
		rawPeriod === 'current-month' || rawPeriod === 'last-month'
			? rawPeriod
			: undefined;
	const date = req.nextUrl.searchParams.get('date') ?? undefined;

	const aggregate = await getMarketingReportAggregate({ period, date });
	if (!aggregate.ok) {
		const status = aggregate.error.startsWith(
			'Nenhum investimento META encontrado',
		)
			? 404
			: aggregate.error.startsWith('date invalida')
				? 400
				: 500;
		return new NextResponse(aggregate.error, { status, headers: TEXT_HEADERS });
	}

	return new NextResponse(formatMarketingReportText(aggregate.data), {
		headers: TEXT_HEADERS,
	});
}
