/** @format */
import { parseFormData, validateCSV } from '@/utils/csv/process';
import fs from 'fs/promises'; // Usamos a API de promises para leitura de arquivos de forma simples
import { NextRequest, NextResponse } from 'next/server';
import { parse as parseCSV } from 'papaparse'; // Para transformar o CSV em objetos JavaScript

// Desabilita o bodyParser padrão do Next.js, pois usaremos o formidable para processar o multipart
export const config = {
	api: {
		bodyParser: false,
	},
};

// Função principal que processa a requisição de upload de CSV
export async function POST(req: NextRequest) {
	try {
		// 1. Extrai o arquivo do formulário
		const file = await parseFormData(req);

		if (!validateCSV(file)) {
			return NextResponse.json(
				{ ok: false, error: 'O arquivo enviado não é um CSV válido.' },
				{ status: 404 },
			);
		}

		// 2. Lê o conteúdo do arquivo CSV usando fs/promises
		const fileData = await fs.readFile(file.filepath, 'utf-8');

		// 3. Utiliza Papaparse para converter o conteúdo CSV em um array de objetos,
		//    considerando que a primeira linha contém os cabeçalhos (header: true)
		const parsed = parseCSV(fileData, {
			header: true,
			skipEmptyLines: true,
		});

		// 4. Verifica se houve erros durante o parsing
		if (parsed.errors.length) {
			console.error('Erros no parsing do CSV:', parsed.errors);
			return NextResponse.json(
				{ ok: false, error: 'Erro ao processar o CSV' },
				{ status: 400 },
			);
		}

		// 5. Obtém os dados processados
		const data = parsed.data;

		// Aqui você pode incluir a lógica para salvar os dados processados no Supabase ou outro banco de dados.
		// Exemplo: await supabase.from('tabela_dados').insert(data);
		console.log('Dados processados:', data);
		// 6. Retorna uma resposta JSON confirmando sucesso e incluindo os dados processados
		return NextResponse.json({ ok: true, data });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		// Tratamento de erro em caso de exceção
		console.error('Erro na rota de upload CSV:', err);
		return NextResponse.json(
			{ ok: false, error: err.message || 'Erro interno' },
			{ status: 500 },
		);
	}
}
