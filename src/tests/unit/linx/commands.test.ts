import { describe, expect, it } from "vitest";
import {
  customerByCodeCommand,
  movementCommand,
  movementPlansCommand,
  movementPrincipalCommand,
  productByCodeCommand,
  routineOriginCommand,
  salesResponseCommand,
  sellerByCodeCommand,
  storeGroupCommand,
  storesCommand,
} from "@/services/linx/commands";

describe("Linx commands", () => {
  it("uses timestamp-only filtering for incremental movements", () => {
    expect(movementCommand({
      cnpj: "00000000000000",
      timestamp: BigInt(123),
      mode: "incremental",
    })).toEqual({
      name: "LinxMovimento",
      keyParameter: "chave",
      parameters: {
        cnpjEmp: "00000000000000",
        timestamp: BigInt(123),
        data_inicial: "NULL",
        data_fim: "NULL",
        filtra_somente_timestamp: 1,
      },
    });
  });

  it("uses the supplied reconciliation window", () => {
    expect(movementCommand({
      cnpj: "00000000000000",
      timestamp: BigInt(0),
      mode: "reconciliation",
      from: "2026-06-29",
      to: "2026-07-29",
    })).toEqual({
      name: "LinxMovimento",
      keyParameter: "chave",
      parameters: {
        cnpjEmp: "00000000000000",
        timestamp: BigInt(0),
        data_inicial: "2026-06-29",
        data_fim: "2026-07-29",
      },
    });
  });

  it("filters LinxMovimento point lookups by identifier", () => {
    expect(
      movementCommand({
        cnpj: "00000000000000",
        timestamp: BigInt(0),
        mode: "reconciliation",
        identifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
      }),
    ).toEqual({
      name: "LinxMovimento",
      keyParameter: "chave",
      parameters: {
        cnpjEmp: "00000000000000",
        timestamp: BigInt(0),
        data_inicial: "NULL",
        data_fim: "NULL",
        identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
      },
    });
  });

  it("uses the published parameter spellings for every auxiliary command", () => {
    expect(movementPlansCommand({ cnpj: "1", timestamp: BigInt(2), identifier: "id" })).toEqual({
      name: "LinxMovimentoPlanos", keyParameter: "chave",
      parameters: { cnpjEmp: "1", timestamp: BigInt(2), identificador: "id" },
    });
    expect(movementPrincipalCommand({ cnpj: "1", timestamp: BigInt(2), identifier: "id", limit: 10 })).toEqual({
      name: "LinxMovimentoPrincipal", keyParameter: "chave",
      parameters: { cnpjEmp: "1", timestamp: BigInt(2), identificador: "id", limite: 10 },
    });
    expect(routineOriginCommand({ cnpj: "1", timestamp: BigInt(2), routineCode: 3 })).toEqual({
      name: "LinxRotinaOrigem", keyParameter: "chave",
      parameters: { cnpjEmp: "1", timestamp: BigInt(2), codigo_rotina: 3 },
    });
    expect(salesResponseCommand({ cnpj: "1", timestamp: BigInt(2) })).toEqual({
      name: "LinxRespostaVenda", keyParameter: "chave",
      parameters: { cnpjEmp: "1", Timestamp: BigInt(2) },
    });
    expect(storeGroupCommand({ group: "JD", networkId: 4, portalId: 5 })).toEqual({
      name: "LinxGrupoLojas", keyParameter: "Chave",
      parameters: { Grupo: "JD", id_empresas_rede: 4, Portal: 5 },
    });
    expect(storesCommand({ cnpj: "1", timestamp: BigInt(2) })).toEqual({
      name: "LinxLojas", keyParameter: "chave", parameters: { cnpjEmp: "1", timestamp: BigInt(2) },
    });
    expect(customerByCodeCommand({ cnpj: "1", customerCode: 3 })).toEqual({
      name: "LinxClientesFornec", keyParameter: "chave",
      parameters: { cnpjEmp: "1", data_inicial: "NULL", data_fim: "NULL", cod_cliente: 3 },
    });
    expect(sellerByCodeCommand({ cnpj: "1", sellerCode: 3 })).toEqual({
      name: "LinxVendedores", keyParameter: "chave",
      parameters: { cnpjEmp: "1", cod_vendedor: 3, timestamp: BigInt(0) },
    });
    expect(productByCodeCommand({ cnpj: "1", productCode: 3, from: "1900-01-01", to: "2026-07-29" })).toEqual({
      name: "LinxProdutos", keyParameter: "chave",
      parameters: { cnpjEmp: "1", dt_update_inicio: "1900-01-01", dt_update_fim: "2026-07-29", cod_produto: 3, timestamp: BigInt(0) },
    });
  });
});
