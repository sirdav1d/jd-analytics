/** @format */

import formidable, { File } from 'formidable';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';

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

		const form = formidable({ multiples: false });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		form.parse(fakeReq as any, (err, fields, files) => {
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

export function validateCSV(file: File): boolean {
	// Se o file.mimetype estiver disponível, pode validar também
	if (file.mimetype && !file.mimetype.includes('csv')) {
		console.log('MIME type inválido:', file.mimetype);
		return false;
	}
	return true;
}
