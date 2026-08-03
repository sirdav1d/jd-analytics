import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  queryRaw: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { $queryRaw: mocks.queryRaw },
}));

import { GET } from "@/app/api/services/data-services/comercial-sales-by/route";

beforeEach(() => {
  const responses = [
    [{ person_type: "FISICA", revenue: "266" }],
    [{ sector: "GERAL", revenue: "266" }],
    [{ method: "PIX", revenue: "266" }],
    [{ tipo: "Produto", revenue: "266" }],
    [{ revenue: "100", clients: 1 }],
    [{ revenue: "166", clients: 2 }],
    [{ label: "2026-08-01", revenue: "266" }],
  ];

  mocks.queryRaw.mockImplementation(async (query: { values: unknown[] }) => {
    const usesCivilDateBoundaries =
      query.values.filter((value) => value === "2026-08-01").length >= 2;
    return usesCivilDateBoundaries ? responses.shift() ?? [] : [];
  });
});

test("returns every commercial chart series without shifting a DATE column by timezone", async () => {
  const response = await GET(
    new NextRequest(
      "http://localhost/api/services/data-services/comercial-sales-by?startDate=2026-08-01&endDate=2026-08-01&category=all&customerType=all&org=all",
    ),
  );

  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual({
    ok: true,
    data: {
      salesByClient: [
        { type: "FISICA", revenue: 266 },
        { type: "JURIDICA", revenue: 0 },
      ],
      salesByCategory: [{ category: "GERAL", revenue: 266 }],
      SalesByPayment: [{ method: "PIX", revenue: 266 }],
      salesByItemType: [{ type: "Produto", revenue: 266 }],
      salesByClientType: [
        { type: "Novo", clients: 1, revenue: 100 },
        { type: "Recorrente", clients: 2, revenue: 166 },
      ],
      revenueOverTime: [{ label: "2026-08-01", revenue: 266 }],
    },
    error: null,
  });
});
