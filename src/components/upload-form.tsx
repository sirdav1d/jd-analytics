/** @format */

'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { FileUpload } from './ui/file-upload';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
	getUploadError,
	getUploadRoute,
	type UploadDocumentKind,
	type UploadResponse,
} from './upload-route';

interface UploadForm {
	typeDoc: UploadDocumentKind;
}

export default function UploadForm({ typeDoc }: UploadForm) {
	const route = getUploadRoute(typeDoc);
	const [loading, setLoading] = useState(false);

	const [file, setFile] = useState<File | null>(null);

	const router = useRouter();
	const handleFileChange = (files: File[] | null) => {
		if (!files || files.length === 0) {
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

			const json: UploadResponse = await res.json();
			const errorMessage = getUploadError(res.ok, json);

			if (!errorMessage) {
				toast.success('Upload feito com sucesso!');
				setFile(null);
				router.push('/dashboard/goals-result');
			} else {
				toast.error(errorMessage);
				setLoading(false);
			}
		} catch {
			toast.error('Algo deu errado, tente novamente.');
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
