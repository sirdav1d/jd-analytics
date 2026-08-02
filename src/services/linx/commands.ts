import type { LinxCommand, LinxParameterValue } from "./types";

type CommandInput = Omit<LinxCommand, "parameters"> & { parameters: Record<string, LinxParameterValue | undefined> };

function command(input: CommandInput): LinxCommand {
  return {
    name: input.name,
    keyParameter: input.keyParameter,
    parameters: Object.fromEntries(
      Object.entries(input.parameters).filter(([, value]) => value !== undefined),
    ) as Record<string, LinxParameterValue>,
  };
}

export function movementCommand(input: {
  cnpj: string;
  timestamp: bigint;
  mode: "incremental" | "reconciliation";
  from?: string;
  to?: string;
  identifier?: string;
}): LinxCommand {
  return command({
    name: "LinxMovimento",
    keyParameter: "chave",
    parameters: {
      cnpjEmp: input.cnpj,
      timestamp: input.timestamp,
      data_inicial: input.from ?? "NULL",
      data_fim: input.to ?? "NULL",
      filtra_somente_timestamp: input.mode === "incremental" ? 1 : undefined,
      identificador: input.identifier,
    },
  });
}

export function movementPlansCommand(input: {
  cnpj: string;
  timestamp: bigint;
  from?: string;
  to?: string;
  identifier?: string;
}): LinxCommand {
  return command({ name: "LinxMovimentoPlanos", keyParameter: "chave", parameters: {
    cnpjEmp: input.cnpj, timestamp: input.timestamp, data_inicial: input.from, data_fim: input.to, identificador: input.identifier,
  } });
}

export function movementPrincipalCommand(input: {
  cnpj: string;
  timestamp: bigint;
  identifier?: string;
  limit?: number;
}): LinxCommand {
  return command({ name: "LinxMovimentoPrincipal", keyParameter: "chave", parameters: {
    cnpjEmp: input.cnpj, timestamp: input.timestamp, identificador: input.identifier, limite: input.limit,
  } });
}

export function routineOriginCommand(input: {
  cnpj: string;
  timestamp: bigint;
  routineCode?: number;
}): LinxCommand {
  return command({ name: "LinxRotinaOrigem", keyParameter: "chave", parameters: {
    cnpjEmp: input.cnpj, timestamp: input.timestamp, codigo_rotina: input.routineCode,
  } });
}

export function salesResponseCommand(input: { cnpj: string; timestamp: bigint }): LinxCommand {
  return command({ name: "LinxRespostaVenda", keyParameter: "chave", parameters: {
    cnpjEmp: input.cnpj, Timestamp: input.timestamp,
  } });
}

export function storeGroupCommand(input: { group?: string; networkId?: number; portalId?: number } = {}): LinxCommand {
  return command({ name: "LinxGrupoLojas", keyParameter: "Chave", parameters: {
    Grupo: input.group, id_empresas_rede: input.networkId, Portal: input.portalId,
  } });
}

export function storesCommand(input: { cnpj: string; timestamp?: bigint }): LinxCommand {
  return command({ name: "LinxLojas", keyParameter: "chave", parameters: { cnpjEmp: input.cnpj, timestamp: input.timestamp } });
}

export function customerByCodeCommand(input: { cnpj: string; customerCode: number }): LinxCommand {
  return command({ name: "LinxClientesFornec", keyParameter: "chave", parameters: {
    cnpjEmp: input.cnpj, data_inicial: "NULL", data_fim: "NULL", cod_cliente: input.customerCode,
  } });
}

export function sellerByCodeCommand(input: { cnpj: string; sellerCode: number }): LinxCommand {
  return command({ name: "LinxVendedores", keyParameter: "chave", parameters: {
    cnpjEmp: input.cnpj, cod_vendedor: input.sellerCode, timestamp: BigInt(0),
  } });
}

export function productByCodeCommand(input: { cnpj: string; productCode: number; from: string; to: string }): LinxCommand {
  return command({ name: "LinxProdutos", keyParameter: "chave", parameters: {
    cnpjEmp: input.cnpj, dt_update_inicio: input.from, dt_update_fim: input.to, cod_produto: input.productCode, timestamp: BigInt(0),
  } });
}
