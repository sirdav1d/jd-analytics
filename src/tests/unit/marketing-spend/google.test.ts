import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAuthenticatedClient: vi.fn(),
  resolveGoogleAdsAccount: vi.fn(),
  customer: vi.fn(),
  report: vi.fn(),
}));

vi.mock("@/lib/google-authenticated-client", () => ({
  getAuthenticatedClient: mocks.getAuthenticatedClient,
}));
vi.mock("@/lib/google-ads-account", () => ({
  resolveGoogleAdsAccount: mocks.resolveGoogleAdsAccount,
}));
vi.mock("google-ads-api", () => ({
  GoogleAdsApi: class {
    Customer = mocks.customer;
  },
}));

import { readGoogleAccountSpend } from "@/services/marketing-spend/google";

const range = {
  startDate: "2026-08-01",
  endDate: "2026-08-16",
};

beforeEach(() => {
  vi.stubEnv("JD_CENTRO_ID", "synthetic-organization");
  mocks.getAuthenticatedClient.mockResolvedValue({
    oauth2Client: {},
    refreshToken: `test-${"r".repeat(24)}`,
  });
  mocks.resolveGoogleAdsAccount.mockReturnValue({
    scope: "products",
    customerId: "123-456-7890",
    managerId: "111-222-3333",
  });
  mocks.customer.mockReturnValue({ report: mocks.report });
  mocks.report.mockResolvedValue([]);
});

describe("Google Ads account spend", () => {
  it.each([
    [{ startDate: "2026-8-01", endDate: "2026-08-16" }],
    [{ startDate: "2026-08-32", endDate: "2026-09-01" }],
    [{ startDate: "2026-08-16", endDate: "2026-08-01" }],
  ])("rejects an invalid report range before authentication", async (invalidRange) => {
    await expect(readGoogleAccountSpend("products", invalidRange)).rejects
      .toThrow("Intervalo de datas inválido");
    expect(mocks.getAuthenticatedClient).not.toHaveBeenCalled();
    expect(mocks.report).not.toHaveBeenCalled();
  });

  it("sums all integer micros without losing precision", async () => {
    mocks.report.mockResolvedValueOnce([
      { metrics: { cost_micros: 1_234_567 } },
      { metrics: { cost_micros: "2000001" } },
    ]);

    await expect(readGoogleAccountSpend("products", range)).resolves.toEqual({
      amount: "3.234568",
      currency: "BRL",
    });

    expect(mocks.report).toHaveBeenCalledWith({
      entity: "customer",
      metrics: ["metrics.cost_micros"],
      from_date: range.startDate,
      to_date: range.endDate,
    });
    expect(mocks.customer).toHaveBeenCalledWith(expect.objectContaining({
      customer_id: "1234567890",
      login_customer_id: "1112223333",
    }));
  });

  it("returns exact zero when there are no rows", async () => {
    await expect(readGoogleAccountSpend("services", range)).resolves.toEqual({
      amount: "0.000000",
      currency: "BRL",
    });
  });

  it.each([
    ["an unsafe number", Number.MAX_SAFE_INTEGER + 1],
    ["a decimal number", 1.5],
    ["a negative number", -1],
    ["a decimal string", "1.5"],
    ["a negative string", "-1"],
    ["a missing value", undefined],
  ])("rejects %s in cost_micros", async (_case, costMicros) => {
    mocks.report.mockResolvedValueOnce([
      { metrics: { cost_micros: costMicros } },
    ]);

    await expect(readGoogleAccountSpend("products", range)).rejects
      .toThrow("Custo Google Ads inválido.");
  });

  it("requires the existing Google organization setting", async () => {
    vi.stubEnv("JD_CENTRO_ID", "");

    await expect(readGoogleAccountSpend("products", range)).rejects
      .toThrow("JD_CENTRO_ID não configurado");
    expect(mocks.getAuthenticatedClient).not.toHaveBeenCalled();
  });

  it("fails safely when the Google report exceeds the request deadline", async () => {
    vi.useFakeTimers();
    try {
      mocks.report.mockReturnValueOnce(new Promise(() => {}));

      const result = expect(readGoogleAccountSpend("products", range)).rejects
        .toThrow("Tempo limite da consulta Google Ads excedido.");
      await vi.advanceTimersByTimeAsync(15_000);

      await result;
    } finally {
      vi.useRealTimers();
    }
  });
});
