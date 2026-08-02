import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { AuthorizationError } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import { readMultipartCsv } from '@/utils/csv/process';
import { adaptOriginCsv } from '@/services/sales-import/csv-origin-adapter';
import { importOrigins } from '@/services/sales-import/import-origins';

const ORIGIN_UPLOAD_CACHE_TAGS = ['origin', 'origin-data'] as const;

export async function POST(req: NextRequest) {
	try {
		await requireAdmin();
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		return NextResponse.json({ error: 'Erro interno ao importar o CSV.' }, { status: 500 });
	}

	let updates;
	try {
		const csvText = await readMultipartCsv(req);
		updates = adaptOriginCsv(csvText);
	} catch {
		return NextResponse.json(
			{ error: 'O arquivo enviado não é um CSV válido.' },
			{ status: 400 },
		);
	}

	try {
		const summary = await prisma.$transaction(
			(tx) => importOrigins(tx, updates),
			{ maxWait: 5_000, timeout: 30_000 },
		);
		for (const tag of ORIGIN_UPLOAD_CACHE_TAGS) revalidateTag(tag);
		return NextResponse.json(summary);
	} catch {
		return NextResponse.json(
			{ error: 'Erro interno ao importar o CSV.' },
			{ status: 500 },
		);
	}
}
