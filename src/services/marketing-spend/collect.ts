import "server-only";
import { createMetaAdsClient } from "@/services/meta-ads/client";
import { readMetaAdsConfig } from "@/services/meta-ads/config";
import { readGoogleAccountSpend } from "./google";
import type {
  AccountSpend,
  MarketingSpendBatch,
  MarketingSpendRange,
  MediaSource,
} from "./types";

export const SAFE_MEDIA_ERRORS = {
  META: "Não foi possível consultar o investimento Meta.",
  GOOGLE_PRODUCTS:
    "Não foi possível consultar o investimento Google Produtos.",
  GOOGLE_SERVICES:
    "Não foi possível consultar o investimento Google Serviços.",
} as const;

type MarketingSpendDependencies = {
  now(): number;
  readMeta(): Promise<AccountSpend>;
  readGoogleProducts(): Promise<AccountSpend>;
  readGoogleServices(): Promise<AccountSpend>;
};

export async function collectMarketingSpend(
  _range: MarketingSpendRange,
  deps: MarketingSpendDependencies,
): Promise<MarketingSpendBatch> {
  const entries = [
    ["META", deps.readMeta] as const,
    ["GOOGLE_PRODUCTS", deps.readGoogleProducts] as const,
    ["GOOGLE_SERVICES", deps.readGoogleServices] as const,
  ].map(([source, read]) => ({
    source,
    startedAt: deps.now(),
    promise: read(),
  }));
  const settled = await Promise.allSettled(
    entries.map((entry) => entry.promise),
  );
  const results = Object.fromEntries(
    settled.map((outcome, index) => {
      const { source, startedAt } = entries[index];
      const durationMs = Math.max(0, deps.now() - startedAt);
      return outcome.status === "fulfilled"
        ? [
            source,
            {
              status: "SUCCESS" as const,
              durationMs,
              amount: outcome.value.amount,
            },
          ]
        : [
            source,
            {
              status: "FAILED" as const,
              durationMs,
              error: SAFE_MEDIA_ERRORS[source],
            },
          ];
    }),
  ) as MarketingSpendBatch["results"];

  if (!Object.values(results).every((value) => value.status === "SUCCESS")) {
    return { results, values: null };
  }

  const amount = (source: MediaSource) => {
    const result = results[source];
    if (result.status !== "SUCCESS") {
      throw new Error("Resultado de mídia incompleto.");
    }
    return result.amount;
  };
  return {
    results,
    values: {
      metaInvestment: amount("META"),
      googleProductsInvestment: amount("GOOGLE_PRODUCTS"),
      googleServicesInvestment: amount("GOOGLE_SERVICES"),
      currency: "BRL",
    },
  };
}

export function collectCurrentMarketingSpend(range: MarketingSpendRange) {
  return collectMarketingSpend(range, {
    now: () => Date.now(),
    readMeta: () =>
      createMetaAdsClient(readMetaAdsConfig()).readAccountSpend(range),
    readGoogleProducts: () => readGoogleAccountSpend("products", range),
    readGoogleServices: () => readGoogleAccountSpend("services", range),
  });
}
