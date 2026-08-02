import { z } from "zod";
import { parseRows, text } from "./common";
import type { LinxResponseRow } from "../types";

const paymentRowSchema = z.object({ identificador: z.string().uuid(), forma_pgto: text });

export function combinePaymentLabels(labels: string[]) {
  const unique = [...new Set(labels.map((label) => label.trim()).filter(Boolean))];
  return unique.sort((a, b) => a.localeCompare(b, "pt-BR")).join(", ");
}

export function mapPaymentLabels(rows: LinxResponseRow[]): Map<string, string> {
  const labelsByMovement = new Map<string, string[]>();
  for (const row of parseRows(paymentRowSchema, rows)) {
    labelsByMovement.set(row.identificador, [...(labelsByMovement.get(row.identificador) ?? []), row.forma_pgto]);
  }
  return new Map([...labelsByMovement].map(([identifier, labels]) => [identifier, combinePaymentLabels(labels)]));
}
