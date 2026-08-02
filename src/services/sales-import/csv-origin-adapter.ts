import { parse as parseCSV } from "papaparse";
import type { CanonicalOriginUpdate } from "./contracts";
import {
  normalizeCsvHeader,
  parseBrazilianDate,
  validateRequiredHeaders,
} from "@/utils/csv/process";

const ORIGIN_CSV_HEADERS = ["Empresa", "Data", "Documento/ECF", "Resposta"] as const;

type CsvRow = Record<string, string>;

function requireValue(row: CsvRow, header: string, rowNumber: number): string {
  const value = row[header];
  if (value === undefined || value.trim() === "") {
    throw new Error(`Campo obrigatório ausente na linha ${rowNumber + 2}: ${header}`);
  }
  return value;
}

export function adaptOriginCsv(csvText: string): CanonicalOriginUpdate[] {
  const parsed = parseCSV<CsvRow>(csvText.replace(/^\uFEFF/, ""), {
    header: true,
    delimiter: ";",
    skipEmptyLines: true,
    transformHeader: normalizeCsvHeader,
  });
  const missingHeaders = validateRequiredHeaders(
    parsed.meta.fields ?? [],
    ORIGIN_CSV_HEADERS,
  );
  if (missingHeaders.length) {
    throw new Error(`Cabeçalhos obrigatórios ausentes: ${missingHeaders.join(", ")}`);
  }
  if (parsed.errors.length) {
    throw new Error(`Erro ao processar CSV: ${parsed.errors[0].message}`);
  }

  return parsed.data.map((row, rowNumber) => {
    const organizationName = requireValue(row, "Empresa", rowNumber).trim();
    const documentNumber = requireValue(row, "Documento/ECF", rowNumber)
      .trim()
      .split("/")[0];
    if (!documentNumber) {
      throw new Error(`Documento/ECF inválido na linha ${rowNumber + 2}`);
    }
    const response = row["Resposta"];
    if (response === undefined) {
      throw new Error(`Campo obrigatório ausente na linha ${rowNumber + 2}: Resposta`);
    }

    return {
      organizationExternalCode: organizationName === "JD INFO - DOMINUS" ? 1 : 2,
      date: parseBrazilianDate(requireValue(row, "Data", rowNumber)),
      documentNumber,
      commercialOrigin: response.trim() || "Desconhecido",
    };
  });
}
