import "server-only";
import { z } from "zod";
import type {
  AccountSpend,
  MarketingSpendRange,
} from "@/services/marketing-spend/types";
import type { MetaAdsConfig } from "./config";

const metadataSchema = z.object({
  id: z.string(),
  currency: z.string(),
  timezone_name: z.string(),
});

const insightsSchema = z.object({
  data: z.array(z.object({
    spend: z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d+)?$/u),
    date_start: z.string(),
    date_stop: z.string(),
  })).max(1),
});

export function normalizeMetaAdAccountId(value: string) {
  const normalized = value.replace(/^act_/u, "");
  if (!/^\d+$/u.test(normalized)) {
    throw new Error("ID da conta Meta inválido.");
  }
  return normalized;
}

function validateMetaSpend(
  metadataValue: unknown,
  insightsValue: unknown,
  accountId: string,
  range: MarketingSpendRange,
): AccountSpend {
  const metadata = metadataSchema.parse(metadataValue);
  const insights = insightsSchema.parse(insightsValue);

  if (metadata.id !== `act_${accountId}`) {
    throw new Error("Conta Meta inesperada.");
  }
  if (metadata.currency !== "BRL") {
    throw new Error("Moeda da conta Meta inválida.");
  }
  if (metadata.timezone_name !== "America/Sao_Paulo") {
    throw new Error("Fuso horário da conta Meta inválido.");
  }

  const row = insights.data[0];
  if (!row) return { amount: "0", currency: "BRL" };
  if (
    row.date_start !== range.startDate ||
    row.date_stop !== range.endDate
  ) {
    throw new Error("Período retornado pelo Meta é inválido.");
  }
  return { amount: row.spend, currency: "BRL" };
}

export function createMetaAdsClient(
  config: MetaAdsConfig,
  deps: { fetch: typeof fetch } = { fetch: globalThis.fetch },
) {
  const accountId = normalizeMetaAdAccountId(config.accountId);

  async function request(path: string, params: Record<string, string>) {
    const search = new URLSearchParams({
      ...params,
      access_token: config.accessToken,
    });
    const response = await deps.fetch(
      `https://graph.facebook.com/${config.apiVersion}/${path}?${search}`,
    );
    if (!response.ok) {
      throw new Error(
        `Não foi possível consultar o Meta Ads (HTTP ${response.status}).`,
      );
    }
    return response.json() as Promise<unknown>;
  }

  return {
    async readAccountSpend(range: MarketingSpendRange): Promise<AccountSpend> {
      const [metadata, insights] = await Promise.all([
        request(`act_${accountId}`, {
          fields: "id,currency,timezone_name",
        }),
        request(`act_${accountId}/insights`, {
          fields: "spend,date_start,date_stop",
          level: "account",
          time_range: JSON.stringify({
            since: range.startDate,
            until: range.endDate,
          }),
        }),
      ]);
      return validateMetaSpend(metadata, insights, accountId, range);
    },
  };
}
