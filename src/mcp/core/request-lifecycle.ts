import { randomUUID } from 'node:crypto';
import { assertActiveUser, AuthorizationError } from '@/lib/authorization';
import type { CurrentUser } from '@/lib/auth';
import { McpPublicError, toPublicError } from '@/mcp/core/errors';
import { createToolFailure, createToolSuccess } from '@/mcp/core/response';

type ExecuteMcpToolArgs<I, O> = {
	input: I;
	user: CurrentUser;
	executor: (input: I, user: ExecuteMcpToolArgs<I, O>['user']) => Promise<O>;
	rowCount?: number;
};

export async function executeMcpTool<I, O>(args: ExecuteMcpToolArgs<I, O>) {
	const requestId = randomUUID();

	try {
		assertActiveUser(args.user);

		const data = await args.executor(args.input, args.user);

		return createToolSuccess(requestId, data, args.rowCount);
	} catch (error) {
		if (error instanceof AuthorizationError) {
			const code = error.status === 403 ? 'FORBIDDEN' : 'UNAUTHENTICATED';
			return createToolFailure(requestId, new McpPublicError(code));
		}

		return createToolFailure(requestId, toPublicError(error));
	}
}
