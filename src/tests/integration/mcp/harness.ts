const MCP_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/mcp`;
const MODERN_PROTOCOL_VERSION = '2026-07-28';
const LEGACY_PROTOCOL_VERSION = '2025-11-25';
const CLIENT_INFO = { name: 'jd-mcp-integration', version: '1.0.0' };
const MCP_NAME_PARAM_FIELDS: Record<string, string> = {
	'tools/call': 'name',
	'prompts/get': 'name',
	'resources/read': 'uri',
};

export type McpMode = 'modern' | 'legacy';
type McpHandler = (request: Request) => Promise<Response>;
type McpParams = Record<string, unknown>;

export type McpHttpResponse = {
	status: number;
	headers: Headers;
	payload: unknown;
};

function addAuthorization(headers: Headers, token?: string) {
	if (token) headers.set('authorization', `Bearer ${token}`);
}

function createHeaders(token?: string) {
	const headers = new Headers({ accept: 'application/json, text/event-stream', 'content-type': 'application/json' });
	addAuthorization(headers, token);

	return headers;
}

function mcpNameFor(method: string, params: McpParams) {
	const field = MCP_NAME_PARAM_FIELDS[method];
	if (!field) return undefined;
	const value = params[field];

	return typeof value === 'string' ? value : undefined;
}

function modernRequestParams(params: McpParams) {
	return {
		...params,
		_meta: {
			'io.modelcontextprotocol/clientCapabilities': {},
			'io.modelcontextprotocol/clientInfo': CLIENT_INFO,
			'io.modelcontextprotocol/protocolVersion': MODERN_PROTOCOL_VERSION,
		},
	};
}

function legacyRequestParams(method: string, params: McpParams) {
	if (method === 'initialize') return { protocolVersion: LEGACY_PROTOCOL_VERSION, capabilities: {}, clientInfo: CLIENT_INFO };

	return params;
}

function parseSsePayload(body: string) {
	const events = body.split(/\r?\n\r?\n/u);
	const data = events.map((event) => event.split(/\r?\n/u)
		.filter((line) => line.startsWith('data:'))
		.map((line) => line.slice('data:'.length).trimStart())
		.join('\n'))
		.filter(Boolean);
	const payload = data.at(-1);

	return payload ? JSON.parse(payload) : undefined;
}

async function parseMcpPayload(response: Response) {
	const body = await response.text();
	if (!body) return undefined;
	if (response.headers.get('content-type')?.includes('text/event-stream')) return parseSsePayload(body);

	return JSON.parse(body);
}

async function sendMcpRequest(handler: McpHandler, request: Request): Promise<McpHttpResponse> {
	const response = await handler(request);

	return { status: response.status, headers: response.headers, payload: await parseMcpPayload(response) };
}

function createRequest(token: string | undefined, mode: McpMode, method: string, params: McpParams) {
	const headers = createHeaders(token);
	if (mode === 'modern') {
		headers.set('mcp-method', method);
		headers.set('mcp-protocol-version', MODERN_PROTOCOL_VERSION);
		const name = mcpNameFor(method, params);
		if (name) headers.set('mcp-name', name);
	}

	return new Request(MCP_ENDPOINT, {
		method: 'POST',
		headers,
		body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: mode === 'modern' ? modernRequestParams(params) : legacyRequestParams(method, params) }),
	});
}

export async function invokeMcpRequest(handler: McpHandler, token: string | undefined, mode: McpMode, method: string, params: McpParams) {
	return sendMcpRequest(handler, createRequest(token, mode, method, params));
}

export async function invokeModernMcpRequest(handler: McpHandler, token: string | undefined, method: string, params: McpParams) {
	return invokeMcpRequest(handler, token, 'modern', method, params);
}

export async function invokeLegacyMcpRequest(handler: McpHandler, token: string | undefined, method: string, params: McpParams) {
	return invokeMcpRequest(handler, token, 'legacy', method, params);
}

export async function discoverModernMcp(handler: McpHandler, token?: string) {
	return invokeModernMcpRequest(handler, token, 'server/discover', {});
}

export async function invokeMcpTool(handler: McpHandler, token: string | undefined, mode: McpMode, name: string, arguments_: McpParams) {
	return invokeMcpRequest(handler, token, mode, 'tools/call', { name, arguments: arguments_ });
}
