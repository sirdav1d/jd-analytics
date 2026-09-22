import { beforeEach, describe, expect, it, vi } from 'vitest';
import { matchesRegisteredRedirectUri, registerPublicClient, resolveOAuthClient } from '@/mcp/oauth/clients';

const mocks = vi.hoisted(() => ({
	create: vi.fn(),
	findUnique: vi.fn(),
	fetchCimdMetadata: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({ prisma: { mcpOAuthClient: { create: mocks.create, findUnique: mocks.findUnique } } }));
vi.mock('@/mcp/oauth/cimd', () => ({ fetchCimdMetadata: mocks.fetchCimdMetadata }));

describe('clientes OAuth do MCP', () => {
	beforeEach(() => {
		mocks.create.mockReset();
		mocks.findUnique.mockReset().mockResolvedValue(null);
		mocks.fetchCimdMetadata.mockReset();
	});

	it.each([
		['https://client.example/cb', 'https://client.example/cb', true],
		['https://client.example/cb', 'https://client.example:443/cb', false],
		['https://client.example/cb', 'https://client.example/a/../cb', false],
		['http://127.0.0.1/cb', 'http://127.0.0.1:43127/cb', true],
		['http://localhost/cb', 'http://127.0.0.1:43127/cb', false],
		['http://[::1]/cb?x=1', 'http://[::1]:43127/cb?x=2', false],
		['http://client.example/cb', 'http://client.example/cb', false],
	])('compara %s com %s', (registered, requested, expected) => {
		expect(matchesRegisteredRedirectUri(registered, requested)).toBe(expected);
	});

	it('registra cliente público com defaults e sem segredo', async () => {
		mocks.create.mockResolvedValue({
			clientId: 'mcp_client',
			clientName: 'Agente local',
			redirectUris: ['http://127.0.0.1/callback'],
			grantTypes: ['authorization_code'],
			createdAt: new Date('2026-01-01T00:00:00Z'),
		});

		const result = await registerPublicClient({
			client_name: 'Agente local',
			redirect_uris: ['http://127.0.0.1/callback'],
			token_endpoint_auth_method: 'none',
			response_types: ['code'],
		});

		expect(result).toMatchObject({
			grant_types: ['authorization_code'],
			response_types: ['code'],
			token_endpoint_auth_method: 'none',
		});
		expect(result.client_id).toMatch(/^mcp_[A-Za-z0-9_-]{43}$/u);
		expect(result).not.toHaveProperty('client_secret');
	});

	it('exige autenticação pública explícita', async () => {
		await expect(registerPublicClient({
			client_name: 'Agente local',
			redirect_uris: ['http://127.0.0.1/callback'],
		})).rejects.toMatchObject({ code: 'invalid_client_metadata' });
	});

	it('exige client_id igual no documento CIMD e identifica sua origem', async () => {
		const clientId = 'https://agent.example/.well-known/oauth-client';
		mocks.fetchCimdMetadata.mockResolvedValue({
			metadata: {
				client_name: 'Agente remoto',
				redirect_uris: ['https://agent.example/callback'],
				token_endpoint_auth_method: 'none',
			},
			cacheTtlSeconds: 60,
		});

		await expect(resolveOAuthClient(clientId)).rejects.toMatchObject({ code: 'invalid_client_metadata' });

		const secondClientId = `${clientId}/v2`;
		mocks.fetchCimdMetadata.mockResolvedValue({
			metadata: {
				client_id: secondClientId,
				client_name: 'Agente remoto',
				redirect_uris: ['https://agent.example/callback'],
				token_endpoint_auth_method: 'none',
			},
			cacheTtlSeconds: 60,
		});

		const client = await resolveOAuthClient(secondClientId);
		expect(client).toMatchObject({ registrationSource: 'cimd', clientOrigin: 'https://agent.example' });
	});
});
