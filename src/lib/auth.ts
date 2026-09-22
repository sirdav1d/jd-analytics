import bcrypt from "bcrypt";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import {
	assertActiveAdmin,
	assertActiveUser,
	AuthorizationError,
} from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const currentUserSelect = {
	id: true,
	name: true,
	email: true,
	externalId: true,
	role: true,
	isActive: true,
} as const;

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
	return readCurrentUserById(session.user.id);
}

export async function readCurrentUserById(id: string) {
	return prisma.user.findUnique({
		where: { id },
		select: currentUserSelect,
	});
}

export type CurrentUser = NonNullable<
	Awaited<ReturnType<typeof readCurrentUserById>>
>;

function createRequestWithoutHeaders(
	request: NextRequest,
	removedHeaders: string[],
) {
	const headers = new Headers(request.headers);

	for (const header of removedHeaders) headers.delete(header);

	return new NextRequest(request.url, { headers });
}

async function decodeToken(request: NextRequest) {
	try {
		return await getToken({
			req: request,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: false,
		});
	} catch {
		return null;
	}
}

async function readCookieTokens(request: NextRequest) {
	const cookieRequest = createRequestWithoutHeaders(request, ["authorization"]);
	const tokens = await Promise.all([
		decodeToken(cookieRequest),
		getToken({
			req: cookieRequest,
			secret: process.env.NEXTAUTH_SECRET,
			secureCookie: true,
		}).catch(() => null),
	]);

	return tokens.filter((token): token is NonNullable<typeof token> => token !== null);
}

function assertNoConflictingTokens(
	cookieTokens: Array<{ id?: unknown }>,
) {
	const tokenIds = [
		...cookieTokens.map((token) => token.id),
	].filter((id): id is string => typeof id === "string");
	const distinctIds = new Set(tokenIds);

	if (distinctIds.size > 1) {
		throw new AuthorizationError(401, "Sessões conflitantes");
	}
}

export async function getCurrentUserFromRequest(request: NextRequest | Request) {
	const nextRequest = request instanceof NextRequest
		? request
		: new NextRequest(request.url, { headers: request.headers });
	const cookieTokens = await readCookieTokens(nextRequest);

	assertNoConflictingTokens(cookieTokens);

	const token = cookieTokens[0];

	if (typeof token?.id !== "string") return null;

	return readCurrentUserById(token.id);
}

export async function getCurrentUserForRequest(request?: NextRequest) {
	return request ? getCurrentUserFromRequest(request) : getCurrentUser();
}

export async function requireAdmin() {
	const user = await getCurrentUser();
	assertActiveAdmin(user);
	return user;
}

export async function requireActiveUser() {
	const user = await getCurrentUser();
	assertActiveUser(user);
	return user;
}
