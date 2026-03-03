/** @format */

import { getMarketingReportAggregate } from '@/services/marketing-report/get-marketing-report-aggregate';
import { formatMarketingReportText } from '@/services/marketing-report/format-marketing-report-text';
import { notFound } from 'next/navigation';
import MarketingReportPublicCard from './marketing-report-public-card';

interface MarketingReportPublicContentProps {
	reportId: string;
	date?: string;
	period?: 'current-month' | 'last-month';
}

export default async function MarketingReportPublicContent({
	reportId,
	date,
	period,
}: MarketingReportPublicContentProps) {
	if (reportId !== 'current') {
		notFound();
	}

	const aggregate = await getMarketingReportAggregate({ date, period });
	if (!aggregate.ok) {
		return <MarketingReportPublicCard errorMessage={aggregate.error} />;
	}

	const reportText = formatMarketingReportText(aggregate.data);
	return <MarketingReportPublicCard reportText={reportText} />;
}
