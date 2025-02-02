/** @format */

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();
	if (session) {
		redirect('/dashboard');
	}
	return <main>{children}</main>;
}
