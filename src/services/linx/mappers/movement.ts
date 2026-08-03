import { z } from "zod";
import { decimal, integer, linxBoolean, nullableInteger, nullableText, parseRows, text } from "./common";
import type { LinxResponseRow } from "../types";

const SALES_REPORT_NATURE_OPERATION = "[S] VENDA DE PRODUTOS";

const optionalTransactionType = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0
      ? null
      : value,
  nullableText,
);

const movementRowSchema = z.object({
  identificador: z.string().uuid(),
  transacao: integer.optional(),
  timestamp: z.string().regex(/^\d+$/).transform(BigInt),
  documento: text,
  data_lancamento: text,
  codigo_cliente: nullableInteger,
  cod_vendedor: integer,
  cod_produto: integer,
  quantidade: decimal,
  preco_unitario: decimal,
  valor_total: decimal,
  tipo_transacao: optionalTransactionType.optional().default(null),
  soma_relatorio: linxBoolean
    .optional()
    .transform((value) => value ?? true),
  cancelado: linxBoolean,
  excluido: linxBoolean,
  ordem: nullableInteger,
  codigo_rotina_origem: nullableInteger,
  natureza_operacao: text,
  operacao: text,
}).superRefine((row, context) => {
  if (
    (row.transacao === undefined && row.ordem === null) ||
    (row.transacao !== undefined && row.transacao <= 0)
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Movimento sem identidade de item",
    });
  }
});

export type LinxMovement = {
  identificador: string;
  timestamp: bigint;
  documentNumber: string;
  launchDate: string;
  customerCode: number | null;
  sellerCode: number;
  productCode: number;
  quantity: number;
  unitValue: number;
  totalValue: number;
  transactionType?: string | null;
  sumsToReport?: boolean;
  cancelled: boolean;
  excluded: boolean;
  order: number;
  operationalOriginCode: number | null;
  natureOperation: string;
  operationType: string;
};

export function mapMovementRows(rows: LinxResponseRow[]): LinxMovement[] {
  return parseRows(movementRowSchema, rows).map((row) => ({
    identificador: row.identificador,
    timestamp: row.timestamp,
    documentNumber: row.documento,
    launchDate: row.data_lancamento,
    customerCode: row.codigo_cliente,
    sellerCode: row.cod_vendedor,
    productCode: row.cod_produto,
    quantity: row.quantidade,
    unitValue: row.preco_unitario,
    totalValue: row.valor_total,
    transactionType: row.tipo_transacao,
    sumsToReport: row.soma_relatorio,
    cancelled: row.cancelado,
    excluded: row.excluido,
    order: row.transacao ?? row.ordem!,
    operationalOriginCode: row.codigo_rotina_origem,
    natureOperation: row.natureza_operacao,
    operationType: row.operacao,
  }));
}

export function isReportableSaleMovement(movement: LinxMovement) {
  return (
    movement.operationType === "S" &&
    movement.natureOperation === SALES_REPORT_NATURE_OPERATION &&
    movement.sumsToReport !== false &&
    (movement.transactionType == null ||
      movement.transactionType === "P")
  );
}
