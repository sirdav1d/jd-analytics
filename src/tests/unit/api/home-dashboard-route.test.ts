import { beforeEach, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  queryRaw: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { $queryRaw: mocks.queryRaw },
}));

import { GET } from "@/app/api/services/data-services/home/route";

beforeEach(() => {
  const responses = [
    [{ organization: "JD Centro", label: "2026-08-01", revenue: "266" }],
    [
      {
        organization: "JD Centro",
        label: "2026-08-01",
        sales_count: BigInt(3),
      },
    ],
    [{ organization: "JD Centro", cnt: "2" }],
    [
      {
        organization: "JD Centro",
        revenue: 266,
        sales_count: BigInt(3),
        new_customers: BigInt(2),
      },
    ],
  ];

  mocks.queryRaw.mockImplementation(async (query: { values: unknown[] }) => {
    const usesCivilDateBoundaries =
      query.values.filter((value) => value === "2026-08-01").length >= 2;
    return usesCivilDateBoundaries ? responses.shift() ?? [] : [];
  });
});

test("returns dashboard data for a DATE column without shifting the day by timezone", async () => {
  const response = await GET(
    new NextRequest(
      "http://localhost/api/services/data-services/home?startDate=2026-08-01&endDate=2026-08-01",
    ),
  );

  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual({
    ok: true,
    data: {
      result: [
        {
          organization: "JD Centro",
          revenue: 266,
          salesCount: 3,
          newCustomers: 2,
        },
      ],
      revenueByOrg: [{ period: "2026-08-01", jd_centro: 266 }],
      salesByOrg: [{ period: "2026-08-01", jd_centro: 3 }],
    },
    error: null,
  });
});
