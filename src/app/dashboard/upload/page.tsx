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
		<div className='h-full grid md:mx-auto grid-cols-1 md:grid-cols-2 md:items-center justify-center gap-10 pb-10'>
			<Card className='w-full md:min-w-96 h-full md:max-h-[500px]'>
				<CardHeader>
					<CardTitle>Pedidos</CardTitle>
					<CardDescription>Inserir dados de pedidos</CardDescription>
				</CardHeader>
				<CardContent>
					<UploadForm typeDoc={'Pedidos'} />
				</CardContent>
			</Card>
			<Card className='w-full  md:min-w-96 h-full md:max-h-[500px]'>
				<CardHeader>
					<CardTitle>Origem</CardTitle>
					<CardDescription>Inserir dados de origem de pedidos</CardDescription>
				</CardHeader>
				<CardContent>
					<UploadForm typeDoc={'Origem'} />
				</CardContent>
			</Card>
		</div>
	);
}
