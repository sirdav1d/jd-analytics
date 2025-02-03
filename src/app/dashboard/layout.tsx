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
			<SidebarTrigger />
			<div className=' w-full p-4 flex flex-col xl:mx-10'>
				<HeaderDashboard />
				{children}
			</div>
		</SidebarProvider>
	);
}
