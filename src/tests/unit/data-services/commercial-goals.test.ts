import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  salesGoalFindMany: vi.fn(),
  salesGoalAggregate: vi.fn(),
  saleItemAggregate: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAdmin: mocks.requireAdmin,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    salesGoal: {
      findMany: mocks.salesGoalFindMany,
      aggregate: mocks.salesGoalAggregate,
    },
    saleItem: { aggregate: mocks.saleItemAggregate },
    $queryRaw: mocks.queryRaw,
  },
}));

import { FetchGoalTargetData } from "@/services/data-services/get-goal-target";

describe("commercial goals data service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-02T01:30:00.000Z"));

    mocks.requireAdmin.mockResolvedValue({ id: "admin" });
    mocks.salesGoalAggregate.mockResolvedValue({ _sum: { revenue: 0 } });
    mocks.saleItemAggregate.mockResolvedValue({ _sum: { totalValue: 0 } });
    mocks.salesGoalFindMany.mockResolvedValue([
      {
        id: "goal-alice-july",
        userId: "alice",
        goalDateRef: new Date("2026-07-01T00:00:00.000Z"),
        revenue: 80,
        seller: { id: "alice", name: "Alice" },
      },
      {
        id: "goal-alice-august",
        userId: "alice",
        goalDateRef: new Date("2026-08-01T00:00:00.000Z"),
        revenue: 100,
        seller: { id: "alice", name: "Alice" },
      },
      {
        id: "goal-bob-august",
        userId: "bob",
        goalDateRef: new Date("2026-08-01T00:00:00.000Z"),
        revenue: 200,
        seller: { id: "bob", name: "Bob" },
      },
    ]);
    mocks.queryRaw.mockResolvedValue([
      { userId: "alice", month: "2026-07", realized: 70 },
      { userId: "alice", month: "2026-08", realized: 40 },
      { userId: "bob", month: "2026-08", realized: 50 },
      { userId: "active-user-without-goal", month: "2026-08", realized: 10 },
    ]);
  });

  test("builds company, current and historical goals with one goals read and one monthly sales aggregation", async () => {
    const result = await FetchGoalTargetData();

    expect(mocks.salesGoalFindMany).toHaveBeenCalledTimes(1);
    expect(mocks.salesGoalFindMany).toHaveBeenCalledWith({
      where: {
        goalDateRef: { lt: new Date("2026-09-01T00:00:00.000Z") },
        seller: { isActive: true },
      },
      include: { seller: { select: { id: true, name: true } } },
      orderBy: [{ goalDateRef: "asc" }, { userId: "asc" }],
    });
    expect(mocks.queryRaw).toHaveBeenCalledTimes(1);
    expect(mocks.queryRaw.mock.calls[0][0].values).toEqual([
      "2026-07-01",
      "2026-09-01",
    ]);
    expect(mocks.salesGoalAggregate).not.toHaveBeenCalled();
    expect(mocks.saleItemAggregate).not.toHaveBeenCalled();

    expect(result).toEqual({
      ok: true,
      error: null,
      companyGoal: {
        meta: 300,
        realized: 100,
        remaining: 200,
        predicted: 3100,
      },
      currentGoals: [
        {
          goalId: "goal-alice-august",
          sellerId: "alice",
          sellerName: "Alice",
          monthRef: "2026-08-01T00:00:00.000Z",
          revenue: 100,
          realized: 40,
        },
        {
          goalId: "goal-bob-august",
          sellerId: "bob",
          sellerName: "Bob",
          monthRef: "2026-08-01T00:00:00.000Z",
          revenue: 200,
          realized: 50,
        },
      ],
      history: [
        {
          month: "2026-07-01T00:00:00.000Z",
          goals: [
            {
              sellerId: "alice",
              sellerName: "Alice",
              revenue: 80,
              month: "2026-07",
              realized: 70,
            },
          ],
        },
        {
          month: "2026-08-01T00:00:00.000Z",
          goals: [
            {
              sellerId: "alice",
              sellerName: "Alice",
              revenue: 100,
              month: "2026-08",
              realized: 40,
            },
            {
              sellerId: "bob",
              sellerName: "Bob",
              revenue: 200,
              month: "2026-08",
              realized: 50,
            },
          ],
        },
      ],
    });
  });
});
