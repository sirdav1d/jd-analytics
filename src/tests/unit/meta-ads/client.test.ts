import { describe, expect, it, vi } from "vitest";
import {
  createMetaAdsClient,
  normalizeMetaAdAccountId,
} from "@/services/meta-ads/client";

const syntheticAccountId = "123456789";
const syntheticToken = `test-${"x".repeat(24)}`;
const config = {
  accountId: syntheticAccountId,
  accessToken: syntheticToken,
  apiVersion: "v25.0" as const,
};
const range = {
  startDate: "2026-08-01",
  endDate: "2026-08-16",
};

function validMetadata() {
  return {
    id: `act_${syntheticAccountId}`,
    currency: "BRL",
    timezone_name: "America/Sao_Paulo",
  };
}

function validInsights() {
  return {
    data: [{
      spend: "1234.56",
      date_start: range.startDate,
      date_stop: range.endDate,
    }],
  };
}

function createFetch(
  metadata: unknown = validMetadata(),
  insights: unknown = validInsights(),
) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const isInsights = new URL(String(input)).pathname.endsWith("/insights");
    return new Response(JSON.stringify(isInsights ? insights : metadata), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
}

describe("Meta Ads account spend", () => {
  it.each([syntheticAccountId, `act_${syntheticAccountId}`])(
    "normalizes the account ID %s",
    (value) => {
      expect(normalizeMetaAdAccountId(value)).toBe(syntheticAccountId);
    },
  );

  it.each(["", "act_", "account-123", "act_act_123"])(
    "rejects invalid account ID %j",
    (value) => {
      expect(() => normalizeMetaAdAccountId(value)).toThrow(
        "ID da conta Meta inválido.",
      );
    },
  );

  it("reads BRL account spend for the exact inclusive range", async () => {
    const fetchMock = createFetch();
    const client = createMetaAdsClient(config, {
      fetch: fetchMock as unknown as typeof fetch,
    });

    await expect(client.readAccountSpend(range)).resolves.toEqual({
      amount: "1234.56",
      currency: "BRL",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const urls = fetchMock.mock.calls.map(([input]) => new URL(String(input)));
    const metadataUrl = urls.find((url) => !url.pathname.endsWith("/insights"));
    const insightsUrl = urls.find((url) => url.pathname.endsWith("/insights"));
    expect(metadataUrl?.pathname).toBe(`/v25.0/act_${syntheticAccountId}`);
    expect(metadataUrl?.searchParams.get("fields")).toBe(
      "id,currency,timezone_name",
    );
    expect(insightsUrl?.pathname).toBe(
      `/v25.0/act_${syntheticAccountId}/insights`,
    );
    expect(insightsUrl?.searchParams.get("fields")).toBe(
      "spend,date_start,date_stop",
    );
    expect(insightsUrl?.searchParams.get("level")).toBe("account");
    expect(JSON.parse(insightsUrl?.searchParams.get("time_range") ?? "null"))
      .toEqual({ since: range.startDate, until: range.endDate });
  });

  it("returns zero when Insights has no spend row", async () => {
    const client = createMetaAdsClient(config, {
      fetch: createFetch(validMetadata(), { data: [] }) as unknown as typeof fetch,
    });

    await expect(client.readAccountSpend(range)).resolves.toEqual({
      amount: "0",
      currency: "BRL",
    });
  });

  it.each([
    ["another account", { ...validMetadata(), id: "act_987654321" }],
    ["another currency", { ...validMetadata(), currency: "USD" }],
    ["another timezone", { ...validMetadata(), timezone_name: "UTC" }],
  ])("rejects metadata from %s", async (_case, metadata) => {
    const client = createMetaAdsClient(config, {
      fetch: createFetch(metadata) as unknown as typeof fetch,
    });

    await expect(client.readAccountSpend(range)).rejects.toBeInstanceOf(Error);
  });

  it("rejects more than one account-level Insights row", async () => {
    const row = validInsights().data[0];
    const client = createMetaAdsClient(config, {
      fetch: createFetch(validMetadata(), { data: [row, row] }) as unknown as typeof fetch,
    });

    await expect(client.readAccountSpend(range)).rejects.toBeInstanceOf(Error);
  });

  it.each([
    ["a different start", { ...validInsights().data[0], date_start: "2026-08-02" }],
    ["a different end", { ...validInsights().data[0], date_stop: "2026-08-15" }],
    ["negative spend", { ...validInsights().data[0], spend: "-1" }],
    ["malformed spend", { ...validInsights().data[0], spend: "12,34" }],
  ])("rejects Insights with %s", async (_case, row) => {
    const client = createMetaAdsClient(config, {
      fetch: createFetch(validMetadata(), { data: [row] }) as unknown as typeof fetch,
    });

    await expect(client.readAccountSpend(range)).rejects.toBeInstanceOf(Error);
  });

  it("does not expose the synthetic token on HTTP failure", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 500 }));
    const client = createMetaAdsClient(config, {
      fetch: fetchMock as unknown as typeof fetch,
    });

    const error = await client.readAccountSpend(range).catch((value) => value);

    expect(error).toBeInstanceOf(Error);
    expect(String(error)).toContain("HTTP 500");
    expect(String(error)).not.toContain(syntheticToken);
  });
});
