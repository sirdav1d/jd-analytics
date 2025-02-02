/** @format */

'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Garantir que o componente só seja renderizado após a montagem
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className='w-32 h-10' />; // Placeholder para evitar o erro de hidratação
	}

	return (
		<Link href='/'>
			<Image
				src={theme === 'light' ? '/logo-png-light.png' : '/logo-png.png'}
				alt='LOGO JD INFO'
				width={200}
				height={100}
				className='object-contain w-32'
			/>
		</Link>
	);
}
