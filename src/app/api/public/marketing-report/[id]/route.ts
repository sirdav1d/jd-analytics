/** @format */

import { getMarketingReportAggregate } from '@/services/marketing-report/get-marketing-report-aggregate';
import { formatMarketingReportText } from '@/services/marketing-report/format-marketing-report-text';
import { NextRequest, NextResponse } from 'next/server';

const TEXT_HEADERS = {
	'Content-Type': 'text/plain; charset=utf-8',
};

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	if (id !== 'current') {
		return new NextResponse('Not found', {
			status: 404,
			headers: TEXT_HEADERS,
		});
	}

	const aggregate = await getMarketingReportAggregate();
	if (!aggregate.ok) {
		const status =
			aggregate.error === 'Nenhum investimento META encontrado' ? 404 : 500;
		return new NextResponse(aggregate.error, { status, headers: TEXT_HEADERS });
	}

	return new NextResponse(formatMarketingReportText(aggregate.data), {
		headers: TEXT_HEADERS,
	});
}
