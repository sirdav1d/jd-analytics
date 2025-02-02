/** @format */

'use client';

import { useTheme } from 'next-themes';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
	const { theme } = useTheme();

	if (theme === 'light') {
		return (
			<Link href='/'>
				<Image
					src={'/logo-png-light.png'}
					alt={'LOGO JD INFO'}
					width={200}
					height={100}
					className='object-contain w-32'></Image>
			</Link>
		);
	}
	if (theme === 'dark') {
		return (
			<Link href='/'>
				<Image
					src={'/logo-png.png'}
					alt={'LOGO JD INFO'}
					width={200}
					height={100}
					className='object-contain w-32'></Image>
			</Link>
		);
	}
}
