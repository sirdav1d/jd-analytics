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
			variant={'outline'}
			onClick={handleLogin}
			className='flex items-center gap-2 w-full md:w-fit text-foreground'>
			<FcGoogle className='text-xl text-foreground' />
			Conectar conta Google
		</Button>
	);
}
