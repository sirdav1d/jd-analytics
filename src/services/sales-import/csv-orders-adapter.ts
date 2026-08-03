import { parse as parseCSV } from "papaparse";
import type {
  CanonicalParty,
  CanonicalSale,
  CanonicalSaleItem,
  CanonicalSeller,
} from "./contracts";
import {
  normalizeCsvHeader,
  ORDER_CSV_HEADERS,
  parseBoolean,
  parseBrazilianDate,
  parseDecimal,
  validateRequiredHeaders,
} from "@/utils/csv/process";

type CsvRow = Record<string, string>;

function requireValue(row: CsvRow, header: string, rowNumber: number): string {
  const value = row[header];
  if (value === undefined || value.trim() === "") {
    throw new Error(`Campo obrigatório ausente na linha ${rowNumber + 2}: ${header}`);
  }
  return value;
}

function parseRequiredNumber(
  value: string,
  field: string,
  rowNumber: number,
): number {
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed)) {
    throw new Error(`Número inválido na linha ${rowNumber + 2}: ${field}`);
  }
  return parsed;
}

function parseSeller(value: string, rowNumber: number) {
  const normalized = value.trim();
  const codedSeller = /^(\d+)\s-\s(.+)$/.exec(normalized);
  if (codedSeller) {
    return {
      externalCode: parseRequiredNumber(codedSeller[1], "Vendedor", rowNumber),
      name: codedSeller[2].trim(),
    };
  }

  if (/^\d|[-–—]/.test(normalized)) {
    throw new Error(`Vendedor inválido na linha ${rowNumber + 2}`);
  }

  return { externalCode: null, name: normalized };
}

function parseCustomer(row: CsvRow, rowNumber: number): CanonicalParty | null {
  const code = (row["Código Cliente"] ?? "").trim();
  const name = (row["Nome Cliente"] ?? "").trim();
  if (!code && !name) return null;
  if (!code || !name) {
    throw new Error(`Cliente incompleto na linha ${rowNumber + 2}`);
  }

  const externalCode = parseRequiredNumber(code, "Código Cliente", rowNumber);
  const personType = (row["Tipo Pessoa"] ?? "").toUpperCase().trim();
  return {
    externalCode,
    name,
    personType: personType === "JURÍDICA" ? "JURIDICA" : "FISICA",
  };
}

function calendarKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function assertSameField(
  expected: unknown,
  received: unknown,
  field: string,
  rowNumber: number,
) {
  if (expected !== received) {
    throw new Error(`Pedido inconsistente na linha ${rowNumber + 2}: ${field}`);
  }
}

function assertSameCustomer(
  expected: CanonicalParty | null,
  received: CanonicalParty | null,
  rowNumber: number,
) {
  assertSameField(expected === null, received === null, "customer", rowNumber);
  if (!expected || !received) return;
  assertSameField(expected.externalCode, received.externalCode, "customer.externalCode", rowNumber);
  assertSameField(expected.name, received.name, "customer.name", rowNumber);
  assertSameField(expected.personType, received.personType, "customer.personType", rowNumber);
}

function assertSameSeller(
  expected: CanonicalSeller,
  received: CanonicalSeller,
  rowNumber: number,
) {
  assertSameField(expected.externalCode, received.externalCode, "seller.externalCode", rowNumber);
  assertSameField(expected.name, received.name, "seller.name", rowNumber);
}

function assertConsistentSale(
  existing: CanonicalSale,
  incoming: CanonicalSale,
  rowNumber: number,
) {
  assertSameField(existing.source, incoming.source, "source", rowNumber);
  assertSameField(existing.natureOperation, incoming.natureOperation, "natureOperation", rowNumber);
  assertSameField(existing.operationType, incoming.operationType, "operationType", rowNumber);
  assertSameField(existing.operationalOrigin, incoming.operationalOrigin, "operationalOrigin", rowNumber);
  assertSameField(existing.cancelled, incoming.cancelled, "cancelled", rowNumber);
  assertSameCustomer(existing.customer, incoming.customer, rowNumber);
  assertSameSeller(existing.seller, incoming.seller, rowNumber);
  assertSameField(existing.paymentLabel, incoming.paymentLabel, "paymentLabel", rowNumber);
  assertSameField(existing.commercialOrigin, incoming.commercialOrigin, "commercialOrigin", rowNumber);
}

function parseItem(row: CsvRow, rowNumber: number): CanonicalSaleItem {
  const productCode = parseRequiredNumber(
    requireValue(row, "Código Produto", rowNumber),
    "Código Produto",
    rowNumber,
  );
  if (!Number.isSafeInteger(productCode) || productCode <= 0) {
    throw new Error(`Código Produto inválido na linha ${rowNumber + 2}`);
  }
  return {
    productCode,
    description: requireValue(row, "Descrição Produto", rowNumber),
    brand: requireValue(row, "Marca Produto", rowNumber),
    sector: requireValue(row, "Setor Produto", rowNumber),
    quantity: parseDecimal(requireValue(row, "Qtde Item", rowNumber)),
    unitValue: parseDecimal(requireValue(row, "Valor Unitário Item", rowNumber)),
    totalValue: parseDecimal(requireValue(row, "Valor Total Item", rowNumber)),
  };
}

export function adaptOrdersCsv(csvText: string): CanonicalSale[] {
  const parsed = parseCSV<CsvRow>(csvText.replace(/^\uFEFF/, ""), {
    header: true,
    delimiter: ",",
    quoteChar: '"',
    skipEmptyLines: true,
    transformHeader: normalizeCsvHeader,
  });
  const missingHeaders = validateRequiredHeaders(
    parsed.meta.fields ?? [],
    ORDER_CSV_HEADERS,
  );
  if (missingHeaders.length) {
    throw new Error(`Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(", ")}`);
  }
  if (parsed.errors.length) {
    throw new Error(`Erro ao processar CSV: ${parsed.errors[0].message}`);
  }

  const salesByKey = new Map<string, CanonicalSale>();
  for (const [rowNumber, row] of parsed.data.entries()) {
    const organizationExternalCode = parseRequiredNumber(
      requireValue(row, "Código Empresa", rowNumber),
      "Código Empresa",
      rowNumber,
    );
    const date = parseBrazilianDate(
      requireValue(row, "Data do Lançamento", rowNumber),
    );
    const documentNumber = requireValue(row, "Documento", rowNumber);
    const key = [
      organizationExternalCode,
      documentNumber,
      calendarKey(date),
    ].join("|");
    const item = parseItem(row, rowNumber);
    const incomingSale: CanonicalSale = {
      source: "CSV",
      organizationExternalCode,
      date,
      documentNumber,
      natureOperation: requireValue(row, "Natureza de Operação", rowNumber),
      operationType: requireValue(row, "Operação", rowNumber),
      operationalOrigin: requireValue(row, "Origem", rowNumber),
      cancelled: parseBoolean(requireValue(row, "Cancelada", rowNumber)),
      customer: parseCustomer(row, rowNumber),
      seller: parseSeller(requireValue(row, "Vendedor", rowNumber), rowNumber),
      paymentLabel: requireValue(row, "Forma de Pagamento", rowNumber),
      commercialOrigin: null,
      items: [item],
    };
    const existingSale = salesByKey.get(key);
    if (existingSale) {
      assertConsistentSale(existingSale, incomingSale, rowNumber);
      existingSale.items.push(item);
      continue;
    }

    salesByKey.set(key, incomingSale);
  }

  return [...salesByKey.values()];
}
