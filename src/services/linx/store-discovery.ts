import { z } from "zod";
import { storeGroupCommand, storesCommand } from "./commands";
import {
  integer,
  nullableInteger,
  nullableText,
  parseRows,
  text,
} from "./mappers/common";
import type { LinxCommand, LinxResponse } from "./types";

const storeGroupSchema = z.object({ CNPJ: nullableText, nome_empresa: text, portal: nullableInteger, empresa: nullableInteger });
const storeDetailsSchema = z.object({ cnpj_emp: text, nome_emp: text, portal: integer, empresa: integer });

export type DiscoveredStore = { cnpj: string; name: string; portalId: number | null; companyId: number | null };

export async function discoverStores(input: {
  execute: (command: LinxCommand) => Promise<LinxResponse>;
  group?: string;
  networkId?: number;
  portalId?: number;
}): Promise<DiscoveredStore[]> {
  const groups = parseRows(storeGroupSchema, (await input.execute(storeGroupCommand(input))).rows);
  const discovered: DiscoveredStore[] = [];
  for (const group of groups) {
    if (group.CNPJ === null) continue;
    let portalId = group.portal;
    let companyId = group.empresa;
    let name = group.nome_empresa;
    if (portalId === null || companyId === null) {
      const details = parseRows(storeDetailsSchema, (await input.execute(storesCommand({ cnpj: group.CNPJ }))).rows);
      const store = details.find((row) => row.cnpj_emp === group.CNPJ);
      if (store) {
        portalId = store.portal;
        companyId = store.empresa;
        name = store.nome_emp;
      }
    }
    discovered.push({ cnpj: group.CNPJ, name, portalId, companyId });
  }
  return discovered;
}
