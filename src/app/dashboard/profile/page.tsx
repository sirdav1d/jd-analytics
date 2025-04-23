/** @format */

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import UserConfigAccount from './_components/user-config-account';
import UserInfo from './_components/user-info';

export default async function UserProfile() {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const session = await getServerSession();
	if (!session) {
		redirect('/sign-in');
	}
	const response = await fetch(
		`${baseURL}/api/services/user-get-by-email`,

		{
			method: 'GET',
			headers: {
				'X-My-Custom-Header': String(session.user?.email),
			},
			cache: 'no-store',
			next: { tags: ['user'] },
		},
	);

	const { data } = await response.json();
	return (
		<div className='w-full mx-auto pb-4 space-y-4 min-h-screen'>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
				<UserInfo user={data} />
				<UserConfigAccount userEmail={data.email} />
			</div>
		</div>
	);
}
