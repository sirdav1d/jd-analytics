import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AuthorizationError } from '@/lib/authorization';

export function serviceErrorResponse(error: unknown, label: string) {
	if (error instanceof AuthorizationError) {
		return NextResponse.json(
			{ error: error.message },
			{ status: error.status },
		);
	}

	if (error instanceof ZodError) {
		return NextResponse.json(
			{ ok: false, data: null, error: 'Parâmetros inválidos.' },
			{ status: 400 },
		);
	}

	console.error(label, error);

	return NextResponse.json(
		{ ok: false, data: null, error: 'Erro interno do servidor.' },
		{ status: 500 },
	);
}
