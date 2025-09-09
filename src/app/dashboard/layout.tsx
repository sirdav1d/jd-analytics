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
		redirect('/sign-in');
	}
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

	return (
		<SidebarProvider
			suppressHydrationWarning
			suppressContentEditableWarning
			defaultOpen={defaultOpen}>
			<AppSidebar />
			<div className='w-full px-4  flex flex-col xl:mx-2 mt-5 xl:mt-0'>
				<SidebarTrigger className='z-50 fixed md:-translate-x-[60px] xl:-translate-x-[68.5px] md:mb-2 top-3' />
				<HeaderDashboard />
				{children}
			</div>
		</SidebarProvider>
	);
}
