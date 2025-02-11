/** @format */

'use client';

import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function NotificationConnectionGoogle() {
	const searchParams = useSearchParams();
	const status = searchParams.get('status');

	if (status === 'success') {
		return (
			<Alert
				variant='success'
				className='w-fit'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Sucesso</AlertTitle>
				<AlertDescription>Conta Google conectada com sucesso</AlertDescription>
			</Alert>
		);
	} else if (status === 'error') {
		return (
			<Alert
				variant='destructive'
				className='w-fit'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Algo deu errado na conexão com a sua conta Google
				</AlertDescription>
			</Alert>
		);
	} else {
		return null;
	}

	// Componente não precisa renderizar nada
}
