/** @format */
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Calendar, Home, Inbox, Search, Settings, User2 } from 'lucide-react';

export default function AppSidebar() {
	const items = [
		{
			title: 'Home',
			url: '#',
			icon: Home,
		},
		{
			title: 'Inbox',
			url: '#',
			icon: Inbox,
		},
		{
			title: 'Calendar',
			url: '#',
			icon: Calendar,
		},
		{
			title: 'Search',
			url: '#',
			icon: Search,
		},
		{
			title: 'Settings',
			url: '#',
			icon: Settings,
		},
	];
	return (
		<Sidebar collapsible='icon'>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<a href={'/dashboard/profile'}>
								<User2 />
								<span>Meu Perfil</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
