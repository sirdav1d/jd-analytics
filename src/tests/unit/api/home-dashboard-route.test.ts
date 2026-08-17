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
    [
      {
        organizationId: "org-centro",
        organization: "JD Centro",
        label: "2026-08-01",
        revenue: "266",
      },
    ],
    [
      {
        organizationId: "org-centro",
        organization: "JD Centro",
        label: "2026-08-01",
        sales_count: BigInt(3),
      },
    ],
    [{ organizationId: "org-centro", organization: "JD Centro", cnt: "2" }],
    [
      {
        organizationId: "org-centro",
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
          organizationId: "org-centro",
          organization: "JD Centro",
          revenue: 266,
          salesCount: 3,
          newCustomers: 2,
        },
      ],
      revenueByOrg: [{ period: "2026-08-01", "org-centro": 266 }],
      salesByOrg: [{ period: "2026-08-01", "org-centro": 3 }],
    },
    error: null,
  });
});

test("keeps colliding and punctuated organization names in separate history fields", async () => {
  const responses = [
    [
      {
        organizationId: "org-space",
        organization: "Loja A B",
        label: "2026-08-01",
        revenue: "100",
      },
      {
        organizationId: "org-underscore",
        organization: "Loja A_B",
        label: "2026-08-01",
        revenue: "200",
      },
      {
        organizationId: "org-punctuation",
        organization: "Ótica & Café",
        label: "2026-08-01",
        revenue: "300",
      },
    ],
    [
      {
        organizationId: "org-space",
        organization: "Loja A B",
        label: "2026-08-01",
        sales_count: BigInt(3),
      },
      {
        organizationId: "org-underscore",
        organization: "Loja A_B",
        label: "2026-08-01",
        sales_count: BigInt(2),
      },
      {
        organizationId: "org-punctuation",
        organization: "Ótica & Café",
        label: "2026-08-01",
        sales_count: BigInt(1),
      },
    ],
    [
      { organizationId: "org-space", organization: "Loja A B", cnt: "3" },
      { organizationId: "org-underscore", organization: "Loja A_B", cnt: "2" },
      { organizationId: "org-punctuation", organization: "Ótica & Café", cnt: "1" },
    ],
    [
      {
        organizationId: "org-space",
        organization: "Loja A B",
        revenue: 100,
        sales_count: BigInt(3),
        new_customers: BigInt(3),
      },
      {
        organizationId: "org-underscore",
        organization: "Loja A_B",
        revenue: 200,
        sales_count: BigInt(2),
        new_customers: BigInt(2),
      },
      {
        organizationId: "org-punctuation",
        organization: "Ótica & Café",
        revenue: 300,
        sales_count: BigInt(1),
        new_customers: BigInt(1),
      },
    ],
  ];

  mocks.queryRaw.mockImplementation(async (query: { values: unknown[] }) => {
    const usesCivilDateBoundaries =
      query.values.filter((value) => value === "2026-08-01").length >= 2;
    return usesCivilDateBoundaries ? responses.shift() ?? [] : [];
  });

  const response = await GET(
    new NextRequest(
      "http://localhost/api/services/data-services/home?startDate=2026-08-01&endDate=2026-08-01",
    ),
  );

  await expect(response.json()).resolves.toEqual({
    ok: true,
    data: {
      result: [
        {
          organizationId: "org-space",
          organization: "Loja A B",
          revenue: 100,
          salesCount: 3,
          newCustomers: 3,
        },
        {
          organizationId: "org-underscore",
          organization: "Loja A_B",
          revenue: 200,
          salesCount: 2,
          newCustomers: 2,
        },
        {
          organizationId: "org-punctuation",
          organization: "Ótica & Café",
          revenue: 300,
          salesCount: 1,
          newCustomers: 1,
        },
      ],
      revenueByOrg: [
        {
          period: "2026-08-01",
          "org-space": 100,
          "org-underscore": 200,
          "org-punctuation": 300,
        },
      ],
      salesByOrg: [
        {
          period: "2026-08-01",
          "org-space": 3,
          "org-underscore": 2,
          "org-punctuation": 1,
        },
      ],
    },
    error: null,
  });
});
