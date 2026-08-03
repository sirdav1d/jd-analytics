import { z } from "zod";
import { LinxDataError } from "../errors";
import type { LinxResponseRow } from "../types";

const integerPattern = /^-?\d+$/;
const decimalPattern = /^-?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;

export const integer = z.string().trim().regex(integerPattern).transform(Number).refine(Number.isSafeInteger);
export const nullableInteger = integer.nullable();
export const decimal = z.string().trim().regex(decimalPattern).transform((value) => Number(value.replace(",", "."))).refine(Number.isFinite);
export const nullableText = z.string().trim().min(1).nullable();
export const text = z.string().trim().min(1);
export const linxBoolean = z.string().trim().transform((value, context) => {
  const normalized = value.toLocaleLowerCase("pt-BR");
  if (["1", "true", "s"].includes(normalized)) return true;
  if (["0", "false", "n"].includes(normalized)) return false;
  context.addIssue({ code: z.ZodIssueCode.custom, message: "Booleano Linx inválido" });
  return z.NEVER;
});

export function parseRows<T extends z.ZodTypeAny>(schema: T, rows: LinxResponseRow[]): z.output<T>[] {
  return rows.map((row) => {
    const parsed = schema.safeParse(row);
    if (!parsed.success) throw new LinxDataError();
    return parsed.data;
  });
}
