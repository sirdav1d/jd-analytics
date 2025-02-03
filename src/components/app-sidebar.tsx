/** @format */

'use client';

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
import {
	Home,
	Megaphone,
	Settings,
	ShoppingBag,
	User2,
	UserCog,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
	const items = [
		{
			title: 'Home',
			url: '/dashboard',
			icon: Home,
		},
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

	const pathname = usePathname();
	return (
		<Sidebar collapsible='icon'>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className='space-y-2'>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={`transition-all ease-linear duration-200 active:shadow-lg ${
											pathname == item.url
												? 'bg-primary hover:bg-primary/90 text-slate-50 hover:text-slate-50 active:bg-primary/90  active:text-slate-50'
												: 'bg-transparent'
										}`}>
										<Link href={item.url}>
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
							className={`transition-all ease-linear duration-200 ${
								pathname == '/dashboard/profile'
									? 'bg-primary hover:bg-primary/90 hover:text-slate-50 text-slate-50 active:bg-primary/90 active:shadow-md active:text-slate-50'
									: 'bg-transparent'
							}`}>
							<Link href={'/dashboard/profile'}>
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
