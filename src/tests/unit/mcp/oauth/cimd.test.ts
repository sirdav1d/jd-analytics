import { EventEmitter } from 'node:events';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchCimdMetadata, isCimdPublicAddress } from '@/mcp/oauth/cimd';

const mocks = vi.hoisted(() => ({
	lookup: vi.fn(),
	request: vi.fn(),
}));

vi.mock('node:dns/promises', () => ({ lookup: mocks.lookup }));
vi.mock('node:https', () => ({ request: mocks.request }));

type FakeRequest = EventEmitter & { end: () => void; destroy: (error?: Error) => void };
type FakeResponse = EventEmitter & { statusCode: number; headers: Record<string, string>; resume: () => void };

function installResponse(statusCode: number, headers: Record<string, string>, body: string) {
	mocks.request.mockImplementation((_options: unknown, callback: (response: FakeResponse) => void) => {
		const request = new EventEmitter() as FakeRequest;
		request.end = () => {
			const response = new EventEmitter() as FakeResponse;
			response.statusCode = statusCode;
			response.headers = headers;
			response.resume = vi.fn();
			callback(response);
			response.emit('data', Buffer.from(body));
			response.emit('end');
			request.emit('close');
		};
		request.destroy = (error?: Error) => {
			if (error) request.emit('error', error);
		};
		return request;
	});
}

const validMetadata = JSON.stringify({ client_id: 'https://agent.example/.well-known/oauth-client', client_name: 'Agente', redirect_uris: ['https://agent.example/callback'], token_endpoint_auth_method: 'none' });

describe('Client ID Metadata Document do MCP', () => {
	beforeEach(() => {
		mocks.lookup.mockReset();
		mocks.request.mockReset();
	});

	it.each([
		'http://client.example/metadata.json',
		'https://client.example/%2e%2e/private',
		'https://user:pass@client.example/metadata.json',
		'https://client.example/metadata.json#fragment',
	])('rejeita URL de CIMD insegura: %s', async (clientId) => {
		await expect(fetchCimdMetadata(clientId)).rejects.toMatchObject({ code: 'invalid_client' });
	});

	it.each([
		['127.0.0.1', false],
		['10.0.0.1', false],
		['192.0.2.1', false],
		['::1', false],
		['::ffff:127.0.0.1', false],
		['2001:db8::1', false],
		['2606:4700:4700::1111', true],
	])('classifica destino %s como público=%s', (address, expected) => {
		expect(isCimdPublicAddress(address)).toBe(expected);
	});

	it('fixa o endereço validado e respeita lookup all do Node', async () => {
		mocks.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
		installResponse(200, { 'content-type': 'application/json', 'cache-control': 'max-age=120', age: '0' }, validMetadata);

		const result = await fetchCimdMetadata('https://agent.example/.well-known/oauth-client');
		const requestOptions = mocks.request.mock.calls[0][0] as Parameters<typeof mocks.request>[0];
		const lookupCallback = requestOptions.lookup as unknown as (hostname: string, options: { all: boolean }, callback: (error: null, addresses: Array<{ address: string; family: number }>) => void) => void;
		const callback = vi.fn();
		lookupCallback('agent.example', { all: true }, callback);

		expect(callback).toHaveBeenCalledWith(null, [{ address: '93.184.216.34', family: 4 }]);
		expect(result.cacheTtlSeconds).toBeGreaterThan(0);
	});

	it('rejeita DNS que mistura endereço público e privado', async () => {
		mocks.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }, { address: '127.0.0.1', family: 4 }]);

		await expect(fetchCimdMetadata('https://agent.example/.well-known/oauth-client')).rejects.toMatchObject({ code: 'invalid_client' });
		expect(mocks.request).not.toHaveBeenCalled();
	});

	it('converte timeout de DNS em cliente indisponível', async () => {
		vi.useFakeTimers();
		mocks.lookup.mockImplementation(() => new Promise(() => undefined));

		try {
			const assertion = expect(fetchCimdMetadata('https://agent.example/.well-known/oauth-client')).rejects.toMatchObject({ code: 'invalid_client' });
			await vi.advanceTimersByTimeAsync(3_001);
			await assertion;
		} finally {
			vi.useRealTimers();
		}
	});

	it('converte timeout de leitura em cliente indisponível', async () => {
		vi.useFakeTimers();
		mocks.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
		mocks.request.mockImplementation((_options: unknown, callback: (response: FakeResponse) => void) => {
			const request = new EventEmitter() as FakeRequest;
			request.end = () => {
				const response = new EventEmitter() as FakeResponse;
				response.statusCode = 200;
				response.headers = { 'content-type': 'application/json' };
				response.resume = vi.fn();
				callback(response);
			};
			request.destroy = (error?: Error) => {
				if (error) request.emit('error', error);
			};
			return request;
		});

		try {
			const assertion = expect(fetchCimdMetadata('https://agent.example/.well-known/oauth-client')).rejects.toMatchObject({ code: 'invalid_client' });
			await vi.advanceTimersByTimeAsync(3_001);
			await assertion;
		} finally {
			vi.useRealTimers();
		}
	});

	it('rejeita redirect e documento acima do limite', async () => {
		mocks.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
		installResponse(302, { 'content-type': 'application/json' }, validMetadata);

		await expect(fetchCimdMetadata('https://agent.example/.well-known/oauth-client')).rejects.toMatchObject({ code: 'invalid_client' });

		mocks.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
		installResponse(200, { 'content-type': 'application/json' }, 'x'.repeat(64 * 1_024 + 1));

		await expect(fetchCimdMetadata('https://agent.example/.well-known/oauth-client')).rejects.toMatchObject({ code: 'invalid_client' });
	});

	it('não reutiliza documento marcado como no-store', async () => {
		mocks.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
		installResponse(200, { 'content-type': 'application/json', 'cache-control': 'no-store', age: '0' }, validMetadata);

		const result = await fetchCimdMetadata('https://agent.example/.well-known/oauth-client');
		expect(result.cacheTtlSeconds).toBe(0);
	});

	it('desconta Age do freshness do documento', async () => {
		mocks.lookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
		installResponse(200, { 'content-type': 'application/json', 'cache-control': 'max-age=120', age: '60' }, validMetadata);

		const result = await fetchCimdMetadata('https://agent.example/.well-known/oauth-client');
		expect(result.cacheTtlSeconds).toBeGreaterThan(50);
		expect(result.cacheTtlSeconds).toBeLessThanOrEqual(60);
	});
});
