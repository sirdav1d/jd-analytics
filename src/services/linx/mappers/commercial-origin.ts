import { z } from "zod";
import { integer, nullableInteger, parseRows, text } from "./common";
import type { LinxResponseRow } from "../types";
import type { LinxMovement } from "./movement";

const routineOriginSchema = z.object({
  codigo_rotina: integer,
  descricao_rotina: text,
});
const movementPrincipalSchema = z.object({
  identificador: z.string().uuid(),
  id_resposta_venda: nullableInteger,
});
const salesResponseSchema = z.object({
  id_resposta_venda: integer,
  descricao_resposta: text,
});

export type LinxOrigins = {
  operationalOrigin: string | null;
  commercialOrigin: string | null;
};

export function mapRoutineOrigins(
  rows: LinxResponseRow[],
): Map<number, string> {
  return new Map(
    parseRows(routineOriginSchema, rows).map((row) => [
      row.codigo_rotina,
      row.descricao_rotina,
    ]),
  );
}

export function mapMovementPrincipals(
  rows: LinxResponseRow[],
): Map<string, number | null> {
  return new Map(
    parseRows(movementPrincipalSchema, rows).map((row) => [
      row.identificador,
      row.id_resposta_venda,
    ]),
  );
}

export function mapSalesResponses(
  rows: LinxResponseRow[],
): Map<number, string> {
  return new Map(
    parseRows(salesResponseSchema, rows).map((row) => [
      row.id_resposta_venda,
      row.descricao_resposta,
    ]),
  );
}

export function buildCommercialOrigins(input: {
  movements: LinxMovement[];
  routineOrigins: Map<number, string>;
  principals: Map<string, number | null>;
  salesResponses: Map<number, string>;
}): Map<string, LinxOrigins> {
  return new Map(
    input.movements.map((movement) => {
      const responseId = input.principals.get(movement.identificador);
      return [
        movement.identificador,
        {
          operationalOrigin:
            movement.operationalOriginCode === null
              ? null
              : input.routineOrigins.get(
                  movement.operationalOriginCode,
                ) ?? null,
          commercialOrigin:
            responseId === null || responseId === undefined
              ? null
              : input.salesResponses.get(responseId) ?? null,
        },
      ];
    }),
  );
}

export function mapCommercialOrigins(input: {
  movements: LinxMovement[];
  routineOrigins: LinxResponseRow[];
  principals: LinxResponseRow[];
  salesResponses: LinxResponseRow[];
}): Map<string, LinxOrigins> {
  return buildCommercialOrigins({
    movements: input.movements,
    routineOrigins: mapRoutineOrigins(input.routineOrigins),
    principals: mapMovementPrincipals(input.principals),
    salesResponses: mapSalesResponses(input.salesResponses),
  });
}
