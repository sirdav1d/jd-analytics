import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	createOpaqueToken,
	createPkceChallenge,
	hashOpaqueToken,
	matchesPkceChallenge,
	OAuthConfigurationError,
	signMcpAccessToken,
	verifyMcpAccessToken,
} from '@/mcp/oauth/crypto';

afterEach(() => vi.unstubAllEnvs());

describe('primitivas criptográficas OAuth', () => {
	it('cria valores opacos e hashes separados por contexto', () => {
		const first = createOpaqueToken();
		const second = createOpaqueToken();

		expect(first).toMatch(/^[A-Za-z0-9_-]{43}$/u);
		expect(second).not.toBe(first);
		expect(hashOpaqueToken('code', first)).not.toBe(hashOpaqueToken('refresh', first));
	});

	it('valida PKCE S256 e rejeita verifier fora do perfil', () => {
		const verifier = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
		const challenge = createPkceChallenge(verifier);

		expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/u);
		expect(matchesPkceChallenge(verifier, challenge)).toBe(true);
		expect(matchesPkceChallenge(`${verifier}x`, challenge)).toBe(false);
		expect(() => createPkceChallenge('short')).toThrow();
	});

	it('assina e verifica access token com claims e emissor canônicos', async () => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');
		vi.stubEnv('MCP_OAUTH_SIGNING_SECRET', 'a'.repeat(64));

		const token = await signMcpAccessToken({
			userId: 'user-1',
			clientId: 'client-1',
			resource: 'https://jd.example.com/api/mcp',
			scope: 'mcp:read',
		});
		const claims = await verifyMcpAccessToken(token);

		expect(claims).toMatchObject({
			userId: 'user-1',
			clientId: 'client-1',
			resource: 'https://jd.example.com/api/mcp',
			scope: 'mcp:read',
		});
		expect(claims.expiresAt - Math.floor(Date.now() / 1000)).toBeLessThanOrEqual(300);
	});

	it('não usa segredo de sessão como segredo OAuth', async () => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');
		vi.stubEnv('NEXTAUTH_SECRET', 'a'.repeat(64));
		vi.stubEnv('MCP_OAUTH_SIGNING_SECRET', 'a'.repeat(64));

		await expect(signMcpAccessToken({
			userId: 'user-1',
			clientId: 'client-1',
			resource: 'https://jd.example.com/api/mcp',
			scope: 'mcp:read',
		})).rejects.toThrow();
	});

	it('classifica segredo ausente ou curto como indisponibilidade de configuração', async () => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');
		vi.stubEnv('MCP_OAUTH_SIGNING_SECRET', 'short');

		await expect(signMcpAccessToken({
			userId: 'user-1',
			clientId: 'client-1',
			resource: 'https://jd.example.com/api/mcp',
			scope: 'mcp:read',
		})).rejects.toBeInstanceOf(OAuthConfigurationError);
	});
});
