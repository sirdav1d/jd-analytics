import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseLinxResponse } from "@/services/linx/xml";
import { LinxDataError } from "@/services/linx/errors";
import { mapCatalogs } from "@/services/linx/mappers/catalogs";
import { mapCommercialOrigins } from "@/services/linx/mappers/commercial-origin";
import { mapMovementRows } from "@/services/linx/mappers/movement";
import { combinePaymentLabels, mapPaymentLabels } from "@/services/linx/mappers/payment";
import { discoverStores } from "@/services/linx/store-discovery";
import type { LinxCommand, LinxResponse } from "@/services/linx/types";

const fixture = (name: string) => parseLinxResponse(readFileSync(`src/tests/fixtures/linx/${name}`, "utf8"));

describe("Linx mappers", () => {
  it("maps movements using v267 column names and preserves bigint and document zeros", () => {
    expect(mapMovementRows(fixture("movimento.xml").rows)).toEqual([expect.objectContaining({
      identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
      timestamp: BigInt(185318313),
      documentNumber: "000123",
      unitValue: 10.5,
      operationalOriginCode: 7,
    })]);
  });

  it("fails the entire movement mapping when a required v267 field is missing", () => {
    expect(() => mapMovementRows([{ identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1" }])).toThrow(LinxDataError);
  });

  it("uses the stable transaction id as the item identity", () => {
    const row = fixture("movimento.xml").rows[0]!;

    expect(
      mapMovementRows([{ ...row, transacao: "42", ordem: null }])[0]
        ?.order,
    ).toBe(42);
  });

  it("deduplicates and orders payment descriptions deterministically", () => {
    expect(combinePaymentLabels([" PIX ", "Cartão", "PIX", ""])).toBe("Cartão, PIX");
    expect(mapPaymentLabels(fixture("movimento-planos.xml").rows).get("7c0ab11c-95b6-4e14-8186-bb5292198ff1")).toBe("Cartão, PIX");
  });

  it("keeps operational and commercial origins as distinct lookups", () => {
    const result = mapCommercialOrigins({
      movements: mapMovementRows(fixture("movimento.xml").rows),
      routineOrigins: fixture("rotina-origem.xml").rows,
      principals: fixture("movimento-principal.xml").rows,
      salesResponses: fixture("resposta-venda.xml").rows,
    });
    expect(result.get("7c0ab11c-95b6-4e14-8186-bb5292198ff1")).toEqual({
      operationalOrigin: "Venda presencial",
      commercialOrigin: "Google",
    });
  });

  it("maps point-looked-up catalog records", () => {
    expect(mapCatalogs({
      customers: [{ cod_cliente: "4", nome_cliente: "Ana", tipo_cliente: "F" }],
      sellers: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
      products: [{ cod_produto: "6", nome: "Produto", desc_marca: "Marca", desc_setor: "Setor" }],
    })).toEqual({
      customers: new Map([[4, { externalCode: 4, name: "Ana", personType: "FISICA" }]]),
      sellers: new Map([[5, { externalCode: 5, name: "Bia" }]]),
      products: new Map([[6, { productCode: 6, description: "Produto", brand: "Marca", sector: "Setor" }]]),
    });
  });

  it("falls back to the legal customer name when the display name is empty", () => {
    expect(
      mapCatalogs({
        customers: [
          {
            cod_cliente: "4",
            nome_cliente: null,
            razao_cliente: "Empresa JD",
            tipo_cliente: "J",
          },
        ],
        sellers: [],
        products: [],
      }).customers.get(4),
    ).toEqual({
      externalCode: 4,
      name: "Empresa JD",
      personType: "JURIDICA",
    });
  });

  it("ignores group rows without CNPJ and only calls LinxLojas to fill missing identifiers", async () => {
    const group = fixture("grupo-lojas.xml");
    group.rows.unshift({
      CNPJ: null,
      nome_empresa: "Grupo JD",
      portal: "19972",
      empresa: "3",
    });
    const details: LinxResponse = {
      columns: ["portal", "empresa", "nome_emp", "cnpj_emp"],
      rows: [{ portal: "9", empresa: "8", nome_emp: "JD Norte", cnpj_emp: "22222222222222" }],
    };
    const commands: LinxCommand[] = [];
    const stores = await discoverStores({
      execute: async (command) => {
        commands.push(command);
        return command.name === "LinxGrupoLojas" ? group : details;
      },
    });

    expect(stores).toEqual([
      { cnpj: "11111111111111", name: "JD Centro", portalId: 1, companyId: 2 },
      { cnpj: "22222222222222", name: "JD Norte", portalId: 9, companyId: 8 },
    ]);
    expect(commands.map((command) => command.name)).toEqual(["LinxGrupoLojas", "LinxLojas"]);
  });
});
