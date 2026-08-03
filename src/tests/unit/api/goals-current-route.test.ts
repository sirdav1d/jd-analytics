import { afterEach, beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  salesGoalFindMany: vi.fn(),
  pedidoFindMany: vi.fn(),
  roasGoalFindFirst: vi.fn(),
  getMarketingReportAggregate: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    salesGoal: { findMany: mocks.salesGoalFindMany },
    pedido: { findMany: mocks.pedidoFindMany },
    roasGoal: { findFirst: mocks.roasGoalFindFirst },
  },
}));

vi.mock("@/services/marketing-report/get-marketing-report-aggregate", () => ({
  getMarketingReportAggregate: mocks.getMarketingReportAggregate,
}));

import { GET } from "@/app/api/services/data-services/goals-current/route";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-03T15:00:00.000Z"));
  mocks.salesGoalFindMany.mockResolvedValue([]);
  mocks.pedidoFindMany.mockResolvedValue([]);
  mocks.roasGoalFindFirst.mockResolvedValue(null);
  mocks.getMarketingReportAggregate.mockResolvedValue({
    ok: false,
    data: null,
    error: "Nenhum investimento META encontrado para o mes 2026-08-01",
  });
});

afterEach(() => {
  vi.useRealTimers();
});

test("uses São Paulo's current civil day for August goals, orders, and ROAS", async () => {
  const response = await GET();

  expect(response.status).toBe(200);
  expect(mocks.salesGoalFindMany).toHaveBeenCalledWith({
    where: {
      goalDateRef: {
        gte: new Date("2026-08-01T00:00:00.000Z"),
        lt: new Date("2026-09-01T00:00:00.000Z"),
      },
    },
  });
  expect(mocks.roasGoalFindFirst).toHaveBeenCalledWith({
    where: {
      goalDateRef: {
        gte: new Date("2026-08-01T00:00:00.000Z"),
        lt: new Date("2026-09-01T00:00:00.000Z"),
      },
    },
  });
  expect(mocks.pedidoFindMany).toHaveBeenCalledWith({
    where: {
      data_pedido: {
        gte: new Date("2026-08-01T00:00:00.000Z"),
        lte: new Date("2026-08-03T00:00:00.000Z"),
      },
      cancelled: false,
    },
    include: { items: true },
  });
  expect(mocks.getMarketingReportAggregate).toHaveBeenCalledWith({
    date: "2026-08-03",
  });
  await expect(response.json()).resolves.toMatchObject({
    ok: true,
    data: { roas: { currentRoas: 0 } },
  });
});

test("does not advance the business date before São Paulo midnight", async () => {
  vi.setSystemTime(new Date("2026-08-03T02:30:00.000Z"));

  await GET();

  expect(mocks.pedidoFindMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        data_pedido: expect.objectContaining({
          lte: new Date("2026-08-02T00:00:00.000Z"),
        }),
      }),
    }),
  );
  expect(mocks.getMarketingReportAggregate).toHaveBeenCalledWith({
    date: "2026-08-02",
  });
});
