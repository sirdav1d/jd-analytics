/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MarketingReportPublicCopyActions from './marketing-report-public-copy-actions';
import Logo from '@/components/logo';

interface MarketingReportPublicCardProps {
	reportText?: string;
	errorMessage?: string;
}

export default function MarketingReportPublicCard({
	reportText,
	errorMessage,
}: MarketingReportPublicCardProps) {
	const lines = reportText?.split('\n') ?? [];
	const reportTitle = lines[0];
	const reportBody = lines.slice(1).join('\n').replace(/^\n+/u, '');

	return (
		<Card className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
			<CardHeader className='flex flex-col gap-4'>
				<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
					<Logo />
					<MarketingReportPublicCopyActions reportText={reportText} />
				</div>
				{reportTitle ? <CardTitle className='text-base'>{reportTitle}</CardTitle> : null}
			</CardHeader>
			<CardContent>
				{errorMessage ? (
					<p className='text-sm text-destructive'>{errorMessage}</p>
				) : (
					<pre className='whitespace-pre-wrap break-words text-sm leading-relaxed'>
						{reportBody}
					</pre>
				)}
			</CardContent>
		</Card>
	);
}
