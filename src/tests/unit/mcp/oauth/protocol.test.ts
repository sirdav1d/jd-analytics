import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	getOAuthMetadata,
	getResourceMetadata,
	oauthErrorResponse,
	readOAuthBody,
} from '@/mcp/oauth/protocol';
import { assertMcpRequestOrigin, McpConfigurationError } from '@/mcp/core/transport-security';

afterEach(() => vi.unstubAllEnvs());

describe('protocolo OAuth do MCP', () => {
	it('mantém emissor canônico e publica os endpoints', () => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');

		expect(getResourceMetadata()).toMatchObject({
			resource: 'https://jd.example.com/api/mcp',
			authorization_servers: ['https://jd.example.com'],
			 scopes_supported: ['mcp:read'],
			bearer_methods_supported: ['header'],
		});
		expect(getOAuthMetadata()).toMatchObject({
			issuer: 'https://jd.example.com',
			authorization_endpoint: 'https://jd.example.com/mcp/authorize',
			token_endpoint: 'https://jd.example.com/api/mcp/oauth/token',
			registration_endpoint: 'https://jd.example.com/api/mcp/oauth/register',
			revocation_endpoint: 'https://jd.example.com/api/mcp/oauth/revoke',
			revocation_endpoint_auth_methods_supported: ['none'],
			code_challenge_methods_supported: ['S256'],
			client_id_metadata_document_supported: true,
			authorization_response_iss_parameter_supported: true,
			response_types_supported: ['code'],
			grant_types_supported: ['authorization_code', 'refresh_token'],
		});
	});

	it('rejeita origem pública ausente, inválida ou HTTP remoto', () => {
		for (const value of ['', 'not a url', 'http://jd.example.com']) {
			vi.stubEnv('NEXTAUTH_URL', value);
			expect(() => getOAuthMetadata()).toThrow();
			vi.unstubAllEnvs();
		}
	});

	it('separa configuração ausente de origem não autorizada', () => {
		vi.stubEnv('NEXTAUTH_URL', '');

		expect(() => assertMcpRequestOrigin(new Request('https://jd.example.com/api/mcp'))).toThrow(McpConfigurationError);
	});

	it('aceita HTTP somente para loopback em desenvolvimento', () => {
		vi.stubEnv('NODE_ENV', 'development');
		vi.stubEnv('NEXTAUTH_URL', 'http://localhost:3000');

		expect(getOAuthMetadata().issuer).toBe('http://localhost:3000');
	});

	it('não deixa URL, Host ou forwarding forjados escolherem o issuer', () => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');

		expect(() => assertMcpRequestOrigin(new Request('https://attacker.example/api/mcp'))).toThrow();
		expect(() => assertMcpRequestOrigin(new Request('https://jd.example.com/api/mcp', { headers: { origin: 'null' } }))).toThrow();
		expect(() => assertMcpRequestOrigin(new Request('http://internal/api/mcp', { headers: { host: 'internal', 'x-forwarded-host': 'jd.example.com,evil.example', 'x-forwarded-proto': 'https' } }))).toThrow();

		expect(() => assertMcpRequestOrigin(new Request('http://internal/api/mcp', { headers: { host: 'internal', 'x-forwarded-host': 'jd.example.com', 'x-forwarded-proto': 'https', origin: 'https://jd.example.com' } }))).not.toThrow();
		expect(() => assertMcpRequestOrigin(new Request('http://internal/api/mcp', { headers: { host: 'internal', forwarded: 'host=evil.example;host=jd.example.com;proto=https' } }))).toThrow();
	});

	it('aceita cabeçalhos de proxy concordantes enviados em ambos os formatos', () => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');
		const request = new Request('http://internal/api/mcp', {
			headers: {
				host: 'internal',
				'x-forwarded-host': 'jd.example.com',
				'x-forwarded-proto': 'https',
				forwarded: 'host=jd.example.com;proto=https',
			},
		});

		expect(() => assertMcpRequestOrigin(request)).not.toThrow();
	});

	it('sanitiza erros OAuth e não expõe detalhes internos', async () => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');

		const response = oauthErrorResponse(new Error('segredo interno'));
		const body = await response.json();

		expect(response.status).toBe(500);
		expect(body).toEqual({ error: 'server_error', error_description: 'Erro interno.' });
		expect(response.headers.get('cache-control')).toBe('no-store');
	});

	it('preserva duplicatas no formulário e rejeita JSON inválido', async () => {
		const form = new Request('https://jd.example.com/api/mcp/oauth/token', {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: 'scope=mcp%3Aread&scope=other',
		});
		const params = await readOAuthBody(form, 'form');

		expect(params).toBeInstanceOf(URLSearchParams);
		expect((params as URLSearchParams).getAll('scope')).toEqual(['mcp:read', 'other']);

		const invalid = new Request('https://jd.example.com/api/mcp/oauth/token', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: '{',
		});

		await expect(readOAuthBody(invalid, 'json')).rejects.toMatchObject({ code: 'invalid_request' });
	});
});
