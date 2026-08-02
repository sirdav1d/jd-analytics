/** @format */

import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserConfigAccount from './_components/user-config-account';
import UserInfo from './_components/user-info';

export default async function UserProfile() {
	const user = await getCurrentUser();
	if (!user?.isActive) {
		redirect('/sign-in');
	}
	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
				<UserInfo user={user} />
				<UserConfigAccount />
			</div>
		</div>
	);
}
