import { XMLParser, XMLValidator } from "fast-xml-parser";
import {
  LinxAuthError,
  LinxContractError,
  LinxDataError,
  LinxPermissionError,
  LinxResponseError,
  LinxTransientError,
} from "./errors";
import type { LinxRequest, LinxResponse } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: false,
});

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const asArray = (value: unknown): unknown[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

const asText = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

function classifyUnsuccessfulResponse(message: string | null): never {
  const normalized = message?.toLocaleLowerCase("pt-BR") ?? "";
  if (/usuário|usuario|senha|autent/.test(normalized)) throw new LinxAuthError();
  if (/não possui acesso|nao possui acesso|permiss/.test(normalized)) {
    throw new LinxPermissionError();
  }
  if (/inesperado|tempor|indispon/.test(normalized)) throw new LinxTransientError();
  if (/parâmetro|parametro|requerid|estrutura.*xml/.test(normalized)) {
    throw new LinxDataError();
  }
  throw new LinxResponseError();
}

export function buildLinxRequest(input: LinxRequest): string {
  const parameters = Object.entries(input.parameters)
    .map(
      ([id, value]) =>
        `<Parameter id="${escapeXml(id)}">${escapeXml(
          value === null ? "NULL" : String(value),
        )}</Parameter>`,
    )
    .join("");

  return (
    '<?xml version="1.0" encoding="utf-8"?>' +
    "<LinxMicrovix>" +
    `<Authentication user="${escapeXml(input.user)}" password="${escapeXml(input.password)}" />` +
    "<ResponseFormat>xml</ResponseFormat>" +
    `<Command><Name>${escapeXml(input.command)}</Name><Parameters>${parameters}</Parameters></Command>` +
    "</LinxMicrovix>"
  );
}

export function parseLinxResponse(xml: string): LinxResponse {
  const validation = XMLValidator.validate(xml);
  if (validation !== true) throw new LinxContractError();

  const root = asRecord(parser.parse(xml))?.Microvix;
  const envelope = asRecord(root);
  const result = asRecord(envelope?.ResponseResult ?? envelope?.Result);
  const success = asText(result?.ResponseSuccess ?? result?.Success);

  if (!envelope || !result || success === null) throw new LinxContractError();
  if (success.toLowerCase() !== "true") {
    classifyUnsuccessfulResponse(asText(result.Message));
  }

  const responseData = asRecord(envelope.ResponseData);
  const columnSet = asRecord(responseData?.C);
  if (!responseData || !columnSet) throw new LinxContractError();

  const columns = asArray(columnSet.D).map(asText);
  if (
    columns.length === 0 ||
    columns.some((column) => column === null || column.length === 0) ||
    new Set(columns).size !== columns.length
  ) {
    throw new LinxContractError();
  }
  const columnNames = columns as string[];

  const rows = asArray(responseData.R).map((row) => {
    const values = asArray(asRecord(row)?.D).map(asText);
    if (values.length !== columnNames.length || values.some((value) => value === null)) {
      throw new LinxContractError();
    }

    return Object.fromEntries(
      columnNames.map((column, index) => [column, values[index] === "" ? null : values[index]!]),
    );
  });

  return { columns: columnNames, rows };
}
