import { describe, expect, it } from 'vitest';
import { AuthorizationError } from '@/lib/authorization';
import type { CurrentUser } from '@/lib/auth';
import { createMcpAuthInfo, readMcpUser } from '@/mcp/auth/session';

const user: CurrentUser = {
	id: '10000000-0000-4000-8000-000000000001',
	name: 'Usuário atual',
	email: 'atual@jd.test',
	externalId: '10',
	role: 'ADMIN',
	isActive: true,
};

describe('adaptador de sessão MCP', () => {
	it('carrega o usuário já resolvido no contexto interno do SDK', () => {
		const authInfo = createMcpAuthInfo({
			token: 'oauth-token',
			claims: {
				userId: user.id,
				clientId: 'client-1',
				resource: 'https://jd.example.com/api/mcp',
				scope: 'mcp:read',
				expiresAt: Math.floor(Date.now() / 1_000) + 300,
			},
			user,
		});

		expect(readMcpUser(authInfo)).toEqual(user);
	});

	it('recusa contexto MCP sem usuário confiável', () => {
		expect(() => readMcpUser({
			token: 'oauth-token',
			clientId: 'client-1',
			scopes: [],
			extra: {},
		})).toThrow(AuthorizationError);
	});
});
