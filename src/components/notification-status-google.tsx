/** @format */

// components/NotificationStatus.tsx
'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface NotificationStatusProps {
	status: 'success' | 'error';
}

export default function NotificationStatus({
	status,
}: NotificationStatusProps) {
	useEffect(() => {
		if (status === 'success') {
			toast.success('Dados Atualizados com Sucesso');
		} else if (status === 'error') {
			toast.error('Erro ao carregar os dados');
		}
	}, [status]);

	return null;
}
