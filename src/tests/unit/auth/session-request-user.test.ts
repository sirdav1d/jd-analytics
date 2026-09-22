import { encode } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const user = {
	id: '10000000-0000-4000-8000-000000000001',
	name: 'Usuário atual',
	email: 'atual@jd.test',
	externalId: '10',
	role: 'SELLER' as const,
	isActive: true,
};

const otherUser = { ...user, id: '20000000-0000-4000-8000-000000000002' };

const prismaMock = vi.hoisted(() => ({
	user: { findUnique: vi.fn() },
}));

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { getCurrentUserFromRequest } from '@/lib/auth';

const secret = 'segredo-nextauth-de-teste';

async function sessionToken(id: string, maxAge?: number) {
	return encode({ secret, token: { id, role: user.role, isActive: user.isActive }, maxAge });
}

function request(headers: Record<string, string>) {
	return new NextRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/mcp`, { headers });
}

describe('sessão do app em requisição externa', () => {
	beforeEach(() => {
		vi.stubEnv('NEXTAUTH_SECRET', secret);
		prismaMock.user.findUnique.mockResolvedValue(user);
	});

	it('não usa Bearer NextAuth como sessão do app', async () => {
		const token = await sessionToken(user.id);

		await expect(getCurrentUserFromRequest(request({
			authorization: `Bearer ${token}`,
		}))).resolves.toBeNull();
	});

	it('não recarrega usuário quando só há Bearer', async () => {
		const token = await encode({
			secret,
			token: { id: user.id, role: 'ADMIN', isActive: false },
		});

		await expect(getCurrentUserFromRequest(request({
			authorization: `Bearer ${token}`,
		}))).resolves.toBeNull();
		expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
	});

	it('retorna nulo para sessão expirada ou assinatura inválida', async () => {
		const expired = await sessionToken(user.id, -60);

		await expect(getCurrentUserFromRequest(request({
			authorization: `Bearer ${expired}`,
		}))).resolves.toBeNull();
		await expect(getCurrentUserFromRequest(request({
			authorization: 'Bearer token-invalido',
		}))).resolves.toBeNull();
	});

	it('retorna nulo quando o usuário do cookie foi removido', async () => {
		prismaMock.user.findUnique.mockResolvedValueOnce(null);
		const token = await sessionToken(user.id);

		await expect(getCurrentUserFromRequest(request({
			cookie: `next-auth.session-token=${token}`,
		}))).resolves.toBeNull();
	});

	it('resolve a sessão pelo cookie normal do app', async () => {
		const token = await sessionToken(user.id);

		await expect(getCurrentUserFromRequest(request({
			cookie: `next-auth.session-token=${token}`,
		}))).resolves.toEqual(user);
	});

	it('prioriza o cookie quando existe Bearer de outro usuário', async () => {
		const cookieToken = await sessionToken(user.id);
		const bearerToken = await sessionToken(otherUser.id);

		await expect(getCurrentUserFromRequest(request({
			cookie: `next-auth.session-token=${cookieToken}`,
			authorization: `Bearer ${bearerToken}`,
		}))).resolves.toEqual(user);
	});
});
