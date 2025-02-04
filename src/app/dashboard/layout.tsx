/** @format */
import AppSidebar from '@/components/app-sidebar';
import HeaderDashboard from '@/components/header-dashboard';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
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

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<div className=' w-full px-4  flex flex-col xl:mx-5'>
				<SidebarTrigger className='mt-2' />
				<HeaderDashboard />
				{children}
			</div>
		</SidebarProvider>
	);
}
