/** @format */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
	const { setTheme, systemTheme, theme } = useTheme();

	const currentTheme = theme === 'system' ? systemTheme : theme;

	function handleClick() {
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
	}

	return (
		<Button
			onClick={() => handleClick()}
			className='bg-transparent'
			variant='outline'
			size='icon'>
			<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	);
}
