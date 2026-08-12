import type { Prisma } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { createDeadline } from "@/services/linx/deadline";
import {
  collectLinxData,
  runLinxSyncWithDependencies,
  type SyncDependencies,
  type SyncInput,
} from "@/services/linx/sync";
import { ReconciliationAuthorizationError } from "@/services/linx/preview-authorization";
import { mapCanonicalSales as mapLinxCanonicalSales } from "@/services/linx/sync-adapter";
import type { CanonicalSale } from "@/services/sales-import/contracts";

const METHODS = [
  "MOVIMENTO",
  "MOVIMENTO_PLANOS",
  "MOVIMENTO_PRINCIPAL",
  "ROTINA_ORIGEM",
  "RESPOSTA_VENDA",
] as const;

const NOW_MS = Date.parse("2026-07-29T12:00:00.000Z");

const input: SyncInput = {
  organizationId: "org-1",
  requestedById: "admin-1",
  trigger: "MANUAL",
  mode: "INCREMENTAL",
  deadlineAt: NOW_MS + 100_000,
  transactionTimeoutMs: 20_000,
};

function page(timestamp: string) {
  return {
    rows: [{ timestamp }],
    nextTimestamp: BigInt(timestamp),
  };
}

function saleWithIdentifier(
  linxIdentifier: string,
  documentNumber = linxIdentifier,
): CanonicalSale {
  return {
    source: "LINX",
    organizationExternalCode: 7,
    date: new Date("2026-07-29T00:00:00.000Z"),
    documentNumber,
    natureOperation: "Venda",
    operationType: "S",
    operationalOrigin: "Loja",
    cancelled: false,
    customer: null,
    seller: { externalCode: 5, name: "Ada" },
    paymentLabel: "PIX",
    commercialOrigin: null,
    linxIdentifier,
    linxTimestamp: BigInt(1),
    items: [],
  };
}

function makeSyncDeps(options: {
  failMethod?: (typeof METHODS)[number];
  saveCursorError?: Error;
  now?: () => number;
  deadlineAt?: number;
  authorizationTargets?: string[];
} = {}) {
  const transactionClient = {
    name: "transaction-client",
  } as unknown as Prisma.TransactionClient;
  const now = options.now ?? (() => NOW_MS + 10_000);
  const fetches = {
    MOVIMENTO: vi.fn().mockResolvedValue(page("11")),
    MOVIMENTO_PLANOS: vi.fn().mockResolvedValue(page("12")),
    MOVIMENTO_PRINCIPAL: vi.fn().mockResolvedValue(page("13")),
    ROTINA_ORIGEM: vi.fn().mockResolvedValue(page("14")),
    RESPOSTA_VENDA: vi.fn().mockResolvedValue(page("15")),
  };
  if (options.failMethod) {
    fetches[options.failMethod].mockRejectedValue(
      new Error(`fetch ${options.failMethod} failed`),
    );
  }

  const repo = {
    acquireSyncRun: vi.fn().mockResolvedValue({ id: "run-1" }),
    hasCursorBaseline: vi.fn().mockResolvedValue(true),
    getCursors: vi.fn().mockResolvedValue({
      MOVIMENTO: BigInt(1),
      MOVIMENTO_PLANOS: BigInt(2),
      MOVIMENTO_PRINCIPAL: BigInt(3),
      ROTINA_ORIGEM: BigInt(4),
      RESPOSTA_VENDA: BigInt(5),
    }),
    saveCursors: options.saveCursorError
      ? vi.fn().mockRejectedValue(options.saveCursorError)
      : vi.fn().mockResolvedValue(undefined),
    markRunSuccess: vi.fn().mockResolvedValue(undefined),
    markRunFailed: vi.fn().mockResolvedValue(undefined),
    updateRunStage: vi.fn().mockResolvedValue(undefined),
  };
  const transaction = async <T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ) => callback(transactionClient);
  const transactionMock = vi.fn(transaction);
  const prisma: SyncDependencies["prisma"] = {
    $transaction:
      transactionMock as unknown as SyncDependencies["prisma"]["$transaction"],
  };
  const deps = {
    prisma,
    repo,
    deadline: createDeadline(now, options.deadlineAt ?? input.deadlineAt),
    nowDate: vi.fn(() => new Date("2026-07-29T12:00:00.000Z")),
    readOrganization: vi.fn().mockResolvedValue({
      linxCnpj: "11222333000144",
      external_code: 7,
    }),
    fetchMovementPages: fetches.MOVIMENTO,
    fetchMovementPlanPages: fetches.MOVIMENTO_PLANOS,
    fetchMovementPrincipalPages: fetches.MOVIMENTO_PRINCIPAL,
    fetchRoutineOriginPages: fetches.ROTINA_ORIGEM,
    fetchSalesResponsePages: fetches.RESPOSTA_VENDA,
    validateRows: vi.fn<SyncDependencies["validateRows"]>(() => ({
      movements: [],
      paymentLabels: new Map<string, string>(),
      principals: new Map<string, number | null>(),
      routineOrigins: new Map<number, string>(),
      salesResponses: new Map<number, string>(),
      origins: new Map(),
    })),
    completeRows: vi.fn<SyncDependencies["completeRows"]>(
      async (_cnpj, rows) => rows,
    ),
    loadMissingCatalogs: vi.fn().mockResolvedValue({}),
    mapCanonicalSales: vi.fn().mockReturnValue([]),
    importSales: vi.fn().mockResolvedValue({
      ordersProcessed: 2,
      itemsCreated: 3,
      itemsUpdated: 4,
      itemsRemoved: 1,
    }),
    verifyReconciliationAuthorization: vi.fn(() => ({
      organizationId: "org-1",
      cnpj: "11222333000144",
      issuedById: "admin-1",
      period: { from: "2026-06-30", to: "2026-07-29" },
      snapshotHash: "snapshot-hash",
      fitsRuntimeBudget: true,
      targetLinxIdentifiers: options.authorizationTargets ?? [],
      tokenHash: "token-hash",
      issuedAt: new Date("2026-07-29T11:59:00.000Z"),
      expiresAt: new Date("2026-07-29T12:10:00.000Z"),
    })),
    reconciliationSnapshotHash: vi.fn(() => "snapshot-hash"),
    revalidateSales: vi.fn(),
    logger: { warn: vi.fn() },
  } satisfies SyncDependencies;

  return { ...deps, transactionClient, fetches };
}

