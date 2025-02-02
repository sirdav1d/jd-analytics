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
import { Megaphone, Settings, ShoppingBag, User2, UserCog } from 'lucide-react';
import Link from 'next/link';

export default function AppSidebar() {
	const items = [
		{
			title: 'Admin',
			url: '/dashboard/admin',
			icon: UserCog,
		},
		{
			title: 'Marketing',
			url: '/dashboard/marketing',
			icon: Megaphone,
		},
		{
			title: 'Comercial',
			url: '/dashboard/comercial',
			icon: ShoppingBag,
		},

		{
			title: 'Configurações',
			url: '/dashboard/settings',
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
									<SidebarMenuButton
										asChild
										disabled
										className='disabled:cursor-not-allowed'>
										<Link
											href={item.url}
											className='cursor-not-allowed'>
											<item.icon />
											<span>{item.title}</span>
										</Link>
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
						<SidebarMenuButton
							asChild
							disabled
							className='disabled:cursor-not-allowed'>
							<Link
								href={'/dashboard/profile'}
								className='cursor-not-allowed'>
								<User2 />
								<span>Meu Perfil</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
