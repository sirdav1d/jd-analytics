/** @format */

'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { FileUpload } from './ui/file-upload';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface UploadForm {
	typeDoc: 'Pedidos' | 'Origem';
}

export default function UploadForm({ typeDoc }: UploadForm) {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const route =
		typeDoc == 'Pedidos'
			? `${baseURL}/api/upload`
			: `${baseURL}/api/upload-origin`;
	const [loading, setLoading] = useState(false);

	const [file, setFile] = useState<File | null>(null);

	const router = useRouter();
	const handleFileChange = (files: File[] | null) => {
		if (!files) {
			setFile(null);
			return;
		}
		if (files.length > 0) {
			setFile(files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) {
			console.log('Selecione um arquivo antes de enviar.');
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append('csv', file);

		try {
			const res = await fetch(route, {
				method: 'POST',
				body: formData,
			});

			const json = await res.json();

			if (json.ok) {
				toast.success('Upload feito com sucesso!');
				setFile(null);
				router.push('/dashboard/goals-result');
			} else {
				toast.error('Algo deu errado, tente novamente.');
				console.log(`Erro: ${json.error}`);
				setLoading(false);
			}
		} catch (error) {
			toast.error('Algo deu errado, tente novamente.');
			console.log(error);
			setLoading(false);
		}
	};
	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col  mx-auto'>
			<FileUpload onChange={handleFileChange} />
			<Button
				className='mt-5'
				type='submit'
				disabled={loading}>
				Enviar CSV
				{loading && <Loader2 className='animate-spin' />}
			</Button>
		</form>
	);
}
