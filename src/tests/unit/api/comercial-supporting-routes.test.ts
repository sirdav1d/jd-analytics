import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  pedidoCount: vi.fn(),
  pedidoFindMany: vi.fn(),
  pedidoGroupBy: vi.fn(),
  saleItemAggregate: vi.fn(),
  saleItemGroupBy: vi.fn(),
  userFindUnique: vi.fn(),
  productFindUnique: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pedido: {
      count: mocks.pedidoCount,
      findMany: mocks.pedidoFindMany,
      groupBy: mocks.pedidoGroupBy,
    },
    saleItem: {
      aggregate: mocks.saleItemAggregate,
      groupBy: mocks.saleItemGroupBy,
    },
    user: { findUnique: mocks.userFindUnique },
    product: { findUnique: mocks.productFindUnique },
    $queryRaw: mocks.queryRaw,
  },
}));

import { GET as getBigNumbers } from "@/app/api/services/data-services/comercial-big-numbers/route";
import { GET as getRankings } from "@/app/api/services/data-services/comercial-rankings/route";
import { GET as getOriginData } from "@/app/api/services/data-services/data-origin/route";

function isUtcDate(value: unknown, isoDate: string) {
  return value instanceof Date && value.toISOString() === `${isoDate}T00:00:00.000Z`;
}

function hasDateRange(
  value: unknown,
  startDate: string,
  endDate: string,
) {
  if (!value || typeof value !== "object") return false;
  const range = value as { gte?: unknown; lte?: unknown };
  return isUtcDate(range.gte, startDate) && isUtcDate(range.lte, endDate);
}

