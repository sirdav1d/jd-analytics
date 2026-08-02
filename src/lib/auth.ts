import bcrypt from "bcrypt";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { assertActiveAdmin, AuthorizationError } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
	session: { strategy: "jwt" },
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "E-mail", type: "email" },
				password: { label: "Senha", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
			if (!user?.isActive) return null;
			const valid = await bcrypt.compare(credentials.password, user.password);
			if (!valid) return null;
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				isActive: user.isActive,
			};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.isActive = user.isActive;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;
			session.user.isActive = token.isActive;
			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
		signOut: "/sign-in",
		error: "/",
		verifyRequest: "/sign-in",
	},
};

export async function getCurrentUser() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return null;
	return prisma.user.findUnique({
		where: { id: session.user.id },
		select: { id: true, name: true, email: true, role: true, isActive: true },
	});
}

export async function requireAdmin() {
	const user = await getCurrentUser();
	assertActiveAdmin(user);
	return user;
}

export async function requireAdminPage() {
	try {
		return await requireAdmin();
	} catch (error) {
		if (error instanceof AuthorizationError) redirect("/dashboard");
		throw error;
	}
}