describe("createDeadline", () => {
  it("rejects when the requested safety margin no longer fits", () => {
    const deadline = createDeadline(() => 9_001, 10_000);

    expect(() => deadline.assert()).toThrow(
      "Tempo insuficiente para concluir com atomicidade",
    );
    expect(deadline.remainingMs()).toBe(999);
  });
});

describe("runLinxSync", () => {
  it("rejects an incremental sync without a baseline before acquiring or fetching Linx data", async () => {
    const deps = makeSyncDeps();
    deps.repo.hasCursorBaseline.mockResolvedValue(false);

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow(
      "Faça a conciliação inicial antes da sincronização incremental.",
    );

    expect(deps.repo.acquireSyncRun).not.toHaveBeenCalled();
    expect(deps.fetchMovementPages).not.toHaveBeenCalled();
    expect(deps.fetchMovementPlanPages).not.toHaveBeenCalled();
    expect(deps.fetchMovementPrincipalPages).not.toHaveBeenCalled();
    expect(deps.fetchRoutineOriginPages).not.toHaveBeenCalled();
    expect(deps.fetchSalesResponsePages).not.toHaveBeenCalled();
  });

  it("allows a confirmed reconciliation without a cursor baseline", async () => {
    const deps = makeSyncDeps();
    deps.repo.hasCursorBaseline.mockResolvedValue(false);

    await expect(
      runLinxSyncWithDependencies(
        {
          ...input,
          mode: "RECONCILIATION",
          trigger: "RECONCILIATION",
          reconciliationAuthorization: "preview-auth",
        },
        deps,
      ),
    ).resolves.toMatchObject({ ordersProcessed: 2 });

    expect(deps.repo.hasCursorBaseline).not.toHaveBeenCalled();
  });

  it("rejects a monotonic deadline before creating an invalid wall-clock lease", async () => {
    const deps = makeSyncDeps();

    await expect(
      runLinxSyncWithDependencies({ ...input, deadlineAt: 100_000 }, deps),
    ).rejects.toThrow("deadlineAt deve usar Unix epoch em milissegundos");

    expect(deps.repo.acquireSyncRun).not.toHaveBeenCalled();
  });

  it("does not mark an unacquired run as failed when lease acquisition fails", async () => {
    const deps = makeSyncDeps();
    deps.repo.acquireSyncRun.mockRejectedValue(new Error("lease unavailable"));

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow("lease unavailable");

    expect(deps.repo.markRunFailed).not.toHaveBeenCalled();
    expect(deps.readOrganization).not.toHaveBeenCalled();
    expect(deps.prisma.$transaction).not.toHaveBeenCalled();
  });

  it.each(METHODS)(
    "does not open the business transaction when %s fetch fails",
    async (method) => {
      const deps = makeSyncDeps({ failMethod: method });

      await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow(`fetch ${method} failed`);

      expect(deps.prisma.$transaction).not.toHaveBeenCalled();
      expect(deps.repo.saveCursors).not.toHaveBeenCalled();
      expect(deps.repo.markRunFailed).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    "validation",
    "delta completion",
    "catalog lookup",
    "canonical mapping",
  ] as const)(
    "does not open the business transaction when %s fails",
    async (stage) => {
      const deps = makeSyncDeps();
      const failure = new Error(`${stage} failed`);
      if (stage === "validation") {
        deps.validateRows.mockImplementation(() => {
          throw failure;
        });
      } else if (stage === "delta completion") {
        deps.completeRows.mockRejectedValue(failure);
      } else if (stage === "catalog lookup") {
        deps.loadMissingCatalogs.mockRejectedValue(failure);
      } else {
        deps.mapCanonicalSales.mockImplementation(() => {
          throw failure;
        });
      }

      await expect(runLinxSyncWithDependencies(input, deps)).rejects.toBe(failure);

      expect(deps.prisma.$transaction).not.toHaveBeenCalled();
      expect(deps.repo.saveCursors).not.toHaveBeenCalled();
      expect(deps.repo.markRunFailed).toHaveBeenCalledTimes(1);
    },
  );

  it("computes product 1314 from known local metadata", async () => {
    const deps = makeSyncDeps();
    const mixedIdentifier = "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const productOnlyIdentifier = "3f0fdd86-cd17-42ee-a2a7-55e559654c21";
    const movement = (
      identificador: string,
      productCode: number,
      order: number,
    ) => ({
      identificador,
      timestamp: BigInt(44 + order),
      documentNumber: identificador === mixedIdentifier ? "mixed" : "product-only",
      launchDate: "2026-07-29",
      customerCode: null,
      sellerCode: 5,
      productCode,
      quantity: 1,
      unitValue: 10,
      totalValue: 10,
      cancelled: false,
      excluded: false,
      order,
      operationalOriginCode: null,
      natureOperation: "Venda",
      operationType: "S",
    });
    const completed = {
      movements: [
        movement(mixedIdentifier, 1314, 1),
        movement(mixedIdentifier, 6, 2),
        movement(productOnlyIdentifier, 1314, 1),
      ],
      paymentLabels: new Map<string, string>(),
      principals: new Map<string, number | null>(),
      routineOrigins: new Map<number, string>(),
      salesResponses: new Map<number, string>(),
      origins: new Map(),
    };
    deps.validateRows.mockReturnValue({ ...completed, movements: [] });
    deps.completeRows.mockResolvedValue(completed);
    deps.loadMissingCatalogs.mockImplementation(async () => {
      return {
        customers: new Map(),
        sellers: new Map([[5, { externalCode: 5, name: "Ada" }]]),
        products: new Map([
          [
            1314,
            {
              productCode: 1314,
              description: "Produto 1314",
              brand: "Marca",
              sector: "Setor",
              catalogStatus: "KNOWN" as const,
            },
          ],
          [
            6,
            {
              productCode: 6,
              description: "Produto permitido",
              brand: "Marca",
              sector: "Setor",
              catalogStatus: "KNOWN" as const,
            },
          ],
        ]),
      };
    });
    deps.mapCanonicalSales.mockImplementation(mapLinxCanonicalSales);

    const collected = await collectLinxData(input, deps);

    expect(collected.sales).toHaveLength(2);
    expect(collected.sales).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          linxIdentifier: mixedIdentifier,
          items: [
            expect.objectContaining({ productCode: 1314, linxOrder: 1 }),
            expect.objectContaining({ productCode: 6, linxOrder: 2 }),
          ],
        }),
        expect.objectContaining({
          linxIdentifier: productOnlyIdentifier,
          items: [expect.objectContaining({ productCode: 1314 })],
        }),
      ]),
    );
    expect(deps.loadMissingCatalogs).toHaveBeenCalledWith(
      "11222333000144",
      completed.movements,
      { mode: "INCREMENTAL" },
    );
  });

  it("warns once per pending product code in ascending order", async () => {
    const deps = makeSyncDeps();
    deps.mapCanonicalSales.mockReturnValue([
      {
        ...saleWithIdentifier("7c0ab11c-95b6-4e14-8186-bb5292198ff1"),
        items: [
          {
            productCode: 9002,
            description: "Pendente 9002",
            brand: "Não informado",
            sector: "Não informado",
            quantity: 1,
            unitValue: 10,
            totalValue: 10,
            catalogStatus: "PENDING",
          },
          {
            productCode: 9001,
            description: "Pendente 9001",
            brand: "Não informado",
            sector: "Não informado",
            quantity: 1,
            unitValue: 10,
            totalValue: 10,
            catalogStatus: "PENDING",
          },
        ],
      },
      {
        ...saleWithIdentifier("3f0fdd86-cd17-42ee-a2a7-55e559654c21"),
        items: [
          {
            productCode: 9001,
            description: "Pendente 9001",
            brand: "Não informado",
            sector: "Não informado",
            quantity: 1,
            unitValue: 10,
            totalValue: 10,
            catalogStatus: "PENDING",
          },
        ],
      },
    ]);

    await collectLinxData(input, deps);

    expect(deps.logger.warn.mock.calls).toEqual([
      ["Produto Linx sem cadastro", { organizationId: "org-1", productCode: 9001 }],
      ["Produto Linx sem cadastro", { organizationId: "org-1", productCode: 9002 }],
    ]);
  });

  it("commits a payment-only cursor after its movement is materialized", async () => {
    const deps = makeSyncDeps();
    const identifier = "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const completed = {
      movements: [
        {
          identificador: identifier,
          timestamp: BigInt(44),
          documentNumber: "000123",
          launchDate: "2026-07-29",
          customerCode: null,
          sellerCode: 5,
          productCode: 6,
          quantity: 1,
          unitValue: 10,
          totalValue: 10,
          cancelled: false,
          excluded: false,
          order: 1,
          operationalOriginCode: null,
          natureOperation: "Venda",
          operationType: "S",
        },
      ],
      paymentLabels: new Map([[identifier, "PIX"]]),
      principals: new Map<string, number | null>(),
      routineOrigins: new Map<number, string>(),
      salesResponses: new Map<number, string>(),
      origins: new Map([
        [
          identifier,
          {
            operationalOrigin: "Loja",
            commercialOrigin: null,
          },
        ],
      ]),
    };
    deps.fetchMovementPages.mockResolvedValue({
      rows: [],
      nextTimestamp: BigInt(1),
    });
    deps.fetchMovementPlanPages.mockResolvedValue({
      rows: [{ identificador: identifier, timestamp: "55" }],
      nextTimestamp: BigInt(55),
    });
    deps.validateRows.mockReturnValue({
      ...completed,
      movements: [],
    });
    deps.completeRows.mockResolvedValue(completed);

    await runLinxSyncWithDependencies(input, deps);

    expect(deps.completeRows).toHaveBeenCalledWith(
      "11222333000144",
      expect.objectContaining({
        movements: [],
        paymentLabels: new Map([[identifier, "PIX"]]),
      }),
      { mode: "INCREMENTAL" },
    );
    expect(deps.loadMissingCatalogs).toHaveBeenCalledWith(
      "11222333000144",
      completed.movements,
      { mode: "INCREMENTAL" },
    );
    expect(deps.mapCanonicalSales).toHaveBeenCalledWith(
      expect.objectContaining({
        movements: completed.movements,
        paymentLabels: completed.paymentLabels,
      }),
    );
    expect(deps.repo.saveCursors).toHaveBeenCalledWith(
      deps.transactionClient,
      input.organizationId,
      expect.objectContaining({
        MOVIMENTO: BigInt(1),
        MOVIMENTO_PLANOS: BigInt(55),
      }),
    );
  });

  it("rolls back business writes and every cursor when persistence fails", async () => {
    const deps = makeSyncDeps({
      saveCursorError: new Error("database down"),
    });

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow("database down");

    expect(deps.repo.markRunSuccess).not.toHaveBeenCalled();
    expect(deps.repo.markRunFailed).toHaveBeenCalledTimes(1);
  });

  it("saves all cursors in the same transaction as sales and success", async () => {
    const deps = makeSyncDeps();

    const result = await runLinxSyncWithDependencies(input, deps);

    expect(deps.importSales).toHaveBeenCalledWith(deps.transactionClient, []);
    expect(deps.repo.saveCursors).toHaveBeenCalledWith(
      deps.transactionClient,
      input.organizationId,
      {
        MOVIMENTO: BigInt(11),
        MOVIMENTO_PLANOS: BigInt(12),
        MOVIMENTO_PRINCIPAL: BigInt(13),
        ROTINA_ORIGEM: BigInt(14),
        RESPOSTA_VENDA: BigInt(15),
      },
    );
    expect(deps.repo.markRunSuccess).toHaveBeenCalledWith(
      deps.transactionClient,
      "run-1",
      { processedOrders: 2, processedItems: 8 },
      new Date("2026-07-29T12:00:00.000Z"),
    );
    expect(result).toEqual({
      ordersProcessed: 2,
      itemsCreated: 3,
      itemsUpdated: 4,
      itemsRemoved: 1,
    });
  });

  it("uses persisted cursors for incremental collection", async () => {
    const deps = makeSyncDeps();

    await runLinxSyncWithDependencies(input, deps);

    expect(deps.repo.getCursors).toHaveBeenCalledWith("org-1");
    expect(deps.repo.acquireSyncRun).toHaveBeenCalledWith({
      organizationId: "org-1",
      requestedById: "admin-1",
      trigger: "MANUAL",
      mode: "INCREMENTAL",
      now: new Date("2026-07-29T12:00:00.000Z"),
      leaseExpiresAt: new Date(input.deadlineAt + 5_000),
      expectedCnpj: undefined,
      reconciliationAuthorizationHash: undefined,
    });
    expect(deps.fetchMovementPages).toHaveBeenCalledWith({
      cnpj: "11222333000144",
      timestamp: BigInt(1),
      mode: "INCREMENTAL",
      range: undefined,
    });
    expect(deps.fetchMovementPlanPages).toHaveBeenCalledWith({
      cnpj: "11222333000144",
      timestamp: BigInt(2),
      range: undefined,
    });
  });

  it("requires explicit confirmation before a reconciliation can acquire a run", async () => {
    const deps = makeSyncDeps();
    const reconciliationInput: SyncInput = {
      ...input,
      mode: "RECONCILIATION",
      trigger: "RECONCILIATION",
    };

    await expect(runLinxSyncWithDependencies(reconciliationInput, deps)).rejects.toThrow(
      "Autorização de preview inválida ou expirada",
    );

    expect(deps.repo.acquireSyncRun).not.toHaveBeenCalled();
    expect(deps.readOrganization).not.toHaveBeenCalled();
    expect(deps.prisma.$transaction).not.toHaveBeenCalled();
  });

  it("uses zero cursors and the last 30 complete days for a confirmed reconciliation", async () => {
    const deps = makeSyncDeps();
    const reconciliationInput: SyncInput = {
      ...input,
      mode: "RECONCILIATION",
      trigger: "RECONCILIATION",
      reconciliationAuthorization: "preview-auth",
    };

    await runLinxSyncWithDependencies(reconciliationInput, deps);

    expect(deps.repo.getCursors).not.toHaveBeenCalled();
    expect(deps.fetchMovementPages).toHaveBeenCalledWith({
      cnpj: "11222333000144",
      timestamp: BigInt(0),
      mode: "RECONCILIATION",
      range: {
        from: "2026-06-30",
        to: "2026-07-29",
      },
    });
    expect(deps.fetchMovementPlanPages).toHaveBeenCalledWith({
      cnpj: "11222333000144",
      timestamp: BigInt(0),
      range: {
        from: "2026-06-30",
        to: "2026-07-29",
      },
    });
  });

  it("consumes the authorization before collection and rejects a changed Linx snapshot before persistence", async () => {
    const deps = makeSyncDeps();
    deps.reconciliationSnapshotHash.mockReturnValue("changed-snapshot");
    await expect(
      runLinxSyncWithDependencies(
        {
          ...input,
          mode: "RECONCILIATION",
          trigger: "RECONCILIATION",
          reconciliationAuthorization: "preview-auth",
        },
        deps,
      ),
    ).rejects.toThrow("Autorização de preview inválida ou expirada");
    expect(deps.repo.acquireSyncRun).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "RECONCILIATION",
        expectedCnpj: "11222333000144",
        reconciliationAuthorizationHash: "token-hash",
      }),
    );
    expect(deps.prisma.$transaction).not.toHaveBeenCalled();
    expect(deps.repo.markRunFailed).toHaveBeenCalledWith(
      "run-1",
      "Autorização de preview inválida ou expirada",
      expect.any(Date),
      "MAPPING",
    );
  });

  it("persists only authorized reconciliation sales after hashing the complete snapshot", async () => {
    const firstIdentifier = "10000000-0000-4000-8000-000000000001";
    const targetIdentifier = "10000000-0000-4000-8000-000000000002";
    const thirdIdentifier = "10000000-0000-4000-8000-000000000003";
    const snapshot = [
      saleWithIdentifier(firstIdentifier, "first"),
      saleWithIdentifier(targetIdentifier, "target"),
      saleWithIdentifier(thirdIdentifier, "third"),
    ];
    const deps = makeSyncDeps({
      authorizationTargets: [targetIdentifier],
    });
    deps.mapCanonicalSales.mockReturnValue(snapshot);

    await runLinxSyncWithDependencies(
      {
        ...input,
        mode: "RECONCILIATION",
        trigger: "RECONCILIATION",
        reconciliationAuthorization: "preview-auth",
      },
      deps,
    );

    expect(deps.reconciliationSnapshotHash).toHaveBeenCalledWith(snapshot);
    expect(deps.importSales).toHaveBeenCalledWith(deps.transactionClient, [
      snapshot[1],
    ]);
    expect(deps.repo.saveCursors).toHaveBeenCalledWith(
      deps.transactionClient,
      input.organizationId,
      {
        MOVIMENTO: BigInt(11),
        MOVIMENTO_PLANOS: BigInt(12),
        MOVIMENTO_PRINCIPAL: BigInt(13),
        ROTINA_ORIGEM: BigInt(14),
        RESPOSTA_VENDA: BigInt(15),
      },
    );
    expect(deps.repo.markRunSuccess).toHaveBeenCalledWith(
      deps.transactionClient,
      "run-1",
      { processedOrders: 2, processedItems: 8 },
      new Date("2026-07-29T12:00:00.000Z"),
    );
  });

  it("rejects an authorized reconciliation target missing from the complete snapshot", async () => {
    const snapshotIdentifier = "10000000-0000-4000-8000-000000000001";
    const absentIdentifier = "10000000-0000-4000-8000-000000000002";
    const deps = makeSyncDeps({
      authorizationTargets: [absentIdentifier],
    });
    deps.mapCanonicalSales.mockReturnValue([
      saleWithIdentifier(snapshotIdentifier),
    ]);

    await expect(
      runLinxSyncWithDependencies(
        {
          ...input,
          mode: "RECONCILIATION",
          trigger: "RECONCILIATION",
          reconciliationAuthorization: "preview-auth",
        },
        deps,
      ),
    ).rejects.toBeInstanceOf(ReconciliationAuthorizationError);

    expect(deps.importSales).not.toHaveBeenCalled();
    expect(deps.repo.saveCursors).not.toHaveBeenCalled();
    expect(deps.repo.markRunSuccess).not.toHaveBeenCalled();
  });

  it("rejects duplicate snapshot GUIDs that differ only by case", async () => {
    const identifier = "10000000-0000-4000-8000-000000000001";
    const deps = makeSyncDeps({ authorizationTargets: [identifier] });
    deps.mapCanonicalSales.mockReturnValue([
      saleWithIdentifier(identifier, "first"),
      saleWithIdentifier(identifier.toUpperCase(), "duplicate"),
    ]);

    await expect(
      runLinxSyncWithDependencies(
        {
          ...input,
          mode: "RECONCILIATION",
          trigger: "RECONCILIATION",
          reconciliationAuthorization: "preview-auth",
        },
        deps,
      ),
    ).rejects.toBeInstanceOf(ReconciliationAuthorizationError);

    expect(deps.importSales).not.toHaveBeenCalled();
    expect(deps.repo.saveCursors).not.toHaveBeenCalled();
    expect(deps.repo.markRunSuccess).not.toHaveBeenCalled();
  });

  it("persists no reconciliation sales for an empty target list while advancing complete cursors", async () => {
    const deps = makeSyncDeps({ authorizationTargets: [] });
    deps.mapCanonicalSales.mockReturnValue([
      saleWithIdentifier("10000000-0000-4000-8000-000000000001"),
      saleWithIdentifier("10000000-0000-4000-8000-000000000002"),
    ]);

    await runLinxSyncWithDependencies(
      {
        ...input,
        mode: "RECONCILIATION",
        trigger: "RECONCILIATION",
        reconciliationAuthorization: "preview-auth",
      },
      deps,
    );

    expect(deps.importSales).toHaveBeenCalledWith(deps.transactionClient, []);
    expect(deps.repo.saveCursors).toHaveBeenCalledWith(
      deps.transactionClient,
      input.organizationId,
      {
        MOVIMENTO: BigInt(11),
        MOVIMENTO_PLANOS: BigInt(12),
        MOVIMENTO_PRINCIPAL: BigInt(13),
        ROTINA_ORIGEM: BigInt(14),
        RESPOSTA_VENDA: BigInt(15),
      },
    );
  });

  it("keeps an old principal watermark without authorizing its GUID for preview or import", async () => {
    const currentIdentifier =
      "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const oldIdentifier =
      "3f0fdd86-cd17-42ee-a2a7-55e559654c21";
    const deps = makeSyncDeps({
      authorizationTargets: [currentIdentifier],
    });
    const currentMovement = {
      identificador: currentIdentifier,
      timestamp: BigInt(44),
      documentNumber: "current",
      launchDate: "2026-07-29",
      customerCode: null,
      sellerCode: 5,
      productCode: 6,
      quantity: 1,
      unitValue: 10,
      totalValue: 10,
      cancelled: false,
      excluded: false,
      order: 1,
      operationalOriginCode: null,
      natureOperation: "Venda",
      operationType: "S",
    };
    const validated = {
      movements: [currentMovement],
      paymentLabels: new Map([[oldIdentifier, "PIX"]]),
      principals: new Map([[oldIdentifier, 10]]),
      routineOrigins: new Map<number, string>(),
      salesResponses: new Map<number, string>(),
      origins: new Map(),
    };
    deps.fetchMovementPrincipalPages.mockResolvedValue({
      rows: [
        {
          identificador: oldIdentifier,
          id_resposta_venda: "10",
          timestamp: "999",
        },
      ],
      nextTimestamp: BigInt(999),
    });
    deps.validateRows.mockReturnValue(validated);
    deps.completeRows.mockImplementation(
      async (_cnpj, _rows, scope) => {
        expect(scope).toEqual({
          mode: "RECONCILIATION",
          authorizedIdentifiers: new Set([currentIdentifier]),
        });
        return {
          ...validated,
          principals: new Map(),
          movements: [currentMovement],
        };
      },
    );
    deps.mapCanonicalSales.mockReturnValue([
      {
        source: "LINX",
        organizationExternalCode: 7,
        date: new Date("2026-07-29T00:00:00.000Z"),
        documentNumber: "current",
        natureOperation: "Venda",
        operationType: "S",
        operationalOrigin: "Loja",
        cancelled: false,
        customer: null,
        seller: { externalCode: 5, name: "Ada" },
        paymentLabel: null,
        commercialOrigin: null,
        linxIdentifier: currentIdentifier,
        linxTimestamp: BigInt(44),
        items: [],
      },
    ]);
    const reconciliationInput: SyncInput = {
      ...input,
      mode: "RECONCILIATION",
      trigger: "RECONCILIATION",
      reconciliationAuthorization: "preview-auth",
    };

    await runLinxSyncWithDependencies(reconciliationInput, deps);

    expect(deps.importSales).toHaveBeenCalledWith(
      deps.transactionClient,
      [
        expect.objectContaining({
          linxIdentifier: currentIdentifier,
          documentNumber: "current",
        }),
      ],
    );
    expect(deps.repo.saveCursors).toHaveBeenCalledWith(
      deps.transactionClient,
      input.organizationId,
      expect.objectContaining({
        MOVIMENTO_PRINCIPAL: BigInt(999),
      }),
    );
  });

  it("uses the São Paulo calendar before local midnight for reconciliation collection", async () => {
    const deps = makeSyncDeps();
    deps.nowDate.mockReturnValue(
      new Date("2026-07-30T01:30:00.000Z"),
    );
    const reconciliationInput: SyncInput = {
      ...input,
      mode: "RECONCILIATION",
      trigger: "RECONCILIATION",
      reconciliationAuthorization: "preview-auth",
    };

    await collectLinxData(reconciliationInput, deps);

    expect(deps.fetchMovementPages).toHaveBeenCalledWith(
      expect.objectContaining({
        range: {
          from: "2026-06-30",
          to: "2026-07-29",
        },
      }),
    );
  });

  it("rejects a canonical reconciliation sale outside the confirmed period before opening the transaction", async () => {
    const deps = makeSyncDeps();
    deps.mapCanonicalSales.mockReturnValue([
      {
        source: "LINX",
        organizationExternalCode: 7,
        date: new Date("2026-06-29T00:00:00.000Z"),
        documentNumber: "old-order",
        natureOperation: "Venda",
        operationType: "S",
        operationalOrigin: "Loja",
        cancelled: false,
        customer: null,
        seller: { externalCode: 5, name: "Ada" },
        paymentLabel: "PIX",
        commercialOrigin: null,
        linxIdentifier: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
        linxTimestamp: BigInt(1),
        items: [],
      },
    ]);
    const reconciliationInput: SyncInput = {
      ...input,
      mode: "RECONCILIATION",
      trigger: "RECONCILIATION",
      reconciliationAuthorization: "preview-auth",
    };

    await expect(
      runLinxSyncWithDependencies(reconciliationInput, deps),
    ).rejects.toThrow("fora do período autorizado");

    expect(deps.prisma.$transaction).not.toHaveBeenCalled();
    expect(deps.importSales).not.toHaveBeenCalled();
    expect(deps.repo.saveCursors).not.toHaveBeenCalled();
    expect(deps.repo.markRunFailed).toHaveBeenCalledTimes(1);
  });

  it("does not open the transaction when its atomic safety margin is exhausted", async () => {
    let current = NOW_MS + 10_000;
    const deps = makeSyncDeps({ now: () => current });
    deps.loadMissingCatalogs.mockImplementation(async () => {
      current = input.deadlineAt - 1_500;
      return {};
    });

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow(
      "Tempo insuficiente para concluir com atomicidade",
    );

    expect(deps.prisma.$transaction).not.toHaveBeenCalled();
    expect(deps.repo.saveCursors).not.toHaveBeenCalled();
    expect(deps.repo.markRunFailed).toHaveBeenCalledTimes(1);
  });

  it("bounds the transaction timeout to the remaining atomic window", async () => {
    const deps = makeSyncDeps({ now: () => input.deadlineAt - 10_000 });

    await runLinxSyncWithDependencies(input, deps);

    expect(deps.prisma.$transaction).toHaveBeenCalledWith(
      expect.any(Function),
      { maxWait: 2_000, timeout: 7_000 },
    );
  });

  it("does not reclassify a committed synchronization when cache invalidation fails", async () => {
    const deps = makeSyncDeps();
    deps.revalidateSales.mockImplementation(() => {
      throw new Error("cache unavailable");
    });

    await expect(runLinxSyncWithDependencies(input, deps)).resolves.toMatchObject({
      ordersProcessed: 2,
    });

    expect(deps.repo.markRunFailed).not.toHaveBeenCalled();
    expect(deps.logger.warn).toHaveBeenCalledWith(
      "Dados sincronizados; falha ao invalidar cache",
      { runId: "run-1" },
    );
  });

  it("sanitizes an upstream credential before recording operational failure", async () => {
    const deps = makeSyncDeps();
    deps.fetchMovementPages.mockRejectedValue(
      new Error("<senha>never-persist-me</senha>"),
    );

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow("never-persist-me");

    expect(deps.repo.markRunFailed).toHaveBeenCalledWith(
      "run-1",
      "Não foi possível concluir a sincronização Linx.",
      new Date("2026-07-29T12:00:00.000Z"),
      "MOVIMENTO",
    );
  });

  it("records a public timeout message when capture receives a closed Prisma transaction", async () => {
    const deps = makeSyncDeps();
    deps.fetchMovementPages.mockRejectedValue(
      new Error(
        "Invalid tx.customer.upsert() invocation in /home/app/.next/server/chunks/db.js: Transaction API error: Transaction not found",
      ),
    );

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow(
      "Transaction not found",
    );

    expect(deps.repo.markRunFailed).toHaveBeenCalledWith(
      "run-1",
      "A gravação excedeu o tempo disponível. Gere um novo preview e tente novamente.",
      new Date("2026-07-29T12:00:00.000Z"),
      "MOVIMENTO",
    );
  });

  it("rejects a deadline object that was not built from the input deadline", async () => {
    const deps = makeSyncDeps({ deadlineAt: input.deadlineAt + 1 });

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow(
      "Deadline da execução não corresponde ao input",
    );

    expect(deps.repo.acquireSyncRun).not.toHaveBeenCalled();
  });

  it("rejects an expired deadline before acquiring the lease", async () => {
    const deps = makeSyncDeps({ now: () => input.deadlineAt });

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow(
      "Tempo insuficiente para concluir com atomicidade",
    );

    expect(deps.repo.acquireSyncRun).not.toHaveBeenCalled();
  });

  it("does not open a transaction unless maxWait, callback and safety all fit", async () => {
    const deps = makeSyncDeps({
      now: () => input.deadlineAt - 3_999,
    });

    await expect(runLinxSyncWithDependencies(input, deps)).rejects.toThrow(
      "Sem margem para iniciar a transação",
    );

    expect(deps.prisma.$transaction).not.toHaveBeenCalled();
  });
});
