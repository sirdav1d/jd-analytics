/** @format */

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import UploadForm from '@/components/upload-form';

export default function UploadPage() {
	return (
		<div className='mx-auto flex h-full w-full max-w-6xl flex-col gap-8 pb-10'>
			<section aria-labelledby='manual-upload-title' className='space-y-4 h-full flex items-center justify-center'>

				<div className='grid grid-cols-1 justify-center gap-10 md:grid-cols-2 md:items-center'>
					<Card className='h-full w-full md:w-96 md:max-h-[500px]'>
						<CardHeader>
							<CardTitle>Pedidos</CardTitle>
							<CardDescription>Inserir dados de pedidos</CardDescription>
						</CardHeader>
						<CardContent>
							<UploadForm typeDoc={'Pedidos'} />
						</CardContent>
					</Card>
					<Card className='h-full w-full md:w-96 md:max-h-[500px]'>
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
