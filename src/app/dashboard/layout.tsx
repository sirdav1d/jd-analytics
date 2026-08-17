/** @format */
import AppSidebar from '@/components/app-sidebar';
import HeaderDashboard from '@/components/header-dashboard';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardOverviewProvider } from '@/providers/dashboard-overview-provider';

export default async function DashLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<DashboardOverviewProvider>
			<SidebarProvider
				suppressHydrationWarning
				suppressContentEditableWarning
				defaultOpen={true}>
				<AppSidebar />
				<div className='w-full px-4  flex flex-col xl:mx-2 mt-5 xl:mt-0'>
					<SidebarTrigger className='z-50 fixed md:-translate-x-[60px] xl:-translate-x-[68.5px] md:mb-2 top-3' />
					<HeaderDashboard />
					{children}
				</div>
			</SidebarProvider>
		</DashboardOverviewProvider>
	);
}
