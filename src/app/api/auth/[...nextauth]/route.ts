/** @format */

import { prisma } from '@/lib/prisma';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'E-mail',
					type: 'email',
					placeholder: 'email@email.com',
				},
				password: { label: 'Senha', type: 'password', placeholder: '******' },
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: { email: credentials?.email },
				});

				if (!user || !credentials) {
					return null;
				}

				const hashPassword = await bcrypt.compare(
					credentials?.password,
					user?.password,
				);

				if (credentials?.email === user.email && hashPassword) {
					return user; // Retorna o usuário se as credenciais forem válidas
				}

				return null; // Retorna null se as credenciais forem inválidas
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/sign-in',
		signOut: '/sign-in',
		error: '/',
		verifyRequest: '/sign-in',
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.name = user.name;
				token.email = user.email;
				return token;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token) {
				session.user = token;
				return session;
			}
			return session;
		},
	},
});

export { handler as GET, handler as POST };
