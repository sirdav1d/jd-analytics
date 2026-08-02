import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { adaptOrdersCsv } from "@/services/sales-import/csv-orders-adapter";
import { adaptOriginCsv } from "@/services/sales-import/csv-origin-adapter";
import {
  ORDER_CSV_HEADERS,
  parseBrazilianDate,
} from "@/utils/csv/process";

const ordersCsv = readFileSync("src/tests/fixtures/csv/pedidos-validos.csv", "utf8");

describe("CSV adapters", () => {
  it.each(["31/02/2026", "29/02/2025", "28/00/2026", "28/13/2026", "00/07/2026"])(
    "rejects the invalid calendar date %s",
    (value) => {
      expect(() => parseBrazilianDate(value)).toThrow(`Data inválida: ${value}`);
    },
  );

  it("groups lines with the same organization, document and date into one canonical sale", () => {
    const sales = adaptOrdersCsv(ordersCsv);

    expect(sales).toHaveLength(1);
    expect(sales[0]).toMatchObject({
      source: "CSV",
      organizationExternalCode: 1,
      documentNumber: "9001",
      date: new Date(2026, 6, 28),
      natureOperation: "VENDA",
      operationType: "S",
      operationalOrigin: "LOJA",
      cancelled: false,
      customer: {
        externalCode: 101,
        name: "Cliente Teste",
        personType: "FISICA",
      },
      seller: { externalCode: 201, name: "Vendedor Teste" },
      paymentLabel: "PIX",
      commercialOrigin: null,
    });
    expect(sales[0].items).toEqual([
      {
        productCode: 301,
        description: "Produto A",
        brand: "Marca A",
        sector: "SETOR TESTE",
        quantity: 1,
        unitValue: 10,
        totalValue: 10,
      },
      {
        productCode: 302,
        description: "Produto B",
        brand: "Marca B",
        sector: "SETOR TESTE",
        quantity: 2,
        unitValue: 20,
        totalValue: 40,
      },
    ]);
  });

  it.each(["-1", "1.5", "0"])("rejects an invalid product code %s", (code) => {
    expect(() => adaptOrdersCsv(ordersCsv.replace('"301"', `"${code}"`))).toThrow(
      /Código Produto/,
    );
  });

  it("keeps the same document in separate sales when organization or date changes", () => {
    const lines = ordersCsv.trim().split("\n");
    const secondRow = lines[2]
      .replace('"28/07/2026"', '"29/07/2026"')
      .replace('"1","Empresa Teste"', '"2","Outra Empresa"');

    expect(adaptOrdersCsv([lines[0], lines[1], secondRow].join("\n"))).toHaveLength(2);
  });

  it("normalizes juridical customers and affirmative cancellation values", () => {
    const csv = ordersCsv
      .replaceAll('"FÍSICA"', '"JURÍDICA"')
      .replaceAll('"Não"', '"Sim"');

    expect(adaptOrdersCsv(csv)[0]).toMatchObject({
      cancelled: true,
      customer: { personType: "JURIDICA" },
    });
  });

  it.each([
    ["natureOperation", '"VENDA"', '"DEVOLUÇÃO"'],
    ["operationType", '"S"', '"E"'],
    ["operationalOrigin", '"LOJA"', '"SITE"'],
    ["cancelled", '"Não"', '"Sim"'],
    ["customer.externalCode", '"101"', '"102"'],
    ["customer.name", '"Cliente Teste"', '"Outro Cliente"'],
    ["customer.personType", '"FÍSICA"', '"JURÍDICA"'],
    ["seller", '"201 - Vendedor Teste"', '"202 - Outra Vendedora"'],
    ["paymentLabel", '"PIX"', '"DINHEIRO"'],
  ])("rejects a conflicting %s in another line of the same sale", (field, from, to) => {
    const lines = ordersCsv.trim().split("\n");
    const conflictingRow = lines[2].replace(from, to);

    expect(() => adaptOrdersCsv([lines[0], lines[1], conflictingRow].join("\n"))).toThrow(
      new RegExp(`linha 3.*${field}`),
    );
  });

  it("maps a sale without both customer fields to a null customer", () => {
    const csv = ordersCsv
      .replaceAll('"Cliente Teste"', '""')
      .replaceAll('"101"', '""');

    expect(adaptOrdersCsv(csv)[0].customer).toBeNull();
  });

  it.each([
    ["missing customer code", '"101"', '""'],
    ["missing customer name", '"Cliente Teste"', '""'],
    ["non-numeric customer code", '"101"', '"cliente-inválido"'],
  ])("rejects a %s", (_case, from, to) => {
    expect(() => adaptOrdersCsv(ordersCsv.replaceAll(from, to))).toThrow(/Cliente/);
  });

  it("preserves a seller without a numeric prefix as a canonical seller without external code", () => {
    const csv = ordersCsv.replaceAll('"201 - Vendedor Teste"', '"Maria"');

    expect(adaptOrdersCsv(csv)[0].seller).toEqual({ externalCode: null, name: "Maria" });
  });

  it("accepts a seller code only with the strict numeric separator and a non-empty name", () => {
    const csv = ordersCsv.replaceAll('"201 - Vendedor Teste"', '" 201 - Maria "');

    expect(adaptOrdersCsv(csv)[0].seller).toEqual({ externalCode: 201, name: "Maria" });
  });

  it.each([
    ["a non-numeric seller prefix", '"abc - Maria"'],
    ["an empty seller", '""'],
  ])("rejects %s", (_case, seller) => {
    expect(() => adaptOrdersCsv(ordersCsv.replaceAll('"201 - Vendedor Teste"', seller))).toThrow(
      /Vendedor/,
    );
  });

  it.each([
    ["a missing space before the separator", '"201- Maria"'],
    ["a missing seller name", '"201 -"'],
    ["a missing numeric prefix", '"- Maria"'],
    ["an em-dash separator", '"201 — Maria"'],
    ["an isolated numeric prefix", '"201"'],
  ])("rejects a malformed seller with %s", (_case, seller) => {
    expect(() => adaptOrdersCsv(ordersCsv.replaceAll('"201 - Vendedor Teste"', seller))).toThrow(
      /Vendedor/,
    );
  });

  it("maps the semicolon origin file and strips the /0 suffix from the document", () => {
    const csv = readFileSync("src/tests/fixtures/csv/origens-validas.csv", "utf8");

    expect(adaptOriginCsv(csv)).toEqual([
      {
        organizationExternalCode: 1,
        date: new Date(2026, 6, 28),
        documentNumber: "9001",
        commercialOrigin: "Google",
      },
    ]);
  });

  it("keeps the historical fallback for a blank commercial origin", () => {
    const csv = readFileSync("src/tests/fixtures/csv/origens-validas.csv", "utf8").replace(
      ";Google",
      ";",
    );

    expect(adaptOriginCsv(csv)[0].commercialOrigin).toBe("Desconhecido");
  });

  it("rejects an origin document whose /0 suffix leaves no document number", () => {
    const csv = readFileSync("src/tests/fixtures/csv/origens-validas.csv", "utf8").replace(
      "9001/0",
      "/0",
    );

    expect(() => adaptOriginCsv(csv)).toThrow(/Documento\/ECF/);
  });

  it("rejects order CSVs with missing required headers", () => {
    const csv = ordersCsv.replace('"Documento",', "");

    expect(() => adaptOrdersCsv(csv)).toThrow(/Cabeçalhos obrigatórios ausentes: Documento/);
  });

  it("rejects malformed CSV content instead of silently accepting parse errors", () => {
    const csv = `${ORDER_CSV_HEADERS.join(",")}\n"28/07/2026","1`;

    expect(() => adaptOrdersCsv(csv)).toThrow(/Erro ao processar CSV/);
  });

  it("normalizes BOM, quotes and surrounding whitespace in order and origin headers", () => {
    const [orderHeader, ...orderRows] = ordersCsv.trim().split("\n");
    const spacedOrders = `\uFEFF${orderHeader.replaceAll('","', '" , "')}\n${orderRows.join("\n")}`;
    const spacedOrigins =
      '\uFEFF" Empresa ";" Data ";" Documento/ECF ";" Resposta "\nJD INFO - DOMINUS;28/07/2026;9001/0;Google';
    expect(adaptOrdersCsv(spacedOrders)).toHaveLength(1);
    expect(adaptOriginCsv(spacedOrigins)[0]).toMatchObject({
      documentNumber: "9001",
      commercialOrigin: "Google",
    });
  });
});
