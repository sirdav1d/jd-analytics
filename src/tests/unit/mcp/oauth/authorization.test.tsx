import { beforeEach, describe, expect, it, vi } from 'vitest';
import { completeAuthorization, parseAuthorizationRequest } from '@/mcp/oauth/authorization';

const mocks = vi.hoisted(() => ({
	resolveOAuthClient: vi.fn(),
	getCurrentUser: vi.fn(),
	issueAuthorizationCode: vi.fn(),
	headers: vi.fn(),
}));

vi.mock('@/mcp/oauth/clients', () => ({ resolveOAuthClient: mocks.resolveOAuthClient, matchesRegisteredRedirectUri: (registered: string, requested: string) => registered === requested || (registered === 'http://127.0.0.1/callback' && requested.startsWith('http://127.0.0.1:')), }));
vi.mock('@/lib/auth', () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock('@/mcp/oauth/tokens', () => ({ issueAuthorizationCode: mocks.issueAuthorizationCode }));
vi.mock('next/headers', () => ({ headers: mocks.headers }));

const client = {
	clientId: 'mcp_client',
	clientName: 'Agente local',
	redirectUris: ['http://127.0.0.1/callback'],
	grantTypes: ['authorization_code', 'refresh_token'] as Array<'authorization_code' | 'refresh_token'>,
};

function validParams() {
	return new URLSearchParams({
		client_id: client.clientId,
		response_type: 'code',
		redirect_uri: 'http://127.0.0.1/callback',
		resource: 'https://jd.example.com/api/mcp',
		code_challenge: 'a'.repeat(43),
		code_challenge_method: 'S256',
		state: 'state-1',
	});
}

describe('autorização OAuth do MCP', () => {
	beforeEach(() => {
		vi.stubEnv('NEXTAUTH_URL', 'https://jd.example.com');
		mocks.resolveOAuthClient.mockResolvedValue(client);
		mocks.issueAuthorizationCode.mockResolvedValue('code-1');
		mocks.getCurrentUser.mockResolvedValue({ id: 'user-1', isActive: true, role: 'MANAGER' });
		mocks.headers.mockResolvedValue(new Headers({ origin: 'https://jd.example.com' }));
	});

	it('vincula o recurso MCP quando o cliente omite resource', async () => {
		const missingResource = validParams();
		missingResource.delete('resource');

		await expect(parseAuthorizationRequest(missingResource)).resolves.toMatchObject({
			resource: 'https://jd.example.com/api/mcp',
		});
	});

	it('exige PKCE S256 e parâmetros reconhecidos únicos', async () => {

		const plain = validParams();
		plain.set('code_challenge_method', 'plain');
		await expect(parseAuthorizationRequest(plain)).rejects.toMatchObject({ code: 'invalid_request' });

		const duplicate = validParams();
		duplicate.append('client_id', client.clientId);
		await expect(parseAuthorizationRequest(duplicate)).rejects.toMatchObject({ code: 'invalid_request' });
	});

	it('emite destino com código, state e iss após aprovação', async () => {
		const authorization = await parseAuthorizationRequest(validParams());
		const snapshot = { authorization, userId: 'user-1', expiresAt: Date.now() + 300_000 };
		const form = new FormData();
		form.set('decision', 'approve');

		const destination = await completeAuthorization(snapshot, form);

		expect(mocks.issueAuthorizationCode).toHaveBeenCalledWith(authorization, 'user-1');
		expect(destination).toContain('code=code-1');
		expect(destination).toContain('state=state-1');
		expect(destination).toContain('iss=https%3A%2F%2Fjd.example.com');
	});

	it('não emite código se a sessão mudou ou a ação expirou', async () => {
		const authorization = await parseAuthorizationRequest(validParams());
		const expired = { authorization, userId: 'user-1', expiresAt: Date.now() - 1 };
		const form = new FormData();
		form.set('decision', 'approve');

		await expect(completeAuthorization(expired, form)).rejects.toMatchObject({ code: 'access_denied' });
		mocks.getCurrentUser.mockResolvedValue({ id: 'other-user', isActive: true, role: 'MANAGER' });
		await expect(completeAuthorization({ authorization, userId: 'user-1', expiresAt: Date.now() + 300_000 }, form)).rejects.toMatchObject({ code: 'access_denied' });
		expect(mocks.issueAuthorizationCode).not.toHaveBeenCalled();
	});

	it('retorna access_denied sem escrever ao cancelar', async () => {
		const authorization = await parseAuthorizationRequest(validParams());
		const form = new FormData();
		form.set('decision', 'deny');

		const destination = await completeAuthorization({ authorization, userId: 'user-1', expiresAt: Date.now() + 300_000 }, form);

		expect(destination).toContain('error=access_denied');
		expect(mocks.issueAuthorizationCode).not.toHaveBeenCalled();
	});
});
