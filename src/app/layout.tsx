/** @format */

import { Toaster } from '@/components/ui/sonner';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import AuthSessionProvider from '@/providers/session-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { unstable_ViewTransition as ViewTransition } from 'react';

const montserrat = Montserrat({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	display: 'swap',
	preload: true,
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'JD Analytics',
	description: 'Dados integrados e precisos para uso interno da JD Info',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ViewTransition>
			<html
				lang='pt-BR'
				suppressHydrationWarning
				suppressContentEditableWarning>
				<body suppressHydrationWarning className={`${montserrat.className} antialiased`}>
					<ReactQueryProvider>
						<ThemeProvider
							attribute={'class'}
							defaultTheme='dark'
							enableSystem
							disableTransitionOnChange>
							<AuthSessionProvider>{children}</AuthSessionProvider>
							<Toaster />
						</ThemeProvider>
					</ReactQueryProvider>
				</body>
			</html>
		</ViewTransition>
	);
}
