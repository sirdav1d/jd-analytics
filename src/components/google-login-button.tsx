/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleLoginButton() {
	const handleLogin = async () => {
		window.location.href = '/api/auth/login-google'; // Rota OAuth
	};

	return (
		<Button
			onClick={handleLogin}
			className='flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 w-full md:w-fit dark:bg-gray-900 dark:text-white dark:border-gray-700'>
			<FcGoogle className='text-xl' />
			Conectar conta Google
		</Button>
	);
}
