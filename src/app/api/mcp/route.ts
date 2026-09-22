import { createJdMcpHandler, createTransportErrorResponse } from '@/mcp/server';
import { assertMcpRequestOrigin, getMcpPublicUrl, McpTransportError } from '@/mcp/core/transport-security';

const handler = createJdMcpHandler();

export function GET(request: Request) {
	return handler(request);
}

export function POST(request: Request) {
	return handler(request);
}

export function DELETE(request: Request) {
	return handler(request);
}

export function OPTIONS(request: Request) {
	try {
		assertMcpRequestOrigin(request);
		const publicUrl = getMcpPublicUrl(request);

		return new Response(null, {
			status: 204,
			headers: {
				'access-control-allow-origin': publicUrl.origin,
				'access-control-allow-methods': 'POST, OPTIONS',
				'access-control-allow-headers': 'authorization, content-type, mcp-method, mcp-name, mcp-protocol-version',
				vary: 'Origin',
			},
		});
	} catch (error) {
		if (error instanceof McpTransportError) return createTransportErrorResponse(error);

		throw error;
	}
}
