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
	User2,
	UserCog,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function AppSidebar({ name }: { name: string }) {
	const items = [
		{
			title: 'Home',
			url: '/dashboard',
			icon: Home,
		},
		{
			title: 'Acompanhamento',
			url: '/dashboard/goals-result',
			icon: Trophy,
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
	];
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const pathname = usePathname();

	const handleNavigation = (url: string) => {
		// Inicia a navegação e mostra o loader

		startTransition(() => {
			router.push(url, { scroll: false });
		});

		// Depois de a navegação ser concluída, oculta o loader
	};

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
										<button
											key={item.title}
											onClick={() => handleNavigation(item.url)}>
											<item.icon />

											<span>{item.title}</span>
										</button>
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
										<button
											key={item.title}
											onClick={() => handleNavigation(item.url)}>
											<item.icon />

											<span>{item.title}</span>
										</button>
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
							<Link
								href={'/dashboard/profile'}
								prefetch={true}>
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
