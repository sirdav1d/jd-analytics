/** @format */

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import BtnSignOut from './btn-sign-out';
import Greeting from './greeting';
import { ModeToggle } from './ui/mode-toggle';
import { Separator } from './ui/separator';

export default async function HeaderDashboard() {
	const session = await getServerSession();

	if (!session) {
		redirect('/sign-in');
	}

	return (
		<>
			<div className=' flex flex-col-reverse lg:flex-row items-end lg:items-center justify-between w-full gap-5 xl:mt-5'>
				<div className='space-y-2 mr-auto'>
					<h2 className='font-medium text-base xl:text-xl'>
						Bem vindo <span className='text-primary'>{session.user?.name}</span>
					</h2>
					<Greeting />
				</div>
				<div className='flex items-center gap-5'>
					<ModeToggle />
					<BtnSignOut />
				</div>
			</div>
			<Separator className='my-5' />
		</>
	);
}
