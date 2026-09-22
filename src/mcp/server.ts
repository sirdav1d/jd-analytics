import { createMcpHandler } from 'mcp-handler';
import { AuthorizationError } from '@/lib/authorization';
import { authenticateMcpRequest } from '@/mcp/auth/session';
import { registerCommercialTools } from '@/mcp/commercial/register-tools';
import { registerGoalTools } from '@/mcp/goals/register-tools';
import { registerMarketingTools } from '@/mcp/marketing/register-tools';
import { getMcpPublicUrl, McpTransportError, assertMcpRequestOrigin, validateMcpTransport } from '@/mcp/core/transport-security';

function noStore() {
	return { 'cache-control': 'no-store', pragma: 'no-cache', 'content-type': 'application/json; charset=utf-8' };
}

function resourceMetadataUrl(request: Request) {
	return new URL('/.well-known/oauth-protected-resource/api/mcp', getMcpPublicUrl(request)).toString();
}

function authErrorResponse(error: AuthorizationError, request: Request) {
	const insufficientScope = error.message === 'Escopo MCP insuficiente';
	const challenge = `Bearer resource_metadata="${resourceMetadataUrl(request)}"${insufficientScope ? ', error="insufficient_scope", scope="mcp:read"' : ', scope="mcp:read"'}`;

	return new Response(JSON.stringify({ error: insufficientScope ? 'insufficient_scope' : 'invalid_token' }), {
		status: error.status,
		headers: { ...noStore(), 'www-authenticate': challenge },
	});
}

export function createTransportErrorResponse(error: McpTransportError) {
	const headers: Record<string, string> = noStore();
	if (error.status === 405) headers.allow = 'POST, OPTIONS';

	return new Response(JSON.stringify({ error: error.status === 405 ? 'method_not_allowed' : 'invalid_request' }), {
		status: error.status,
		headers,
	});
}

function internalErrorResponse() {
	return new Response(JSON.stringify({ error: 'server_error', error_description: 'Erro interno.' }), { status: 500, headers: noStore() });
}

export function createJdMcpHandler() {
	const protocolHandler = createMcpHandler((server) => {
		registerCommercialTools(server);
		registerGoalTools(server);
		registerMarketingTools(server);
	}, {
		serverInfo: { name: 'jd-analytics', version: '0.2.0' },
	});

	return async (request: Request) => {
		try {
			assertMcpRequestOrigin(request);
			const authenticated = await authenticateMcpRequest(request);
			const secureRequest = await validateMcpTransport(request);
			const requestWithAuth = Object.assign(secureRequest, { auth: authenticated.authInfo });

			return protocolHandler(requestWithAuth);
		} catch (error) {
			if (error instanceof AuthorizationError) return authErrorResponse(error, request);
			if (error instanceof McpTransportError) return createTransportErrorResponse(error);

			return internalErrorResponse();
		}
	};
}
