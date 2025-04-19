/** @format */
import AppSidebar from '@/components/app-sidebar';
import HeaderDashboard from '@/components/header-dashboard';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { refreshAccessToken } from '@/lib/refresh-token';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();
	if (!session) {
		redirect('/login');
	}
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

	const baseURL = process.env.NEXT_PUBLIC_API_URL;

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
	refreshAccessToken();
	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar name={data ? data.name : 'Dado Não Encontrado'} />
			<div className='w-full px-4  flex flex-col xl:mx-5 '>
				<SidebarTrigger className='mt-2 z-50' />
				<HeaderDashboard />
				{children}
			</div>
		</SidebarProvider>
	);
}
