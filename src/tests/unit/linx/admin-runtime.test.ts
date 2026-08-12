import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  readLinxConfig: vi.fn(),
  createLinxClient: vi.fn(),
  execute: vi.fn(),
  discoverStores: vi.fn(),
  collectLinxData: vi.fn(),
  buildProductionSyncDependencies: vi.fn(),
  pedidoFindMany: vi.fn(),
  organizationFindUniqueOrThrow: vi.fn(),
  dependencies: { kind: "production-dependencies" },
}));

vi.mock("@/services/linx/config", () => ({
  readLinxConfig: mocks.readLinxConfig,
}));
vi.mock("@/services/linx/client", () => ({
  createLinxClient: mocks.createLinxClient,
}));
vi.mock("@/services/linx/store-discovery", () => ({
  discoverStores: mocks.discoverStores,
}));
vi.mock("@/services/linx/sync", () => ({
  collectLinxData: mocks.collectLinxData,
}));
vi.mock("@/services/linx/sync-runtime", () => ({
  buildProductionSyncDependencies:
    mocks.buildProductionSyncDependencies,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    pedido: { findMany: mocks.pedidoFindMany },
    organization: {
      findUniqueOrThrow: mocks.organizationFindUniqueOrThrow,
    },
  },
}));

import {
  discoverLinxStores,
  previewProductionReconciliation,
} from "@/services/linx/admin-runtime";
import { verifyReconciliationAuthorization } from "@/services/linx/preview-authorization";

