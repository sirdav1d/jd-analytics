/** @format */

'use client';

import { useSession } from 'next-auth/react';
import { LinxSyncControl } from '@/components/linx-sync-control';
import BtnSignOut from './btn-sign-out';
import Greeting from './greeting';
import { ModeToggle } from './ui/mode-toggle';

export default function HeaderDashboard() {
	const session = useSession();

	return (
		<div className=' flex flex-col-reverse lg:flex-row items-end lg:items-center justify-between w-full gap-2 xl:mt-5 mb-5'>
			<div className='lg:space-y-2 mr-auto'>
				<h2 className='font-medium text-base xl:text-xl'>
					Bem vindo <span className='text-primary'>{session.data?.user?.name ?? 'usuário'}</span>
				</h2>
				<Greeting />
			</div>
			<div className='flex items-center gap-5 '>
				<LinxSyncControl variant='desktop' />
				<ModeToggle />
				<BtnSignOut />
			</div>
		</div>
	);
}
