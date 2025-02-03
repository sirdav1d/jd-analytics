/** @format */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
				const user = {
					id: '1',
					email: 'admin@jdinfo.com.br',
					name: 'Jorge Ribeiro',
					password: 'admin@jd',
				};
				if (
					credentials?.email === user.email &&
					credentials?.password === user.password
				) {
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
	},
	callbacks: {
		jwt: async ({ token, user, session, account, profile }) => {
			return {
				...token,
				...user,
				...session,
				...account,
				...profile,
			};
		},
		session: async ({ session, token, newSession, user }) => {
			return {
				...token,
				...user,
				...session,
				...newSession,
			};
		},
	},
});

export { handler as GET, handler as POST };
