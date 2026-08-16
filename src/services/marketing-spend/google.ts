import "server-only";
import { GoogleAdsApi } from "google-ads-api";
import {
  resolveGoogleAdsAccount,
  type GoogleAdsScope,
} from "@/lib/google-ads-account";
import { getAuthenticatedClient } from "@/lib/google-authenticated-client";
import type {
  AccountSpend,
  MarketingSpendRange,
} from "./types";

function normalizeCustomerId(value: string) {
  return value.replaceAll(/\D/gu, "");
}

function toMicros(value: unknown) {
  if (typeof value === "bigint" && value >= 0n) return value;
  if (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  ) {
    return BigInt(value);
  }
  if (typeof value === "string" && /^\d+$/u.test(value)) {
    return BigInt(value);
  }
  throw new Error("Custo Google Ads inválido.");
}

export function microsToDecimal(micros: bigint) {
  const whole = micros / 1_000_000n;
  const fraction = String(micros % 1_000_000n).padStart(6, "0");
  return `${whole}.${fraction}`;
}

export async function readGoogleAccountSpend(
  scope: GoogleAdsScope,
  range: MarketingSpendRange,
): Promise<AccountSpend> {
  const organizationId = process.env.JD_CENTRO_ID;
  if (!organizationId) {
    throw new Error("JD_CENTRO_ID não configurado");
  }

  const { refreshToken } = await getAuthenticatedClient(organizationId);
  const { customerId, managerId } = resolveGoogleAdsAccount(scope);
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
  });
  const customer = client.Customer({
    customer_id: normalizeCustomerId(customerId),
    refresh_token: refreshToken,
    login_customer_id: managerId
      ? normalizeCustomerId(managerId)
      : undefined,
  });
  const rows = await customer.report({
    entity: "customer",
    metrics: ["metrics.cost_micros"],
    from_date: range.startDate,
    to_date: range.endDate,
  });

  let total = 0n;
  for (const row of rows) {
    total += toMicros(row.metrics?.cost_micros);
  }
  return { amount: microsToDecimal(total), currency: "BRL" };
}
