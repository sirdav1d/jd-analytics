import type { AuthInfo, McpServer } from '@modelcontextprotocol/server';
import type { z } from 'zod';
import type { CurrentUser } from '@/lib/auth';
import { readMcpUser } from '@/mcp/auth/session';
import { McpPublicError } from '@/mcp/core/errors';
import { createToolFailure } from '@/mcp/core/response';
import { executeMcpTool } from '@/mcp/core/request-lifecycle';
import { createToolOutputSchema } from '@/mcp/core/contracts';

type ToolOptions<I, O> = {
	name: string;
	title: string;
	description: string;
	inputSchema: z.ZodType<I>;
	outputSchema: z.ZodType<O>;
	openWorld?: boolean;
	execute: (input: I, user: CurrentUser) => Promise<O>;
};

function responseBytes(value: unknown) {
	return Buffer.byteLength(JSON.stringify(value), 'utf8');
}

export function registerJdTool<I, O>(server: McpServer, options: ToolOptions<I, O>) {
	server.registerTool(options.name, {
		title: options.title,
		description: options.description,
		inputSchema: options.inputSchema,
		outputSchema: createToolOutputSchema(options.outputSchema),
		annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: options.openWorld === true },
	}, async (input, context) => {
		const authInfo = context.http?.authInfo as AuthInfo | undefined;

		if (!authInfo) throw new McpPublicError('UNAUTHENTICATED');

		const user = readMcpUser(authInfo);
		const structuredContent = await executeMcpTool({ input, user, executor: options.execute });
		const summary = structuredContent.ok ? `${options.title} consultado.` : structuredContent.error.message;
		const result = { content: [{ type: 'text' as const, text: summary }], structuredContent };

		if (responseBytes(result) <= 1_000_000) return result;

		const failure = createToolFailure(structuredContent.requestId, new McpPublicError('INVALID_ARGUMENT'));

		return { content: [{ type: 'text' as const, text: failure.error.message }], structuredContent: failure };
	});
}
