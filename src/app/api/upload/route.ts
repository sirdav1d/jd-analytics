/** @format */

import { prisma } from '@/lib/prisma';
import { parseFormData, validateCSV } from '@/utils/csv/process';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { parse as parseCSV } from 'papaparse';
import bcrypt from 'bcryptjs';

// Desabilita o bodyParser padrão do Next.js
export const config = {
	api: {
		bodyParser: false,
	},
};

type CsvRow = Record<string, string>;

type ParsedRow = Record<string, string>;

function normalizeRow(raw: CsvRow): ParsedRow {
	const keys = Object.keys(raw);
	if (keys.length === 1) {
		// Linha mal parseada: cabeçalho e valores em um único campo
		const [headerStr, valueStr] = Object.entries(raw)[0];
		const headers = headerStr.replace(/^"+|"+$/g, '').split('","');
		const values = valueStr.replace(/^"+|"+$/g, '').split('","');
		const obj: ParsedRow = {};
		headers.forEach((h, i) => (obj[h] = values[i] || ''));
		return obj;
	}
	return raw as ParsedRow;
}

function parseDateBR(dateStr: string | undefined): Date {
	if (!dateStr) {
		throw new Error('Data do Lançamento ausente ou inválida');
	}
	const parts = dateStr.split('/');
	if (parts.length !== 3) {
		throw new Error(`Formato de data inválido: ${dateStr}`);
	}
	const [day, month, year] = parts;
	return new Date(+year, +month - 1, +day);
}

function parseDecimal(valor: string): number {
	return parseFloat(valor.replace(/\./g, '').replace(/,/g, '.'));
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
		fileData = fileData.replace(/\r\n/g, '\n').trim();

		const parsed = parseCSV<CsvRow>(fileData, {
			header: true,
			skipEmptyLines: true,
			delimiter: ',',
			quoteChar: '"',
		});

		console.log(parsed.errors)
		if (parsed.errors.length) {
			console.error('Erros no parsing do CSV:', parsed.errors);
			return NextResponse.json(
				{ ok: false, error: 'Erro ao processar o CSV' },
				{ status: 400 },
			);
		}

		const rows: ParsedRow[] = parsed.data.map(normalizeRow);

		async function upsertSeller(fullName: string, sellerCode: string) {
			const domain = 'infojd.com.br';
			const plainPassword = 'Senha@123';
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
			const parts = fullName.trim().split(/\s+/);
			const first = parts[0];

			const normalize = (s: string) =>
				s
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.toLowerCase();

			const base = normalize(first);
			const emailCandidate = `${base}${sellerCode}@${domain}`;

			const seller = await prisma.user.upsert({
				where: { externalId: sellerCode }, // Replace with a valid unique field
				update: { name: fullName, email: emailCandidate },
				create: {
					name: fullName,
					email: emailCandidate,
					externalId: sellerCode,
					role: 'SELLER',
					password: hashedPassword, // Replace with a secure default password or logic
					organization: { connect: { id: process.env.JD_CENTRO_ID } }, // Replace with valid organization logic
				},
			});
			return seller;
		}

		for (const row of rows) {
			// Extração de campos
			console.log('row[0]', row['Data do Lançamento']);
			const launchDate = parseDateBR(row['Data do Lançamento']);
			const documentNumber = row['Documento'];
			const natureOperation = row['Natureza de Operação'];
			const operationType = row['Operação'];
			const origin = row['Origem'];
			const cancelled = row['Cancelada'].toLowerCase() === 'sim';

			// Cliente
			const clienteCode = parseInt(row['Código Cliente'], 10);
			const clienteName = row['Nome Cliente'];
			const personType =
				row['Tipo Pessoa'].toUpperCase() === 'JURÍDICA' ? 'JURIDICA' : 'FISICA';
			const customer = await prisma.customer.upsert({
				where: { externalCode: clienteCode },
				update: { name: clienteName, personType },
				create: { name: clienteName, personType, externalCode: clienteCode },
			});

			// Seller
			const vendedorRaw = row['Vendedor']?.toString().trim();
			const sellerParts = vendedorRaw.split(' - ');
			const sellerCode =
				sellerParts.length > 1 ? sellerParts[0].trim() : 'não encontrado';
			const fullName =
				sellerParts.length > 1 ? sellerParts[1].trim() : vendedorRaw;

			const seller = await upsertSeller(fullName, sellerCode);

			// Product
			const prodCode = parseInt(row['Código Produto'], 10);
			const prodDesc = row['Descrição Produto'];
			const brand = row['Marca Produto'];
			const sector = row['Setor Produto'];
			const product = await prisma.product.upsert({
				where: { externalCode: prodCode },
				update: {},
				create: {
					description: prodDesc,
					brand,
					sector,
					externalCode: prodCode,
				},
			});

			// PaymentMethod
			const method = row['Forma de Pagamento'];
			const paymentMethod = await prisma.paymentMethod.upsert({
				where: { method: method },
				update: {},
				create: { method },
			});

			// Sale
			const sale = await prisma.pedido.upsert({
				where: { documentNumber: documentNumber },
				update: {},
				create: {
					documentNumber,
					data_pedido: launchDate,
					natureOperation,
					operationType,
					origin,
					cancelled,
					customer: { connect: { id: customer.id } },
					user: { connect: { id: seller.id } },
					paymentMethod: { connect: { id: paymentMethod.id } },
				},
			});

			// SaleItem
			const quantity = parseDecimal(row['Qtde Item']);
			const unitValue = parseDecimal(row['Valor Unitário Item']);
			const totalValue = parseDecimal(row['Valor Total Item']);
			await prisma.saleItem.create({
				data: {
					sale: { connect: { id: sale.id } },
					product: { connect: { id: product.id } },
					quantity,
					unitValue,
					totalValue,
				},
			});
		}

		return NextResponse.json(
			{
				ok: true,
				data: `Importação concluída - ${parsed.data.length}`,
				error: null,
			},
			{ status: 201 },
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error('Erro na rota de upload CSV:', err);
		return NextResponse.json(
			{ ok: false, error: err.message || 'Erro interno' },
			{ status: 500 },
		);
	}
}
