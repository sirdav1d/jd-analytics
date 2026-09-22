import { McpPublicError } from '@/mcp/core/errors';

const MAX_BODY_BYTES = 256 * 1_024;

export class McpTransportError extends Error {
	readonly status: 400 | 403 | 405 | 413;

	constructor(status: 400 | 403 | 405 | 413, message = 'Requisição MCP inválida.') {
		super(message);
		this.name = 'McpTransportError';
		this.status = status;
	}
}

export class McpConfigurationError extends Error {
	constructor(message = 'Configuração MCP inválida.') {
		super(message);
		this.name = 'McpConfigurationError';
	}
}

function isLoopbackHostname(hostname: string) {
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]';
}

function configuredPublicUrl(allowLoopback: boolean) {
	const value = process.env.NEXTAUTH_URL;
	if (!value) throw new McpConfigurationError('Origem pública não configurada.');

	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new McpConfigurationError('Origem pública inválida.');
	}

	if (url.username || url.password || url.search || url.hash || (url.pathname !== '' && url.pathname !== '/')) {
		throw new McpConfigurationError('Origem pública inválida.');
	}
	if (url.protocol === 'https:') return url;
	if (url.protocol === 'http:' && (allowLoopback || process.env.NODE_ENV !== 'production') && isLoopbackHostname(url.hostname)) return url;

	throw new McpConfigurationError('Origem pública inválida.');
}

export function getMcpPublicUrl(requestOrAllowLoopback: Request | boolean = false) {
	const allowLoopback = typeof requestOrAllowLoopback === 'boolean'
		? requestOrAllowLoopback
		: process.env.NODE_ENV !== 'production';

	return configuredPublicUrl(allowLoopback);
}

function singleHeader(request: Request, name: string) {
	const value = request.headers.get(name);
	if (!value) return undefined;
	if (value.includes(',')) throw new McpTransportError(403, 'Cabeçalho encaminhado ambíguo.');

	return value.trim();
}

function forwardedOrigin(request: Request) {
	const xForwardedHost = singleHeader(request, 'x-forwarded-host');
	const xForwardedProto = singleHeader(request, 'x-forwarded-proto');
	const forwarded = singleHeader(request, 'forwarded');
	const xForwardedOrigin = xForwardedHost || xForwardedProto
		? forwardedPairOrigin(xForwardedHost, xForwardedProto)
		: undefined;
	const forwardedValues = forwarded ? parseForwarded(forwarded) : undefined;
	const standardForwardedOrigin = forwardedValues
		? forwardedPairOrigin(forwardedValues.get('host'), forwardedValues.get('proto'))
		: undefined;

	if (xForwardedOrigin && standardForwardedOrigin && xForwardedOrigin !== standardForwardedOrigin) {
		throw new McpTransportError(403, 'Cabeçalhos encaminhados conflitantes.');
	}

	return xForwardedOrigin ?? standardForwardedOrigin;
}

function forwardedPairOrigin(host: string | undefined, proto: string | undefined) {
	if (!host || !proto) throw new McpTransportError(403, 'Cabeçalho encaminhado incompleto.');

	return `${proto}://${host}`;
}

function parseForwarded(value: string) {
	const values = new Map<string, string>();
	for (const part of value.split(';')) {
		const separator = part.indexOf('=');
		if (separator <= 0 || separator === part.length - 1) throw new McpTransportError(403, 'Cabeçalho encaminhado inválido.');
		const key = part.slice(0, separator).trim().toLowerCase();
		const parsedValue = part.slice(separator + 1).trim().replace(/^"|"$/gu, '');
		if (!key || !parsedValue) throw new McpTransportError(403, 'Cabeçalho encaminhado inválido.');
		if (key !== 'host' && key !== 'proto') continue;
		if (values.has(key)) throw new McpTransportError(403, 'Cabeçalho encaminhado ambíguo.');
		values.set(key, parsedValue);
	}

	return values;
}

export function assertMcpRequestOrigin(request: Request) {
	const publicUrl = getMcpPublicUrl(request);
	const forwarded = forwardedOrigin(request);
	const requestOrigin = new URL(request.url).origin;
	const host = singleHeader(request, 'host') ?? new URL(request.url).host;
	const effectiveOrigin = forwarded ?? requestOrigin;

	if (effectiveOrigin !== publicUrl.origin) throw new McpTransportError(403, 'Origem MCP não autorizada.');
	if (!forwarded && host !== publicUrl.host) throw new McpTransportError(403, 'Host MCP não autorizado.');
	if (forwarded && host.includes(',')) throw new McpTransportError(403, 'Host MCP ambíguo.');

	const origin = request.headers.get('origin');
	if (origin === 'null' || (origin && origin !== publicUrl.origin)) throw new McpTransportError(403, 'Origin MCP não autorizado.');
}

export async function readBoundedBody(request: Request, maxBytes = MAX_BODY_BYTES) {
	const contentLength = request.headers.get('content-length');
	if (contentLength && (!/^\d+$/u.test(contentLength) || Number(contentLength) > maxBytes)) throw new McpTransportError(413, 'Corpo MCP excedeu o limite.');
	if (!request.body) return new Uint8Array();

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let size = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > maxBytes) {
				await reader.cancel();
				throw new McpTransportError(413, 'Corpo MCP excedeu o limite.');
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}

	const body = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}

	return body;
}

function withBoundedBody(request: Request, body: Uint8Array) {
	return new Request(request.url, {
		method: request.method,
		headers: request.headers,
		body: new TextDecoder().decode(body),
		signal: request.signal,
	});
}

export async function validateMcpTransport(request: Request, options: { allowLoopback?: boolean } = {}) {
	void options;
	assertMcpRequestOrigin(request);
	if (request.method !== 'POST') throw new McpTransportError(405, 'Método MCP não permitido.');

	const body = await readBoundedBody(request);
	return withBoundedBody(request, body);
}

export function toTransportPublicError(error: unknown) {
	if (error instanceof McpTransportError) return new McpPublicError('INVALID_ARGUMENT');

	return new McpPublicError('INTERNAL_ERROR');
}
