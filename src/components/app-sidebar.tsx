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
	Loader2,
	Megaphone,
	ShoppingCart,
	Target,
	Trophy,
	UploadCloud,
	User2,
	UserCog,
} from 'lucide-react';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function AppSidebar({ name }: { name: string }) {
	const items = [
		{
			title: 'Home',
			url: '/dashboard',
			icon: Home,
		},

		{
			title: 'Marketing',
			url: '/dashboard/marketing',
			icon: Megaphone,
		},
		{
			title: 'Comercial',
			url: '/dashboard/comercial',
			icon: ShoppingCart,
		},
		{
			title: 'Acompanhamento',
			url: '/dashboard/goals-result',
			icon: Trophy,
		},
	];

	const adminiItems = [
		{
			title: 'Gestão de Usuários',
			url: '/dashboard/users',
			icon: UserCog,
		},
		{
			title: 'Definição de Meta',
			url: '/dashboard/goals',
			icon: Target,
		},
		{
			title: 'Upload CSV',
			url: '/dashboard/upload',
			icon: UploadCloud,
		},
	];
	const [isPending] = useTransition();
	const pathname = usePathname();

	return (
		<Sidebar collapsible='icon'>
			<SidebarContent className='bg-white dark:bg-slate-900'>
				<SidebarGroup>
					<SidebarGroupLabel>Administrativo</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className='space-y-2'>
							{adminiItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={`transition-all ease-linear duration-200 active:shadow-lg ${
											pathname == item.url
												? 'bg-primary hover:bg-primary/90 text-slate-50 hover:text-slate-50 active:bg-primary/90  active:text-slate-50'
												: 'bg-transparent'
										}`}>
										<Link
											key={item.title}
											href={item.url}>
											<item.icon />

											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>
						Relatórios
						{isPending && items.find((item) => item.url == pathname) && (
							<Loader2 className='animate-spin h-2 w-2 ml-2' />
						)}
					</SidebarGroupLabel>
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
										<Link
											key={item.title}
											href={item.url}>
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
			<SidebarFooter className='bg-white dark:bg-slate-900'>
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
								<span className='text-ellipsis'>{name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
