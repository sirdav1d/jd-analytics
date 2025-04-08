/** @format */

'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { FileUpload } from './ui/file-upload';
import { toast } from 'sonner';

export default function UploadForm() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [file, setFile] = useState<File | null>(null);

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
			setMessage('Selecione um arquivo antes de enviar.');
			return;
		}

		setLoading(true);
		setMessage('');

		const formData = new FormData();
		formData.append('csv', file);

		const res = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});

		const json = await res.json();

		if (json.ok) {
			toast.success('Upload feito com sucesso!');
			handleFileChange(null);
		} else {
			setMessage(`Erro: ${json.error}`);
		}

		setLoading(false);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col max-w-md mx-auto'>
			<FileUpload onChange={handleFileChange} />
			<Button
				type='submit'
				disabled={loading}>
				{loading ? 'Enviando...' : 'Enviar CSV'}
			</Button>
			{message && <p className='text-sm mt-2 text-destructive'>{message}</p>}
		</form>
	);
}
