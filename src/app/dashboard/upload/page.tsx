/** @format */

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import UploadForm from '@/components/upload-form';
import { LinxSyncPanel } from './_components/linx-sync-panel';

export default function UploadPage() {
	return (
		<div className='mx-auto flex h-full w-full max-w-6xl flex-col gap-8 pb-10'>
			<LinxSyncPanel />

			<section aria-labelledby='manual-upload-title' className='space-y-4'>
				<div>
					<h2 id='manual-upload-title' className='text-lg font-semibold'>
						Importação manual
					</h2>
					<p className='text-sm text-muted-foreground'>
						Se a integração Linx estiver indisponível, continue usando os
						arquivos CSV nos mesmos formatos. Os feedbacks e fluxos de Pedidos e
						Origem permanecem disponíveis abaixo.
					</p>
				</div>
				<div className='grid grid-cols-1 justify-center gap-10 md:grid-cols-2 md:items-center'>
					<Card className='h-full w-full md:min-w-96 md:max-h-[500px]'>
						<CardHeader>
							<CardTitle>Pedidos</CardTitle>
							<CardDescription>Inserir dados de pedidos</CardDescription>
						</CardHeader>
						<CardContent>
							<UploadForm typeDoc={'Pedidos'} />
						</CardContent>
					</Card>
					<Card className='h-full w-full md:min-w-96 md:max-h-[500px]'>
						<CardHeader>
							<CardTitle>Origem</CardTitle>
							<CardDescription>Inserir dados de origem de pedidos</CardDescription>
						</CardHeader>
						<CardContent>
							<UploadForm typeDoc={'Origem'} />
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
