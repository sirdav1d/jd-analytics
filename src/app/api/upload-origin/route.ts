/** @format */
import { prisma } from '@/lib/prisma';
import { parseFormData } from '@/utils/csv/process';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { parse as parseCSV } from 'papaparse';

// desabilita o bodyParser
export const config = {
	api: { bodyParser: false },
};

type CsvRow = Record<string, string>;

function parseDateBR(dateStr: string): Date {
	const [day, month, year] = dateStr.split('/');
	return new Date(+year, +month - 1, +day);
}

export async function POST(req: NextRequest) {
	try {
		const file = await parseFormData(req);
		const raw = await fs.readFile(file.filepath, 'utf-8');
		// CSV separado por ponto‐e‐vírgula
		const { data: rows, errors } = parseCSV<CsvRow>(raw, {
			header: true,
			delimiter: ';',
			skipEmptyLines: true,
		});
		if (errors.length) {
			console.error('CSV parse errors', errors);
			return NextResponse.json(
				{ ok: false, error: 'Erro no CSV' },
				{ status: 400 },
			);
		}

		for (const r of rows) {
			const orgName = r['Empresa'].trim();
			const saleDate = parseDateBR(r['Data']);
			// documento vem no formato "2676/0", pegamos antes da barra
			const [docNum] = r['Documento/ECF'].trim().split('/');
			const originName = r['Resposta'].trim() || 'Desconhecido';

			const orgId =
				orgName === 'JD INFO - DOMINUS'
					? process.env.JD_CENTRO_ID
					: process.env.JD_ICARAI_ID;
			// 1) Ache organização pelo nome
			const org = await prisma.organization.findUnique({
				where: { id: orgId },
			});
			if (!org) {
				console.warn(`Org não encontrada: ${orgName}, pulando`);
				continue;
			}

			// 2) Upsert de Origin
			const origin = await prisma.origin.upsert({
				where: { name: originName },
				update: {},
				create: { name: originName },
			});

			// 3) Atualiza o Pedido correto
			//   — usamos a chave composta que você já criou:
			//     [documentNumber, organizationId, data_pedido]
			console.log(saleDate);
			const p = await prisma.pedido.update({
				where: {
					documentNumber_organizationId_data_pedido: {
						documentNumber: docNum,
						organizationId: org.id,
						data_pedido: saleDate,
					},
				},
				data: { originId: origin.id },
			});

			if (!p) {
				console.error('Número do pedido não encontrado', docNum);
			}
		}

		return NextResponse.json(
			{ ok: true, imported: rows.length },
			{ status: 201 },
		);
	} catch (err: unknown) {
		console.error('Erro na rota de importação de origens:', err);
		return NextResponse.json(
			{ ok: false, error: err instanceof Error ? err.message : 'Erro interno' },
			{ status: 500 },
		);
	}
}
