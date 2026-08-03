import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  pedidoGroupBy: vi.fn(),
  userFindUnique: vi.fn(),
  saleItemAggregate: vi.fn(),
  salesGoalAggregate: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pedido: { groupBy: mocks.pedidoGroupBy },
    user: { findUnique: mocks.userFindUnique },
    saleItem: { aggregate: mocks.saleItemAggregate },
    salesGoal: { aggregate: mocks.salesGoalAggregate },
    $queryRaw: mocks.queryRaw,
  },
}));

import { GET } from "@/app/api/services/data-services/tracking-goal/route";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-01T15:00:00.000Z"));
  mocks.pedidoGroupBy.mockResolvedValue([
    { userId: "manager-who-sells", _count: { id: 3 } },
  ]);
  mocks.userFindUnique.mockResolvedValue({
    name: "Gestor vendedor",
    role: "MANAGER",
  });
  mocks.saleItemAggregate.mockResolvedValue({ _sum: { totalValue: 266 } });
  mocks.salesGoalAggregate.mockResolvedValue({ _sum: { revenue: 300000 } });
  mocks.queryRaw.mockImplementation(async (query: { values?: unknown[] }) => {
    const values = query.values ?? [];
    if (values.includes("2026-08-01")) {
      return [{ period: "2026-08-01", revenue: 266 }];
    }
    if (values.includes("2026-07-31")) {
      return [{ period: "2026-07-31", revenue: 100 }];
    }
    return [];
  });
});

afterEach(() => {
  vi.useRealTimers();
});

test("keeps valid Linx sellers in goal charts regardless of their login role", async () => {
  const response = await GET(
    new NextRequest(
      "http://localhost/api/services/data-services/tracking-goal?startDate=2026-08-01&endDate=2026-08-01",
    ),
  );

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.overview).toEqual([
    {
      vendedor: "Gestor vendedor",
      totalRevenue: 266,
      meta: 300000,
      orderCount: 3,
      avgTicket: 88.66666666666667,
      forecast: expect.any(Number),
      percentualDif: expect.any(Number),
    },
  ]);
  expect(body.timeSeries).toEqual([
    { period: "2026-08-01", revenue: 266 },
  ]);
  expect(body.companySummary.realizado).toBe(266);
  expect(body.companySummary.forecast).toBe(8246);
  expect(body.companySummary.diffPercent).toBeCloseTo(2.7486666667);
});

test("does not mix the current-month forecast into a historical filter", async () => {
  mocks.pedidoGroupBy.mockResolvedValue([
    { userId: "manager-who-sells", _count: { id: 2 } },
  ]);
  mocks.saleItemAggregate.mockResolvedValue({ _sum: { totalValue: 100 } });
  mocks.salesGoalAggregate.mockResolvedValue({ _sum: { revenue: 1000 } });

  const response = await GET(
    new NextRequest(
      "http://localhost/api/services/data-services/tracking-goal?startDate=2026-07-31&endDate=2026-07-31",
    ),
  );

  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.overview[0].forecast).toBe(100);
  expect(body.overview[0].percentualDif).toBe(10);
  expect(body.companySummary).toEqual({
    meta: 1000,
    realizado: 100,
    forecast: 100,
    diffPercent: 10,
  });
});
