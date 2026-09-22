import { assertMcpRequestOrigin, getMcpPublicUrl, McpTransportError, readBoundedBody } from '@/mcp/core/transport-security';

export type OAuthErrorCode =
	| 'invalid_request'
	| 'invalid_client'
	| 'invalid_client_metadata'
	| 'invalid_redirect_uri'
	| 'invalid_grant'
	| 'invalid_scope'
	| 'invalid_target'
	| 'unauthorized_client'
	| 'unsupported_response_type'
	| 'unsupported_grant_type'
	| 'unsupported_token_type'
	| 'access_denied';

export class OAuthError extends Error {
	readonly code: OAuthErrorCode | 'server_error';
	readonly status: number;
	readonly retryAfter?: number;

	constructor(code: OAuthErrorCode | 'server_error', status = 400, message?: string, retryAfter?: number) {
		super(message ?? code);
		this.name = 'OAuthError';
		this.code = code;
		this.status = status;
		this.retryAfter = retryAfter;
	}
}

const OAUTH_SCOPE = 'mcp:read';
const MAX_JSON_BYTES = 32 * 1_024;
const MAX_FORM_BYTES = 8 * 1_024;
const admissionBuckets = new Map<'register' | 'cimd' | 'token', { minute: number; count: number }>([
	['register', { minute: 0, count: 0 }],
	['cimd', { minute: 0, count: 0 }],
	['token', { minute: 0, count: 0 }],
]);
const admissionLimits = { register: 30, cimd: 60, token: 120 } as const;

function canonicalOrigin() {
	return getMcpPublicUrl(false).origin;
}

export function getOAuthMetadata() {
	const issuer = canonicalOrigin();

	return {
		issuer,
		authorization_endpoint: `${issuer}/mcp/authorize`,
		token_endpoint: `${issuer}/api/mcp/oauth/token`,
		registration_endpoint: `${issuer}/api/mcp/oauth/register`,
		revocation_endpoint: `${issuer}/api/mcp/oauth/revoke`,
		response_types_supported: ['code'],
		grant_types_supported: ['authorization_code', 'refresh_token'],
		token_endpoint_auth_methods_supported: ['none'],
		revocation_endpoint_auth_methods_supported: ['none'],
		code_challenge_methods_supported: ['S256'],
		scopes_supported: [OAUTH_SCOPE],
		client_id_metadata_document_supported: true,
		authorization_response_iss_parameter_supported: true,
	};
}

export function getResourceMetadata() {
	const issuer = canonicalOrigin();

	return {
		resource: `${issuer}/api/mcp`,
		authorization_servers: [issuer],
		scopes_supported: [OAUTH_SCOPE],
		bearer_methods_supported: ['header'],
	};
}

function noStoreHeaders() {
	return {
		'cache-control': 'no-store',
		pragma: 'no-cache',
	};
}

export function oauthJson(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			...noStoreHeaders(),
		},
	});
}

export function oauthErrorResponse(error: unknown) {
	if (error instanceof OAuthError) {
		const headers: Record<string, string> = {
			'content-type': 'application/json; charset=utf-8',
			...noStoreHeaders(),
		};
		if (error.retryAfter !== undefined) headers['retry-after'] = String(error.retryAfter);

		return new Response(JSON.stringify({ error: error.code, error_description: error.message }), {
			status: error.status,
			headers,
		});
	}

	return new Response(JSON.stringify({ error: 'server_error', error_description: 'Erro interno.' }), {
		status: 500,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			...noStoreHeaders(),
		},
	});
}

export async function readOAuthBody(request: Request, format: 'json' | 'form'): Promise<unknown> {
	const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
	const expected = format === 'json' ? 'application/json' : 'application/x-www-form-urlencoded';
	if (contentType !== expected) throw new OAuthError('invalid_request', 400, 'Content-Type inválido.');

	let bytes: Uint8Array;
	try {
		bytes = await readBoundedBody(request, format === 'json' ? MAX_JSON_BYTES : MAX_FORM_BYTES);
	} catch (error) {
		const status = typeof error === 'object' && error !== null && 'status' in error
			? Number((error as { status: unknown }).status)
			: 400;
		throw new OAuthError('invalid_request', status === 413 ? 413 : 400, 'Corpo inválido.');
	}

	let text: string;
	try {
		text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
	} catch {
		throw new OAuthError('invalid_request', 400, 'Corpo inválido.');
	}
	if (format === 'form') return new URLSearchParams(text);

	try {
		const parsed: unknown = JSON.parse(text);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('object required');
		return parsed;
	} catch {
		throw new OAuthError('invalid_request', 400, 'JSON inválido.');
	}
}

export function assertUniqueOAuthParams(params: URLSearchParams, names: readonly string[]) {
	for (const name of names) {
		if (params.getAll(name).length > 1) throw new OAuthError('invalid_request', 400, `Parâmetro duplicado: ${name}.`);
	}
}

export function assertOAuthAdmission(kind: 'register' | 'cimd' | 'token') {
	const now = Math.floor(Date.now() / 60_000);
	const bucket = admissionBuckets.get(kind);
	if (!bucket) throw new OAuthError('server_error', 500, 'Erro interno.');
	if (bucket.minute !== now) {
		bucket.minute = now;
		bucket.count = 0;
	}
	if (bucket.count >= admissionLimits[kind]) {
		throw new OAuthError('invalid_request', 429, 'Limite temporário excedido.', 60 - Math.floor((Date.now() % 60_000) / 1_000));
	}

	bucket.count += 1;
}

export function oauthScope() {
	return OAUTH_SCOPE;
}

export function publicMetadataHeaders() {
	return {
		'access-control-allow-origin': '*',
		'cache-control': 'public, max-age=60, stale-while-revalidate=60',
		'content-type': 'application/json; charset=utf-8',
	};
}

export function oauthMetadataResponse(body: unknown) {
	return new Response(JSON.stringify(body), { headers: publicMetadataHeaders() });
}

export function assertOAuthRequestOrigin(request: Request) {
	try {
		assertMcpRequestOrigin(request);
	} catch (error) {
		if (!(error instanceof McpTransportError)) throw error;
		throw new OAuthError('invalid_request', 403, 'Origem OAuth não autorizada.');
	}
}
