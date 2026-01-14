/** @format */

import { getMarketingReportAggregate } from '@/services/marketing-report/get-marketing-report-aggregate';
import { formatMarketingReportText } from '@/services/marketing-report/format-marketing-report-text';
import { notFound } from 'next/navigation';
import MarketingReportPublicCard from './marketing-report-public-card';

interface MarketingReportPublicContentProps {
	reportId: string;
}

export default async function MarketingReportPublicContent({
	reportId,
}: MarketingReportPublicContentProps) {
	if (reportId !== 'current') {
		notFound();
	}

	const aggregate = await getMarketingReportAggregate();
	if (!aggregate.ok) {
		return <MarketingReportPublicCard errorMessage={aggregate.error} />;
	}

	const reportText = formatMarketingReportText(aggregate.data);
	return <MarketingReportPublicCard reportText={reportText} />;
}
