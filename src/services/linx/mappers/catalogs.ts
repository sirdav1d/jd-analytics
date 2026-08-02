import { z } from "zod";
import type { CanonicalParty, CanonicalSaleItem, CanonicalSeller } from "../../sales-import/contracts";
import type { LinxResponseRow } from "../types";
import { integer, nullableText, parseRows, text } from "./common";

const customerSchema = z.object({
  cod_cliente: integer,
  nome_cliente: nullableText,
  razao_cliente: nullableText.optional(),
  tipo_cliente: nullableText,
}).superRefine((row, context) => {
  if (row.nome_cliente === null && !row.razao_cliente) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Cliente sem nome",
    });
  }
});
const sellerSchema = z.object({ cod_vendedor: integer, nome_vendedor: text });
const productSchema = z.object({ cod_produto: integer, nome: text, desc_marca: nullableText, desc_setor: nullableText });

export function mapCatalogs(input: {
  customers: LinxResponseRow[];
  sellers: LinxResponseRow[];
  products: LinxResponseRow[];
}): {
  customers: Map<number, CanonicalParty>;
  sellers: Map<number, CanonicalSeller>;
  products: Map<number, Pick<CanonicalSaleItem, "productCode" | "description" | "brand" | "sector">>;
} {
  return {
    customers: new Map(parseRows(customerSchema, input.customers).map((row) => [row.cod_cliente, {
      externalCode: row.cod_cliente,
      name: row.nome_cliente ?? row.razao_cliente!,
      personType: row.tipo_cliente === "F" ? "FISICA" : row.tipo_cliente === "J" ? "JURIDICA" : undefined,
    }])),
    sellers: new Map(parseRows(sellerSchema, input.sellers).map((row) => [row.cod_vendedor, {
      externalCode: row.cod_vendedor, name: row.nome_vendedor,
    }])),
    products: new Map(parseRows(productSchema, input.products).map((row) => [row.cod_produto, {
      productCode: row.cod_produto, description: row.nome, brand: row.desc_marca ?? "", sector: row.desc_setor ?? "",
    }])),
  };
}