function queryUsesCivilRange(query: { values?: unknown[] }, start: string, end: string) {
  const values = query.values ?? [];
  return values.includes(start) && values.includes(end);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("commercial supporting chart routes", () => {
  test("returns every big number using timezone-safe current and previous periods", async () => {
    mocks.pedidoCount.mockImplementation(async ({ where }) =>
      hasDateRange(where.data_pedido, "2026-08-01", "2026-08-01") ? 3 : 2,
    );
    mocks.saleItemAggregate.mockImplementation(async ({ where }) => ({
      _sum: {
        totalValue: hasDateRange(
          where.sale.data_pedido,
          "2026-08-01",
          "2026-08-01",
        )
          ? 266
          : 100,
      },
    }));
    mocks.pedidoFindMany.mockImplementation(async ({ where }) =>
      hasDateRange(where.data_pedido, "2026-08-01", "2026-08-01")
        ? [{ customerId: "a" }, { customerId: "b" }, { customerId: "c" }]
        : [{ customerId: "a" }, { customerId: "b" }],
    );

    let currentRawCall = 0;
    let previousRawCall = 0;
    mocks.queryRaw.mockImplementation(async (query) => {
      if (queryUsesCivilRange(query, "2026-08-01", "2026-08-01")) {
        currentRawCall += 1;
        return [{ cnt: currentRawCall === 1 ? "1" : "2" }];
      }
      if (queryUsesCivilRange(query, "2026-07-31", "2026-07-31")) {
        previousRawCall += 1;
        return [{ cnt: previousRawCall === 1 ? "0" : "2" }];
      }
      return [];
    });

    const response = await getBigNumbers(
      new NextRequest(
        "http://localhost/api/services/data-services/comercial-big-numbers?startDate=2026-08-01&endDate=2026-08-01&category=all&customerType=all&org=all",
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.data.current).toEqual({
      totalRevenue: 266,
      averageTicket: 88.67,
      totalSales: 3,
      newCustomers: 1,
      recurringCustomers: 2,
      revenuePerCustomer: 88.67,
    });
    expect(body.data.previous).toEqual({
      totalRevenue: 100,
      averageTicket: 50,
      totalSales: 2,
      newCustomers: 0,
      recurringCustomers: 2,
      revenuePerCustomer: 50,
    });
  });

  test("returns sellers, products and customers from the same civil day", async () => {
    mocks.pedidoGroupBy.mockImplementation(async ({ where }) =>
      hasDateRange(where.data_pedido, "2026-08-01", "2026-08-01")
        ? [{ userId: "seller-1", _count: { id: 3 } }]
        : [],
    );
    mocks.saleItemAggregate.mockImplementation(async ({ where }) => ({
      _sum: {
        totalValue: hasDateRange(
          where.sale.data_pedido,
          "2026-08-01",
          "2026-08-01",
        )
          ? 266
          : 0,
      },
    }));
    mocks.userFindUnique.mockResolvedValue({ name: "Vendedor" });
    mocks.saleItemGroupBy.mockImplementation(async ({ where }) =>
      hasDateRange(where.sale.data_pedido, "2026-08-01", "2026-08-01")
        ? [
            {
              productId: "product-1",
              _sum: { quantity: 2, totalValue: 266 },
            },
          ]
        : [],
    );
    mocks.productFindUnique.mockResolvedValue({
      description: "Produto",
      external_code: 10,
    });
    mocks.queryRaw.mockImplementation(async (query) =>
      queryUsesCivilRange(query, "2026-08-01", "2026-08-01")
        ? [
            {
              customer_id: "customer-1",
              name: "Cliente",
              external_code: 1,
              purchases: BigInt(1),
              revenue: 266,
            },
          ]
        : [],
    );

    const response = await getRankings(
      new NextRequest(
        "http://localhost/api/services/data-services/comercial-rankings?startDate=2026-08-01&endDate=2026-08-01&category=all&customerType=all&org=all",
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.sellers).toEqual([
      {
        posicao: 1,
        name: "Vendedor",
        sales: 3,
        revenue: 266,
        avgTicket: 88.67,
      },
    ]);
    expect(body.data.products).toEqual([
      {
        posicao: 1,
        name: "Produto",
        code: 10,
        sales: 2,
        revenue: 266,
      },
    ]);
    expect(body.data.topCustomers).toEqual([
      {
        posicao: 1,
        name: "Cliente",
        code: "01",
        purchases: 1,
        revenue: 266,
      },
    ]);
  });

  test("returns origin charts when category and customer filters are active", async () => {
    mocks.queryRaw.mockImplementation(async (query: { strings?: string[]; values?: unknown[] }) => {
      const sql = (query.strings ?? []).join(" ");
      if (
        !sql.includes('JOIN "Product" pr') ||
        !sql.includes('JOIN "Customer" c') ||
        !queryUsesCivilRange(query, "2026-08-01", "2026-08-01")
      ) {
        throw new Error("invalid origin chart query");
      }
      return [
        {
          origin_group: "Balcão",
          revenue: "266",
          sales_count: 3,
          avg_ticket: "88.6666666667",
        },
      ];
    });

    const response = await getOriginData(
      new NextRequest(
        "http://localhost/api/services/data-services/data-origin?startDate=2026-08-01&endDate=2026-08-01&category=ACESSORIOS&customerType=FISICA&org=all",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      data: {
        revenueByOrigin: [
          { origin: "Balcão", revenue: 266, fill: "var(--color-Balcão)" },
        ],
        salesCountByOrigin: [
          { origin: "Balcão", sales_count: 3, fill: "var(--color-Balcão)" },
        ],
        avgTicketByOrigin: [
          {
            origin: "Balcão",
            avg_ticket: 88.6666666667,
            fill: "var(--color-Balcão)",
          },
        ],
      },
      error: null,
    });
  });

  test("keeps valid sales without a customer in origin totals", async () => {
    mocks.queryRaw.mockImplementation(async (query: { strings?: string[]; values?: unknown[] }) => {
      const sql = (query.strings ?? []).join(" ");
      if (
        !sql.includes('LEFT JOIN "Customer" c') ||
        !queryUsesCivilRange(query, "2026-08-01", "2026-08-01")
      ) {
        throw new Error("customer-less sales were discarded");
      }
      return [
        {
          origin_group: "Desconhecido",
          revenue: "20",
          sales_count: 1,
          avg_ticket: "20",
        },
      ];
    });

    const response = await getOriginData(
      new NextRequest(
        "http://localhost/api/services/data-services/data-origin?startDate=2026-08-01&endDate=2026-08-01&category=all&customerType=all&org=all",
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.revenueByOrigin).toEqual([
      {
        origin: "Desconhecido",
        revenue: 20,
        fill: "var(--color-Desconhecido)",
      },
    ]);
  });
});
