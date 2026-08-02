/** @format */

import 'server-only';

import formidable from 'formidable';
import { NextRequest } from 'next/server';
import { Readable, Transform } from 'stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import fs from 'fs/promises';
import type { IncomingMessage } from 'http';

const MAX_CSV_FILE_SIZE = 10 * 1024 * 1024;
const MAX_MULTIPART_OVERHEAD = 64 * 1024;
const MAX_MULTIPART_BODY_SIZE = MAX_CSV_FILE_SIZE + MAX_MULTIPART_OVERHEAD;
const MAX_MULTIPART_FIELDS_SIZE = 64 * 1024;
const CSV_MIME_TYPES = new Set([
	'text/csv',
	'application/csv',
	'application/vnd.ms-excel',
]);
const INVALID_CSV_MESSAGE = 'O arquivo enviado não é um CSV válido.';

export class CsvUploadError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CsvUploadError';
	}
}

export const ORDER_CSV_HEADERS = [
	'Data do Lançamento',
	'Código Empresa',
	'Nome Empresa',
	'Documento',
	'Natureza de Operação',
	'Operação',
	'Origem',
	'Nome Cliente',
	'Descrição Produto',
	'Valor Total Item',
	'Forma de Pagamento',
	'Marca Produto',
	'Qtde Item',
	'Valor Unitário Item',
	'Setor Produto',
	'Tipo Pessoa',
	'Vendedor',
	'Cancelada',
	'Código Cliente',
	'Código Produto',
] as const;

export function validateRequiredHeaders(
	headers: string[],
	expected: readonly string[],
): string[] {
	return expected.filter((header) => !headers.includes(header));
}

export function normalizeCsvHeader(header: string): string {
	return header.trim().replace(/^"+|"+$/g, '');
}

export function parseBrazilianDate(value: string): Date {
	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
	if (!match) throw new Error(`Data inválida: ${value}`);
	const [, day, month, year] = match;
	const parsedDay = Number(day);
	const parsedMonth = Number(month);
	const parsedYear = Number(year);
	const date = new Date(parsedYear, parsedMonth - 1, parsedDay);
	if (
		date.getFullYear() !== parsedYear ||
		date.getMonth() !== parsedMonth - 1 ||
		date.getDate() !== parsedDay
	) {
		throw new Error(`Data inválida: ${value}`);
	}
	return date;
}

export function parseDecimal(value: string): number {
	const parsed = Number(value.replaceAll('.', '').replace(',', '.'));
	if (!Number.isFinite(parsed)) throw new Error(`Decimal inválido: ${value}`);
	return parsed;
}

export function parseBoolean(value: string): boolean {
	return ['sim', 's', '1', 'true'].includes(value.trim().toLowerCase());
}

function invalidCsv() {
	return new CsvUploadError(INVALID_CSV_MESSAGE);
}

export async function readMultipartCsv(req: NextRequest): Promise<string> {
	const declaredLength = req.headers.get('content-length');
	if (declaredLength !== null) {
		const parsedLength = Number(declaredLength);
		if (
			!Number.isSafeInteger(parsedLength) ||
			parsedLength < 0 ||
			parsedLength > MAX_MULTIPART_BODY_SIZE
		) {
			throw invalidCsv();
		}
	}

	if (!req.body) {
		throw invalidCsv();
	}

	const source = Readable.fromWeb(
		req.body as unknown as NodeReadableStream<Uint8Array>,
	);
	let receivedBytes = 0;
	const limiter = new Transform({
		transform(chunk: Buffer, _encoding, callback) {
			receivedBytes += chunk.length;
			if (receivedBytes > MAX_MULTIPART_BODY_SIZE) {
				callback(invalidCsv());
				return;
			}
			callback(null, chunk);
		},
	});
	const limitedBody = source.pipe(limiter);
	const headers = Object.fromEntries(req.headers.entries());
	if (!headers['content-length'] && !headers['transfer-encoding']) {
		headers['transfer-encoding'] = 'chunked';
	}
	const fakeRequest = Object.assign(limitedBody, {
		headers,
		method: req.method,
		url: req.url,
	}) as unknown as IncomingMessage;
	const temporaryFiles = new Set<string>();
	const form = formidable({
		multiples: false,
		allowEmptyFiles: false,
		minFileSize: 1,
		maxFileSize: MAX_CSV_FILE_SIZE,
		maxTotalFileSize: MAX_CSV_FILE_SIZE,
		maxFields: 4,
		maxFieldsSize: MAX_MULTIPART_FIELDS_SIZE,
		maxFiles: 1,
		filter: ({ name, mimetype }) =>
			name === 'csv' && (!mimetype || CSV_MIME_TYPES.has(mimetype)),
	});
	form.on('fileBegin', (_name, file) => {
		temporaryFiles.add(file.filepath);
	});

	try {
		const [, files] = await form.parse(fakeRequest);
		const file = files.csv?.[0];
		if (
			!file ||
			file.size <= 0 ||
			file.size > MAX_CSV_FILE_SIZE ||
			(file.mimetype && !CSV_MIME_TYPES.has(file.mimetype))
		) {
			throw invalidCsv();
		}

		return await fs.readFile(file.filepath, 'utf8');
	} catch {
		source.destroy();
		limiter.destroy();
		throw invalidCsv();
	} finally {
		await Promise.allSettled(
			[...temporaryFiles].map((filepath) => fs.unlink(filepath)),
		);
	}
}
