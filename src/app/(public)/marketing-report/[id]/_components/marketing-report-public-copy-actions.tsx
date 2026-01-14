/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface MarketingReportPublicCopyActionsProps {
	reportText?: string;
}

export default function MarketingReportPublicCopyActions({
	reportText,
}: MarketingReportPublicCopyActionsProps) {
	function copyReportText() {
		if (!reportText) return;

		navigator.clipboard
			.writeText(reportText)
			.then(() => toast.success('Texto copiado'))
			.catch(() => toast.error('Falha ao copiar texto'));
	}

	function copyPublicLink() {
		const url = new URL(window.location.href);
		url.search = '';
		url.hash = '';

		navigator.clipboard
			.writeText(url.toString())
			.then(() => toast.success('Link copiado'))
			.catch(() => toast.error('Falha ao copiar link'));
	}

	return (
		<div className='flex flex-wrap items-center justify-end gap-2'>
			<Button
				type='button'
				variant='outline'
				size='sm'
				onClick={copyReportText}
				disabled={!reportText}>
				<Copy className='h-4 w-4' />
				Copiar texto
			</Button>
			<Button
				type='button'
				variant='outline'
				size='sm'
				onClick={copyPublicLink}>
				<LinkIcon className='h-4 w-4' />
				Copiar link
			</Button>
		</div>
	);
}
