import type { McpErrorCode } from '@/mcp/core/errors';

export type JdSuccess<T> = {
	ok: true;
	requestId: string;
	data: T;
	meta: {
		timezone: 'America/Sao_Paulo';
		currency: 'BRL';
		rowCount: number;
	};
};

export type JdFailure = {
	ok: false;
	requestId: string;
	data: null;
	meta: { timezone: 'America/Sao_Paulo'; currency: 'BRL'; rowCount: 0 };
	error: { code: McpErrorCode; message: string };
};

export function createToolSuccess<T>(requestId: string, data: T, rowCount = 1): JdSuccess<T> {
	return {
		ok: true,
		requestId,
		data,
		meta: { timezone: 'America/Sao_Paulo', currency: 'BRL', rowCount },
	};
}

export function createToolFailure(requestId: string, error: import('@/mcp/core/errors').McpPublicError): JdFailure {
	return {
		ok: false,
		requestId,
		data: null,
		meta: { timezone: 'America/Sao_Paulo', currency: 'BRL', rowCount: 0 },
		error: { code: error.code, message: error.message },
	};
}
