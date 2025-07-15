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
	Blocks,
	ChevronDown,
	Crosshair,
	Goal,
	Handshake,
	Home,
	Loader2,
	ShoppingCart,
	Trophy,
	UploadCloud,
	User2,
	UserCog,
} from 'lucide-react';

import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import Logo from './logo';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from './ui/collapsible';
import { Separator } from './ui/separator';

export default function AppSidebar() {
	const { open } = useSidebar();
	const isMobile = useIsMobile();
	const session = useSession();
	const items = [
		{
			title: 'Home',
			url: '/dashboard',
			icon: Home,
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
			title: 'Upload CSV',
			url: '/dashboard/upload',
			icon: UploadCloud,
		},
	];

	const goalsItems = [
		{
			title: 'Marketing',
			url: '/dashboard/goals-marketing',
			icon: Goal,
		},
		{
			title: 'Comercial',
			url: '/dashboard/goals-comercial',
			icon: Crosshair,
		},
	];

	const marketingItems = [
		{
			title: 'Produtos',
			url: '/dashboard/marketing',
			icon: Blocks,
		},
		{
			title: 'Serviços',
			url: '/dashboard/marketing-servs',
			icon: Handshake,
		},
	];
	const [isPending] = useTransition();
	const pathname = usePathname();

	return (
		<Sidebar collapsible='icon'>
			<SidebarContent className='bg-white dark:bg-slate-900'>
				<div
					className={`pt-4 md:pl-3 flex items-center ${isMobile ? 'hidden' : 'justify-start'} `}>
					{open ? <Logo /> : null}
				</div>
				{open ? <Separator /> : null}
				<SidebarGroup className={`${open ? 'mt-0' : 'md:mt-8'}`}>
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
											href={item.url}
											scroll={false}>
											<item.icon />

											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<Collapsible
					defaultOpen
					className='group/collapsible'>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger>
								Definição de Metas
								<ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu className='space-y-1'>
									{goalsItems.map((item) => (
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
													href={item.url}
													scroll={false}>
													<item.icon />

													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
				<Separator />
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
				<Collapsible
					defaultOpen
					className='group/collapsible'>
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger>
								Marketing
								<ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu className='space-y-1'>
									{marketingItems.map((item) => (
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
													href={item.url}
													scroll={false}>
													<item.icon />

													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>
			</SidebarContent>

			<Separator />
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
								<span className='text-ellipsis'>
									{session?.data?.user?.name}
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
