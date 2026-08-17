import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  metaFindFirst: vi.fn(),
  revenueAggregate: vi.fn(),
  readGoogleAccountSpend: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    metaInvestment: { findFirst: mocks.metaFindFirst },
    saleItem: { aggregate: mocks.revenueAggregate },
  },
}));
vi.mock("@/services/marketing-spend/google", () => ({
  readGoogleAccountSpend: mocks.readGoogleAccountSpend,
}));

import { getMarketingReportAggregate } from "@/services/marketing-report/get-marketing-report-aggregate";

beforeEach(() => {
  mocks.metaFindFirst.mockResolvedValue({
    id: "synthetic-investment",
    periodStart: new Date("2026-08-01T00:00:00.000Z"),
    periodEnd: new Date("2026-08-16T00:00:00.000Z"),
    totalInvestment: 100,
    lastSyncAt: new Date("2026-08-16T22:00:00.000Z"),
  });
  mocks.revenueAggregate.mockResolvedValue({ _sum: { totalValue: 1400 } });
  mocks.readGoogleAccountSpend.mockImplementation(async (scope: string) => ({
    amount: scope === "products" ? "200.000000" : "50.000000",
    currency: "BRL",
  }));
});

describe("marketing report aggregation", () => {
  it("uses live costs from both Google accounts for the Meta cutoff", async () => {
    const result = await getMarketingReportAggregate();

    expect(result).toMatchObject({
      ok: true,
      data: {
        periodStart: "2026-08-01",
        periodEnd: "2026-08-16",
        investments: {
          meta: 100,
          googleCentroProdutos: 200,
          googleIcaraiServicos: 50,
        },
        custoTotal: 350,
        faturamentoTotal: 1400,
        roasGeral: 4,
      },
    });
    expect(mocks.readGoogleAccountSpend.mock.calls).toEqual([
      ["products", { startDate: "2026-08-01", endDate: "2026-08-16" }],
      ["services", { startDate: "2026-08-01", endDate: "2026-08-16" }],
    ]);
    expect(mocks.revenueAggregate).toHaveBeenCalledWith({
      _sum: { totalValue: true },
      where: {
        sale: {
          data_pedido: {
            gte: new Date("2026-08-01T00:00:00.000Z"),
            lte: new Date("2026-08-16T00:00:00.000Z"),
          },
          OR: [
            { Origin: { name: { contains: "google", mode: "insensitive" } } },
            { Origin: { name: { contains: "meta", mode: "insensitive" } } },
          ],
        },
      },
    });
  });
});