const organizationId = "4c5e8d3c-64a2-4c42-b657-58ed175896e7";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-07-29T12:00:00.000Z"));
  mocks.readLinxConfig.mockReturnValue({
    endpoint: "server-owned",
    key: "server-key",
    user: "server-user",
    password: "server-password",
  });
  mocks.createLinxClient.mockReturnValue({ execute: mocks.execute });
  mocks.discoverStores.mockResolvedValue([]);
  mocks.buildProductionSyncDependencies.mockReturnValue(
    mocks.dependencies,
  );
  mocks.collectLinxData.mockResolvedValue({
    sales: [
      {
        source: "LINX",
        organizationExternalCode: 7,
        date: new Date("2026-07-15T00:00:00.000Z"),
        documentNumber: "000123",
        natureOperation: "VENDA",
        operationType: "S",
        operationalOrigin: "Loja",
        cancelled: false,
        customer: null,
        seller: { externalCode: 1, name: "Ada" },
        paymentLabel: "PIX",
        commercialOrigin: null,
        linxIdentifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
        linxTimestamp: BigInt(10),
        items: [
          {
            productCode: 1,
            description: "Produto",
            brand: "Marca",
            sector: "Setor",
            quantity: 1,
            unitValue: 10,
            totalValue: 10,
            linxOrder: 1,
            linxTimestamp: BigInt(10),
          },
          {
            productCode: 2,
            description: "Excluído",
            brand: "Marca",
            sector: "Setor",
            quantity: 1,
            unitValue: 99,
            totalValue: 99,
            linxOrder: 2,
            linxTimestamp: BigInt(10),
            excluded: true,
          },
        ],
      },
    ],
    cursors: {},
    rawCounts: {},
  });
  mocks.pedidoFindMany.mockResolvedValue([
    {
      documentNumber: "000123",
      organizationId,
      data_pedido: new Date("2026-07-15T00:00:00.000Z"),
      linxIdentifier: null,
      cancelled: false,
      natureOperation: "VENDA",
      operationType: "S",
      origin_linx: "Loja",
      customer: { externalCode: null },
      user: { externalId: "1" },
      paymentMethod: { method: "PIX" },
      Origin: null,
      items: [
        {
          quantity: 1,
          unitValue: 10,
          totalValue: 10,
          product: { external_code: 1 },
        },
      ],
    },
  ]);
  mocks.organizationFindUniqueOrThrow.mockResolvedValue({
    linxCnpj: "11222333000144",
    linxSyncEnabled: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Linx ADMIN production composition", () => {
  it("discovers stores with credentials read only from server config", async () => {
    const stores = [
      {
        cnpj: "11222333000144",
        name: "Loja Centro",
        portalId: 7,
        companyId: 9,
      },
    ];
    mocks.discoverStores.mockResolvedValue(stores);

    await expect(discoverLinxStores()).resolves.toEqual(stores);

    expect(mocks.readLinxConfig).toHaveBeenCalledWith();
    expect(mocks.createLinxClient).toHaveBeenCalledWith(
      {
        user: "server-user",
        password: "server-password",
        key: "server-key",
      },
      expect.objectContaining({
        fetch: globalThis.fetch,
        now: Date.now,
      }),
    );
    expect(mocks.discoverStores).toHaveBeenCalledWith({
      execute: mocks.execute,
    });
  });

  it("builds a real read-only 30-day preview without acquiring or persisting a run", async () => {
    const preview = await previewProductionReconciliation(
      organizationId,
      "admin-id",
    );

    expect(mocks.buildProductionSyncDependencies).toHaveBeenCalledWith({
      organizationId,
      trigger: "RECONCILIATION",
      mode: "RECONCILIATION",
      deadlineAt: Date.parse("2026-07-29T12:00:48.000Z"),
      transactionTimeoutMs: 20_000,
    }, expect.objectContaining({ key: "server-key" }));
    expect(mocks.collectLinxData).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId,
        mode: "RECONCILIATION",
      }),
      mocks.dependencies,
      {
        reconciliationPeriod: {
          from: "2026-06-30",
          to: "2026-07-29",
        },
      },
    );
    expect(mocks.pedidoFindMany).toHaveBeenCalledWith({
      where: {
        organizationId,
        data_pedido: {
          gte: new Date("2026-06-30T00:00:00.000Z"),
          lte: new Date("2026-07-29T00:00:00.000Z"),
        },
      },
      select: {
        documentNumber: true,
        organizationId: true,
        data_pedido: true,
        linxIdentifier: true,
        cancelled: true,
        natureOperation: true,
        operationType: true,
        origin_linx: true,
        customer: { select: { externalCode: true } },
        user: { select: { externalId: true } },
        paymentMethod: { select: { method: true } },
        Origin: { select: { name: true } },
        items: {
          select: {
            quantity: true,
            unitValue: true,
            totalValue: true,
            product: { select: { external_code: true } },
          },
        },
      },
    });
    expect(preview).toEqual({
      period: { from: "2026-06-30", to: "2026-07-29" },
      linx: { orders: 1, items: 1, grossValue: 10 },
      database: { orders: 1, items: 1, grossValue: 10 },
      differences: {
        missingInDatabase: 0,
        changedOrders: 0,
        databaseOnly: 0,
      },
      estimatedDurationMs: 0,
      fitsRuntimeBudget: true,
      authorizationToken: expect.any(String),
    });
  });

  it("uses an explicit period for collection and authorization", async () => {
    const period = { from: "2026-08-05", to: "2026-08-06" };

    const preview = await previewProductionReconciliation(
      organizationId,
      "admin-id",
      period,
    );

    expect(mocks.collectLinxData).toHaveBeenCalledWith(
      expect.objectContaining({ organizationId, mode: "RECONCILIATION" }),
      mocks.dependencies,
      { reconciliationPeriod: period },
    );
    expect(preview.period).toEqual(period);
    expect(
      verifyReconciliationAuthorization(preview.authorizationToken!, {
        key: "server-key",
        now: new Date("2026-07-29T12:00:00.000Z"),
        expected: {
          organizationId,
          cnpj: "11222333000144",
          issuedById: "admin-id",
        },
      }).period,
    ).toEqual(period);
  });

  it("does not present cancelled or itemless Linx movements as new sales", async () => {
    const baseSale = {
      source: "LINX" as const,
      organizationExternalCode: 7,
      date: new Date("2026-07-28T00:00:00.000Z"),
      natureOperation: "VENDA",
      operationType: "S",
      operationalOrigin: "Loja",
      customer: null,
      seller: { externalCode: 1, name: "Ada" },
      paymentLabel: "PIX",
      commercialOrigin: null,
      linxTimestamp: BigInt(10),
    };
    mocks.collectLinxData.mockResolvedValueOnce({
      sales: [
        {
          ...baseSale,
          documentNumber: "ACTIVE",
          cancelled: false,
          linxIdentifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
          items: [
            {
              productCode: 1,
              description: "Produto",
              brand: "Marca",
              sector: "Setor",
              quantity: 1,
              unitValue: 10,
              totalValue: 10,
              linxOrder: 1,
              linxTimestamp: BigInt(10),
            },
          ],
        },
        {
          ...baseSale,
          documentNumber: "CANCELLED",
          cancelled: true,
          linxIdentifier: "d9585440-984a-4a55-99b0-9b620e214e52",
          items: [
            {
              productCode: 2,
              description: "Cancelado",
              brand: "Marca",
              sector: "Setor",
              quantity: 1,
              unitValue: 20,
              totalValue: 20,
              linxOrder: 1,
              linxTimestamp: BigInt(10),
            },
          ],
        },
        {
          ...baseSale,
          documentNumber: "ITEMLESS",
          cancelled: false,
          linxIdentifier: "6e9305e4-127a-44d1-b4ec-05cb8c2bb6b2",
          items: [
            {
              productCode: 3,
              description: "Excluído",
              brand: "Marca",
              sector: "Setor",
              quantity: 1,
              unitValue: 30,
              totalValue: 30,
              linxOrder: 1,
              linxTimestamp: BigInt(10),
              excluded: true,
            },
          ],
        },
      ],
      cursors: {},
      rawCounts: {},
    });
    mocks.pedidoFindMany.mockResolvedValueOnce([]);

    const preview = await previewProductionReconciliation(
      organizationId,
      "admin-id",
    );

    expect(preview.linx).toEqual({ orders: 1, items: 1, grossValue: 10 });
    expect(preview.differences).toEqual({
      missingInDatabase: 1,
      changedOrders: 0,
      databaseOnly: 0,
    });
  });

  it("binds private selected targets to the authorization token without returning them", async () => {
    mocks.pedidoFindMany.mockResolvedValueOnce([]);

    const preview = await previewProductionReconciliation(
      organizationId,
      "admin-id",
    );

    expect(preview).not.toHaveProperty("targetLinxIdentifiers");
    expect(preview.authorizationToken).toEqual(expect.any(String));
    expect(
      verifyReconciliationAuthorization(preview.authorizationToken!, {
        key: "server-key",
        now: new Date("2026-07-29T12:00:00.000Z"),
        expected: {
          organizationId,
          cnpj: "11222333000144",
          issuedById: "admin-id",
        },
      }).targetLinxIdentifiers,
    ).toEqual(["7c0ab11c-95b6-4e14-8186-bb5292198ff1"]);
  });

  it("presents cancellation of an existing sale as a change, not as database-only", async () => {
    mocks.collectLinxData.mockResolvedValueOnce({
      sales: [
        {
          source: "LINX",
          organizationExternalCode: 7,
          date: new Date("2026-07-15T00:00:00.000Z"),
          documentNumber: "000123",
          natureOperation: "VENDA",
          operationType: "S",
          operationalOrigin: "Loja",
          cancelled: true,
          customer: null,
          seller: { externalCode: 1, name: "Ada" },
          paymentLabel: "PIX",
          commercialOrigin: null,
          linxIdentifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
          linxTimestamp: BigInt(11),
          items: [
            {
              productCode: 1,
              description: "Produto",
              brand: "Marca",
              sector: "Setor",
              quantity: 1,
              unitValue: 10,
              totalValue: 10,
              linxOrder: 1,
              linxTimestamp: BigInt(11),
            },
          ],
        },
      ],
      cursors: {},
      rawCounts: {},
    });
    mocks.pedidoFindMany.mockResolvedValueOnce([
      {
        documentNumber: "000123",
        organizationId,
        data_pedido: new Date("2026-07-15T00:00:00.000Z"),
        linxIdentifier: null,
        cancelled: false,
        natureOperation: "VENDA",
        operationType: "S",
        origin_linx: "Loja",
        customer: { externalCode: null },
        user: { externalId: "1" },
        paymentMethod: { method: "PIX" },
        Origin: null,
        items: [
          {
            quantity: 1,
            unitValue: 10,
            totalValue: 10,
            product: { external_code: 1 },
          },
        ],
      },
    ]);

    const preview = await previewProductionReconciliation(
      organizationId,
      "admin-id",
    );

    expect(preview.linx).toEqual({ orders: 0, items: 0, grossValue: 0 });
    expect(preview.database).toEqual({ orders: 1, items: 1, grossValue: 10 });
    expect(preview.differences).toEqual({
      missingInDatabase: 0,
      changedOrders: 1,
      databaseOnly: 0,
    });
  });

  it("detects compensated item changes that leave the order total unchanged", async () => {
    mocks.pedidoFindMany.mockResolvedValueOnce([
      {
        documentNumber: "000123",
        organizationId,
        data_pedido: new Date("2026-07-15T00:00:00.000Z"),
        linxIdentifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
        cancelled: false,
        natureOperation: "VENDA",
        operationType: "S",
        origin_linx: "Loja",
        customer: { externalCode: null },
        user: { externalId: "1" },
        paymentMethod: { method: "PIX" },
        Origin: null,
        items: [
          {
            quantity: 2,
            unitValue: 5,
            totalValue: 10,
            product: { external_code: 2 },
          },
        ],
      },
    ]);

    const preview = await previewProductionReconciliation(
      organizationId,
      "admin-id",
    );

    expect(preview.differences).toEqual({
      missingInDatabase: 0,
      changedOrders: 1,
      databaseOnly: 0,
    });
    expect(preview.authorizationToken).toEqual(expect.any(String));
  });

  it("keeps a complete CSV order equivalent across exact sale alias and Linx-owned metadata", async () => {
    mocks.collectLinxData.mockResolvedValueOnce({
      sales: [
        {
          source: "LINX",
          organizationExternalCode: 7,
          date: new Date("2026-07-15T00:00:00.000Z"),
          documentNumber: "000123",
          natureOperation: "VENDA",
          operationType: "S",
          operationalOrigin: "Loja",
          cancelled: false,
          customer: null,
          seller: { externalCode: 1, name: "Ada" },
          paymentLabel: "PIX",
          commercialOrigin: "Google",
          linxIdentifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
          items: [
            {
              productCode: 1,
              description: "Produto 1",
              brand: "Marca",
              sector: "Setor",
              quantity: 1,
              unitValue: 10,
              totalValue: 6,
            },
            {
              productCode: 2,
              description: "Produto 2",
              brand: "Marca",
              sector: "Setor",
              quantity: 1,
              unitValue: 10,
              totalValue: 4,
            },
          ],
        },
      ],
      cursors: {},
      rawCounts: {},
    });
    mocks.pedidoFindMany.mockResolvedValueOnce([
      {
        documentNumber: "000123",
        organizationId,
        data_pedido: new Date("2026-07-15T00:00:00.000Z"),
        linxIdentifier: null,
        cancelled: false,
        natureOperation: "VENDA",
        operationType: "S - Venda",
        origin_linx: "Loja",
        customer: { externalCode: null },
        user: { externalId: "1" },
        paymentMethod: { method: "DINHEIRO" },
        Origin: { name: "Instagram" },
        items: [
          {
            quantity: 1,
            unitValue: 10,
            totalValue: 5,
            product: { external_code: 1 },
          },
          {
            quantity: 1,
            unitValue: 10,
            totalValue: 5,
            product: { external_code: 2 },
          },
        ],
      },
    ]);

    const preview = await previewProductionReconciliation(
      organizationId,
      "admin-id",
    );

    expect(preview.differences).toEqual({
      missingInDatabase: 0,
      changedOrders: 0,
      databaseOnly: 0,
    });
  });
});
