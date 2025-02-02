/** @format */

'use client';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function BtnSignOut() {
	return (
		<Button
			size={'sm'}
			variant={'destructive'}
			onClick={() => signOut({ redirect: true, callbackUrl: '/sign-in' })}>
			Sair <LogOut size={16} />
		</Button>
	);
}
