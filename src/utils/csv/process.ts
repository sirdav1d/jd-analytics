/** @format */

import formidable, { File } from 'formidable';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';
import fs from 'fs/promises';
// Defina aqui os cabeçalhos obrigatórios do CSV
const expectedHeaders = [
	'Data',
	'Documento',
	'Operacao',
	'Valor Total',
	'Vendedor',
];

export async function convertRequestToStream(
	req: NextRequest,
): Promise<Readable> {
	// Converte o corpo para um ArrayBuffer e depois para Buffer
	const buffer = Buffer.from(await req.arrayBuffer());
	// Cria uma stream a partir do Buffer
	return Readable.from(buffer);
}

export async function parseFormData(req: NextRequest): Promise<File> {
	const nodeReq = await convertRequestToStream(req);
	// Cria um "fake" objeto de requisição que inclua os headers esperados
	const headers = Object.fromEntries(req.headers.entries());

	return new Promise((resolve, reject) => {
		// O "formidable" espera um IncomingMessage.
		// Vamos simular isso injetando os headers e a stream.
		const fakeReq = Object.assign(nodeReq, { headers });

		const form = formidable({
			multiples: false,
			maxFileSize: 10 * 1024 * 1024, // 10 MB
			allowEmptyFiles: false,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		form.parse(fakeReq as any, (err, _fields, files) => {
			if (err) {
				return reject(err);
			}

			// Supondo que o input tenha name="csv"
			const file = files.csv;
			if (!file) {
				return reject(new Error('Arquivo CSV não encontrado ou inválido.'));
			}
			resolve(file[0]);
		});
	});
}

export async function validateCSV(file: File): Promise<boolean> {
	// Se o file.mimetype estiver disponível, pode validar também
	if (file.mimetype && !file.mimetype.includes('csv')) {
		console.log('MIME type inválido:', file.mimetype);
		return false;
	}

	try {
		// Lê apenas as primeiras linhas para verificar cabeçalhos
		const content = await fs.readFile(file.filepath, 'utf-8');
		const firstLine = content.split(/\r?\n/)[0];
		const headers = firstLine
			.split(',')
			.map((h) => h.trim().replace(/^"+|"+$/g, ''));

		const missing = expectedHeaders.filter((h) => !headers.includes(h));
		if (missing.length) {
			console.log('Cabeçalhos faltando no CSV:', missing);
			return false;
		}

		return true;
	} catch (err) {
		console.log('Erro ao ler CSV para validação:', err);
		return false;
	}
}
