/** @format */

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import AuthSessionProvider from '@/providers/session-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const montserrat = Montserrat({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	display: 'swap',
	preload: true,
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
		<html
			lang='pt-BR'
			suppressHydrationWarning>
			<body className={`${montserrat.className} antialiased`}>
				<AuthSessionProvider>
					<ThemeProvider
						attribute={'class'}
						defaultTheme='dark'
						enableSystem
						disableTransitionOnChange>
						{children}
						<Toaster />
					</ThemeProvider>
				</AuthSessionProvider>
			</body>
		</html>
	);
}
