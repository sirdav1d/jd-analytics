import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { AuthorizationError } from '@/lib/authorization';
import { prisma } from '@/lib/prisma';
import { readMultipartCsv } from '@/utils/csv/process';
import { adaptOrdersCsv } from '@/services/sales-import/csv-orders-adapter';
import { importSales } from '@/services/sales-import/import-sales';

const ORDER_UPLOAD_CACHE_TAGS = [
	'tracking-goal',
	'home',
	'sales-by',
	'rankings',
	'big-numbers-comercial',
	'origin',
	'origin-data',
] as const;

export async function POST(req: NextRequest) {
	try {
		await requireAdmin();
	} catch (error) {
		if (error instanceof AuthorizationError) {
			return NextResponse.json({ error: error.message }, { status: error.status });
		}
		return NextResponse.json({ error: 'Erro interno ao importar o CSV.' }, { status: 500 });
	}

	let sales;
	try {
		const csvText = await readMultipartCsv(req);
		sales = adaptOrdersCsv(csvText);
	} catch {
		return NextResponse.json(
			{ error: 'O arquivo enviado não é um CSV válido.' },
			{ status: 400 },
		);
	}

	try {
		const summary = await prisma.$transaction(
			(tx) => importSales(tx, sales),
			{ maxWait: 5_000, timeout: 30_000 },
		);
		for (const tag of ORDER_UPLOAD_CACHE_TAGS) revalidateTag(tag);
		return NextResponse.json(summary);
	} catch {
		return NextResponse.json(
			{ error: 'Erro interno ao importar o CSV.' },
			{ status: 500 },
		);
	}
}
