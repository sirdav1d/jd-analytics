/** @format */
import { prisma } from '@/lib/prisma';
import { parseFormData, validateCSV } from '@/utils/csv/process';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { parse as parseCSV } from 'papaparse';

// Desabilita o bodyParser padrão do Next.js
export const config = {
	api: {
		bodyParser: false,
	},
};

type Pedido = {
	dataPedido: Date;
	dataAprovacao: Date;
	cancelada: boolean;
	faturado: boolean;
	codigoPedido: string;
	codigoProduto: string;
	setor: string;
	produto: string;
	precoUnitario: number;
	quantidade: number;
	valorTotal: number;
	cliente: string;
	vendedor: string;
};

function parseDate(dateStr: string): Date {
	const [dia, mes, ano] = dateStr.split('/');
	return new Date(+ano, +mes - 1, +dia);
}

function parseDecimal(valor: string): number {
	return parseFloat(valor.replace('.', '').replace(',', '.'));
}

function parseLinhaBruta(rawObj: Record<string, string>): Pedido[] {
	const [headerStr, valueStr] = Object.entries(rawObj)[0];

	const headers = headerStr.replace(/^"+|"+$/g, '').split('","');

	const values = valueStr.replace(/^"+|"+$/g, '').split('","');

	const pedidos: Pedido[] = [];

	for (let i = 0; i < values.length; i += headers.length) {
		const linha = values.slice(i, i + headers.length);
		const obj: Record<string, string> = {};

		headers.forEach((h, idx) => {
			obj[h] = linha[idx];
		});

		const pedido: Pedido = {
			dataPedido: parseDate(obj['Data do Pedido']),
			dataAprovacao: parseDate(obj['Data de Aprovação do Pedido']),
			cancelada: obj['Cancelada'] === 'Sim',
			faturado: obj['Faturado'] === 'Sim',
			codigoPedido: obj['Pedido'],
			codigoProduto: obj['Cod. Produto'],
			setor: obj['Setor'],
			produto: obj['Produto'],
			precoUnitario: parseDecimal(obj['Preco Unitario']),
			quantidade: parseDecimal(obj['Qtde.']),
			valorTotal: parseDecimal(obj['Valor Total']),
			cliente: obj['Cliente'],
			vendedor: obj['Vendedor'],
		};

		pedidos.push(pedido);
	}

	return pedidos;
}

// Função principal
export async function POST(req: NextRequest) {
	try {
		const file = await parseFormData(req);

		if (!validateCSV(file)) {
			return NextResponse.json(
				{ ok: false, error: 'O arquivo enviado não é um CSV válido.' },
				{ status: 400 },
			);
		}

		let fileData = await fs.readFile(file.filepath, 'utf-8');

		// Normaliza quebras de linha
		fileData = fileData.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

		const parsed = parseCSV(fileData, {
			header: true,
			skipEmptyLines: true,
			delimiter: ',',
			quoteChar: '"',
		});

		if (parsed.errors.length) {
			console.error('Erros no parsing do CSV:', parsed.errors);
			return NextResponse.json(
				{ ok: false, error: 'Erro ao processar o CSV' },
				{ status: 400 },
			);
		}

		// Trata caso especial de linha mal lida (chave única como texto inteiro)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const data = parsed.data.map((row: any) => {
			return parseLinhaBruta(row);
		});

		const pedidos = data.flat(); // Flatten para uma lista única de pedidos

		const createdPedidos = await prisma.pedido.createMany({
			data: pedidos,
		});

		console.log('Pedidos criados:', createdPedidos);

		return NextResponse.json({
			ok: true,
			data: createdPedidos.count,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error('Erro na rota de upload CSV:', err);
		return NextResponse.json(
			{ ok: false, error: err.message || 'Erro interno' },
			{ status: 500 },
		);
	}
}
