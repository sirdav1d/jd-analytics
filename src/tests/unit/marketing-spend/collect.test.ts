import { describe, expect, it, vi } from "vitest";
import { collectMarketingSpend } from "@/services/marketing-spend/collect";

const range = {
  startDate: "2026-08-01",
  endDate: "2026-08-16",
};

describe("marketing spend collection", () => {
  it("withholds every value when one provider fails", async () => {
    const privateMarker = ["private", "test", "marker"].join("-");
    const result = await collectMarketingSpend(range, {
      now: () => 0,
      readMeta: vi.fn().mockRejectedValue(new Error(privateMarker)),
      readGoogleProducts: vi.fn().mockResolvedValue({
        amount: "2.000000",
        currency: "BRL",
      }),
      readGoogleServices: vi.fn().mockResolvedValue({
        amount: "3.000000",
        currency: "BRL",
      }),
    });

    expect(result.values).toBeNull();
    expect(result.results).toEqual({
      META: {
        status: "FAILED",
        durationMs: 0,
        error: "Não foi possível consultar o investimento Meta.",
      },
      GOOGLE_PRODUCTS: {
        status: "SUCCESS",
        durationMs: 0,
        amount: "2.000000",
      },
      GOOGLE_SERVICES: {
        status: "SUCCESS",
        durationMs: 0,
        amount: "3.000000",
      },
    });
    expect(JSON.stringify(result)).not.toContain(privateMarker);
  });

  it("returns all three exact values after complete success", async () => {
    const result = await collectMarketingSpend(range, {
      now: () => 10,
      readMeta: vi.fn().mockResolvedValue({ amount: "1.25", currency: "BRL" }),
      readGoogleProducts: vi.fn().mockResolvedValue({
        amount: "2.000001",
        currency: "BRL",
      }),
      readGoogleServices: vi.fn().mockResolvedValue({
        amount: "3.400000",
        currency: "BRL",
      }),
    });

    expect(result.values).toEqual({
      metaInvestment: "1.25",
      googleProductsInvestment: "2.000001",
      googleServicesInvestment: "3.400000",
      currency: "BRL",
    });
    expect(Object.values(result.results).every(
      (source) => source.status === "SUCCESS",
    )).toBe(true);
  });
});
