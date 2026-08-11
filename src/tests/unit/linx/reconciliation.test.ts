import { describe, expect, it, vi } from "vitest";
import {
  createReconciliationBusinessFingerprint,
  createReconciliationLegacyBusinessFingerprint,
  previewReconciliation,
  reconciliationPeriodFor,
  type ReconciliationOrder,
  type ReconciliationPreviewDependencies,
} from "@/services/linx/reconciliation";

function businessFingerprintInput(
  overrides: Partial<Parameters<typeof createReconciliationBusinessFingerprint>[0]> = {},
) {
  return {
    cancelled: false,
    natureOperation: "VENDA",
    operationType: "S",
    operationalOrigin: "Loja",
    customerExternalCode: 10,
    sellerExternalId: "22",
    paymentLabel: "PIX",
    commercialOrigin: "Google",
    items: [
      {
        productExternalCode: 1,
        quantity: 1,
        unitValue: 10,
        totalValue: 10,
      },
    ],
    ...overrides,
  };
}

type ReconciliationOrderFixture = Omit<
  ReconciliationOrder,
  "businessFingerprint" | "legacyBusinessFingerprint"
> & {
  businessFingerprint?: string;
  legacyBusinessFingerprint?: string;
};

function reconciliationOrder(
  order: ReconciliationOrderFixture,
): ReconciliationOrder {
  const items = Array.from({ length: order.itemCount }, (_, index) => ({
    productExternalCode: index + 1,
    quantity: 1,
    unitValue: index === 0 ? order.grossValue : 0,
    totalValue: index === 0 ? order.grossValue : 0,
  }));
  const input = {
    cancelled: order.cancelled,
    natureOperation: "VENDA",
    operationType: "S",
    operationalOrigin: "Loja",
    customerExternalCode: null,
    sellerExternalId: "1",
    paymentLabel: "PIX",
    commercialOrigin: null,
    items,
  };
  return {
    ...order,
    businessFingerprint:
      order.businessFingerprint ??
      createReconciliationBusinessFingerprint(input),
    legacyBusinessFingerprint:
      order.legacyBusinessFingerprint ??
      createReconciliationLegacyBusinessFingerprint(input),
  };
}

function reconciliationOrders(orders: ReconciliationOrderFixture[]) {
  return orders.map(reconciliationOrder);
}

function makeDependencies(elapsedMs: number) {
  let clock = 10_000;
  const readLinxOrders = vi.fn<
    ReconciliationPreviewDependencies["readLinxOrders"]
  >(async () => {
    clock += elapsedMs;
    return reconciliationOrders([
      {
        linxIdentifier: "same",
        historicalKey: {
          documentNumber: "1",
          organizationId: "org-1",
          date: "2026-07-01",
        },
        cancelled: false,
        itemCount: 2,
        grossValue: 20,
      },
      {
        linxIdentifier: "changed",
        historicalKey: {
          documentNumber: "2",
          organizationId: "org-1",
          date: "2026-07-02",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 15,
      },
      {
        linxIdentifier: "missing",
        historicalKey: {
          documentNumber: "3",
          organizationId: "org-1",
          date: "2026-07-03",
        },
        cancelled: false,
        itemCount: 3,
        grossValue: 30,
      },
    ]);
  });
  const readDatabaseOrders = vi
    .fn<ReconciliationPreviewDependencies["readDatabaseOrders"]>()
    .mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "same",
        historicalKey: {
          documentNumber: "1",
          organizationId: "org-1",
          date: "2026-07-01",
        },
        cancelled: false,
        itemCount: 2,
        grossValue: 20,
      },
      {
        linxIdentifier: "changed",
        historicalKey: {
          documentNumber: "2",
          organizationId: "org-1",
          date: "2026-07-02",
        },
        cancelled: false,
        itemCount: 2,
        grossValue: 18,
      },
      {
        linxIdentifier: "database-only",
        historicalKey: {
          documentNumber: "4",
          organizationId: "org-1",
          date: "2026-07-04",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 5,
      },
    ]));
  const dependencies = {
    now: vi.fn(() => clock),
    nowDate: vi.fn(() => new Date("2026-07-29T18:30:00.000Z")),
    readLinxOrders,
    readDatabaseOrders,
  } satisfies ReconciliationPreviewDependencies;

  return dependencies;
}

describe("createReconciliationBusinessFingerprint", () => {
  it("distinguishes compensated product, quantity, and unit-value changes", () => {
    const expected = createReconciliationBusinessFingerprint(
      businessFingerprintInput(),
    );

    expect(
      createReconciliationBusinessFingerprint(
        businessFingerprintInput({
          items: [
            {
              productExternalCode: 2,
              quantity: 2,
              unitValue: 5,
              totalValue: 10,
            },
          ],
        }),
      ),
    ).not.toBe(expected);
  });

  it.each([
    ["cancelled", { cancelled: true }],
    ["nature", { natureOperation: "DEVOLUÇÃO" }],
    ["operation", { operationType: "E" }],
    ["operational origin", { operationalOrigin: "E-commerce" }],
    ["customer", { customerExternalCode: 11 }],
    ["seller", { sellerExternalId: "23" }],
    ["payment", { paymentLabel: "DINHEIRO" }],
    ["commercial origin", { commercialOrigin: "Instagram" }],
  ] as const)("distinguishes a changed %s header dimension", (_label, overrides) => {
    const expected = createReconciliationBusinessFingerprint(
      businessFingerprintInput(),
    );

    expect(
      createReconciliationBusinessFingerprint(businessFingerprintInput(overrides)),
    ).not.toBe(expected);
  });

  it("treats item ordering as irrelevant while preserving duplicate item occurrences", () => {
    const first = {
      productExternalCode: 1,
      quantity: 1,
      unitValue: 10,
      totalValue: 10,
    };
    const second = {
      productExternalCode: 2,
      quantity: 2,
      unitValue: 5,
      totalValue: 10,
    };
    const expected = createReconciliationBusinessFingerprint(
      businessFingerprintInput({ items: [first, second, second] }),
    );

    expect(
      createReconciliationBusinessFingerprint(
        businessFingerprintInput({ items: [second, first, second] }),
      ),
    ).toBe(expected);
    expect(
      createReconciliationBusinessFingerprint(
        businessFingerprintInput({ items: [first, second] }),
      ),
    ).not.toBe(expected);
  });

  it("retains four decimal places for money and normalizes negative-zero quantities", () => {
    const valueAtOneTenThousandth = createReconciliationBusinessFingerprint(
      businessFingerprintInput({
        items: [
          {
            productExternalCode: 1,
            quantity: -0,
            unitValue: 0.0001,
            totalValue: 0.0001,
          },
        ],
      }),
    );

    expect(
      createReconciliationBusinessFingerprint(
        businessFingerprintInput({
          items: [
            {
              productExternalCode: 1,
              quantity: 0,
              unitValue: 0.0001,
              totalValue: 0.0001,
            },
          ],
        }),
      ),
    ).toBe(valueAtOneTenThousandth);
    expect(
      createReconciliationBusinessFingerprint(
        businessFingerprintInput({
          items: [
            {
              productExternalCode: 1,
              quantity: 0,
              unitValue: 0.0002,
              totalValue: 0.0002,
            },
          ],
        }),
      ),
    ).not.toBe(valueAtOneTenThousandth);
  });

  it("handles absent legacy dimension metadata deterministically", () => {
    const legacy = businessFingerprintInput({
      customerExternalCode: null,
      sellerExternalId: null,
      paymentLabel: null,
      commercialOrigin: null,
    });

    expect(createReconciliationBusinessFingerprint(legacy)).toBe(
      createReconciliationBusinessFingerprint({ ...legacy }),
    );
    expect(
      createReconciliationBusinessFingerprint(
        businessFingerprintInput({ customerExternalCode: null }),
      ),
    ).not.toBe(createReconciliationBusinessFingerprint(legacy));
  });

  it("rejects a non-finite item quantity", () => {
    expect(() =>
      createReconciliationBusinessFingerprint(
        businessFingerprintInput({
          items: [
            {
              productExternalCode: 1,
              quantity: Number.NaN,
              unitValue: 1,
              totalValue: 1,
            },
          ],
        }),
      ),
    ).toThrow("Quantidade de item inválida na conciliação");
  });

  it("normalizes only the exact legacy sale alias and excludes Linx-owned metadata", () => {
    const linx = businessFingerprintInput({
      operationType: "S",
      paymentLabel: "PIX",
      commercialOrigin: "Google",
      items: [
        {
          productExternalCode: 1,
          quantity: 1,
          unitValue: 10,
          totalValue: 6,
        },
        {
          productExternalCode: 2,
          quantity: 1,
          unitValue: 10,
          totalValue: 4,
        },
      ],
    });
    const csv = businessFingerprintInput({
      operationType: "S - Venda",
      paymentLabel: "DINHEIRO",
      commercialOrigin: "Instagram",
      items: [
        {
          productExternalCode: 1,
          quantity: 1,
          unitValue: 10,
          totalValue: 5,
        },
        {
          productExternalCode: 2,
          quantity: 1,
          unitValue: 10,
          totalValue: 5,
        },
      ],
    });

    expect(createReconciliationLegacyBusinessFingerprint(csv)).toBe(
      createReconciliationLegacyBusinessFingerprint(linx),
    );
    expect(createReconciliationBusinessFingerprint(csv)).not.toBe(
      createReconciliationBusinessFingerprint(linx),
    );
    expect(
      createReconciliationLegacyBusinessFingerprint(
        businessFingerprintInput({ operationType: "s - venda" }),
      ),
    ).not.toBe(
      createReconciliationLegacyBusinessFingerprint(
        businessFingerprintInput({ operationType: "S" }),
      ),
    );
  });

  it.each([
    ["product", { productExternalCode: 2 }],
    ["quantity", { quantity: 2 }],
    ["unit value", { unitValue: 9 }],
  ] as const)("keeps %s in the legacy item fingerprint", (_label, itemChange) => {
    const reference = createReconciliationLegacyBusinessFingerprint(
      businessFingerprintInput(),
    );
    const item = {
      productExternalCode: 1,
      quantity: 1,
      unitValue: 10,
      totalValue: 10,
      ...itemChange,
    };

    expect(
      createReconciliationLegacyBusinessFingerprint(
        businessFingerprintInput({ items: [item] }),
      ),
    ).not.toBe(reference);
  });
});

describe("previewReconciliation", () => {
  it.each([
    [
      "before São Paulo midnight",
      new Date("2026-07-30T01:30:00.000Z"),
      { from: "2026-06-30", to: "2026-07-29" },
    ],
    [
      "after São Paulo midnight",
      new Date("2026-07-30T03:30:00.000Z"),
      { from: "2026-07-01", to: "2026-07-30" },
    ],
  ])("derives the exact 30-day calendar window %s", (_label, now, expected) => {
    expect(reconciliationPeriodFor(now)).toEqual(expected);
  });

  it("compares the previous 30 days using only read dependencies", async () => {
    const dependencies = makeDependencies(600);

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(dependencies.readLinxOrders).toHaveBeenCalledWith({
      from: "2026-06-30",
      to: "2026-07-29",
    });
    expect(dependencies.readDatabaseOrders).toHaveBeenCalledWith({
      from: "2026-06-30",
      to: "2026-07-29",
    });
    expect(preview).toEqual({
      period: { from: "2026-06-30", to: "2026-07-29" },
      linx: { orders: 3, items: 6, grossValue: 65 },
      database: { orders: 3, items: 5, grossValue: 43 },
      differences: {
        missingInDatabase: 1,
        changedOrders: 1,
        databaseOnly: 1,
      },
      targetLinxIdentifiers: ["changed", "missing"],
      estimatedDurationMs: 600,
      fitsRuntimeBudget: true,
    });
  });

  it("uses an explicit validated reconciliation period", async () => {
    const dependencies = makeDependencies(10);
    const period = { from: "2026-08-05", to: "2026-08-06" };

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000, period },
      dependencies,
    );

    expect(preview.period).toEqual(period);
    expect(dependencies.readLinxOrders).toHaveBeenCalledWith(period);
    expect(dependencies.readDatabaseOrders).toHaveBeenCalledWith(period);
  });

  it.each([
    [{ from: "2026-02-30", to: "2026-03-01" }],
    [{ from: "2026-08-06", to: "2026-08-05" }],
    [{ from: "2026-07-01", to: "2026-08-01" }],
  ])("rejects invalid explicit period %#", async (period) => {
    await expect(
      previewReconciliation(
        { runtimeBudgetMs: 1_000, period },
        makeDependencies(10),
      ),
    ).rejects.toThrow("Período de conciliação inválido");
  });

  it("authorizes only missing closed and changed Linx orders in canonical order", async () => {
    const dependencies = makeDependencies(1);
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000004",
        historicalKey: {
          documentNumber: "equivalent",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000003",
        historicalKey: {
          documentNumber: "changed",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 2,
        grossValue: 10,
      },
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000001".toUpperCase(),
        historicalKey: {
          documentNumber: "missing",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000002",
        historicalKey: {
          documentNumber: "cancelled-missing",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: true,
        itemCount: 1,
        grossValue: 10,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000004",
        historicalKey: {
          documentNumber: "equivalent",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000003",
        historicalKey: {
          documentNumber: "changed",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000005",
        historicalKey: {
          documentNumber: "database-only",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
    ]));

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.targetLinxIdentifiers).toEqual([
      "00000000-0000-4000-8000-000000000001",
      "00000000-0000-4000-8000-000000000003",
    ]);
  });

  it("rejects a selected Linx order without a GUID", async () => {
    const dependencies = makeDependencies(1);
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: null,
        historicalKey: {
          documentNumber: "missing",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue([]);

    await expect(
      previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
    ).rejects.toThrow("Pedido Linx selecionado sem GUID");
  });

  it("does not target cancelled or itemless Linx orders that are absent from the database", async () => {
    const dependencies = makeDependencies(1);
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000001",
        historicalKey: {
          documentNumber: "cancelled",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: true,
        itemCount: 1,
        grossValue: 10,
      },
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000002",
        historicalKey: {
          documentNumber: "itemless",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 0,
        grossValue: 0,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue([]);

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.targetLinxIdentifiers).toEqual([]);
  });

  it("matches Linx and database GUIDs irrespective of case", async () => {
    const dependencies = makeDependencies(1);
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000001".toUpperCase(),
        historicalKey: {
          documentNumber: "same",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "00000000-0000-4000-8000-000000000001",
        historicalKey: {
          documentNumber: "same",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
    ]));

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.differences).toEqual({
      missingInDatabase: 0,
      changedOrders: 0,
      databaseOnly: 0,
    });
    expect(preview.targetLinxIdentifiers).toEqual([]);
  });

  it("rejects GUIDs duplicated only by casing", async () => {
    const dependencies = makeDependencies(1);
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "CASE-SENSITIVE-GUID",
        historicalKey: {
          documentNumber: "first",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
      {
        linxIdentifier: "case-sensitive-guid",
        historicalKey: {
          documentNumber: "second",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue([]);

    await expect(
      previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
    ).rejects.toThrow("GUID duplicado na conciliação: case-sensitive-guid");
  });

  it("accepts exactly 80 percent of runtime and rejects any duration above it", async () => {
    const atLimit = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      makeDependencies(800),
    );
    const aboveLimit = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      makeDependencies(801),
    );

    expect(atLimit.fitsRuntimeBudget).toBe(true);
    expect(aboveLimit.fitsRuntimeBudget).toBe(false);
  });

  it("rejects an invalid runtime budget before starting either read", async () => {
    const dependencies = makeDependencies(1);

    await expect(
      previewReconciliation({ runtimeBudgetMs: 0 }, dependencies),
    ).rejects.toThrow("Orçamento de runtime inválido");

    expect(dependencies.readLinxOrders).not.toHaveBeenCalled();
    expect(dependencies.readDatabaseOrders).not.toHaveBeenCalled();
  });

  it("matches a Linx GUID to a historical CSV order by composite fallback", async () => {
    const dependencies = makeDependencies(1);
    const historicalKey = {
      documentNumber: "000123",
      organizationId: "org-1",
      date: "2026-07-29",
    };
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "guid-new",
        historicalKey,
        cancelled: false,
        itemCount: 2,
        grossValue: 21,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: null,
        historicalKey,
        cancelled: false,
        itemCount: 2,
        grossValue: 21,
      },
    ]));

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.differences).toEqual({
      missingInDatabase: 0,
      changedOrders: 0,
      databaseOnly: 0,
    });
  });

  it.each([
    ["a sub-cent floating-point residue", 5_615, 5_615.000000000001, 0],
    ["a half-cent boundary", 1, 1.005, 1],
    ["a one-cent difference", 5_615, 5_615.01, 1],
  ])(
    "compares monetary totals at cent precision for %s",
    async (_case, databaseGrossValue, linxGrossValue, changedOrders) => {
      const dependencies = makeDependencies(1);
      const historicalKey = {
        documentNumber: "000123",
        organizationId: "org-1",
        date: "2026-07-29",
      };
      dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
        {
          linxIdentifier: "guid-new",
          historicalKey,
          cancelled: false,
          itemCount: 2,
          grossValue: linxGrossValue,
        },
      ]));
      dependencies.readDatabaseOrders.mockResolvedValue(reconciliationOrders([
        {
          linxIdentifier: "guid-new",
          historicalKey,
          cancelled: false,
          itemCount: 2,
          grossValue: databaseGrossValue,
        },
      ]));

      const preview = await previewReconciliation(
        { runtimeBudgetMs: 1_000 },
        dependencies,
      );

      expect(preview.differences.changedOrders).toBe(changedOrders);
    },
  );

  it("rejects duplicate GUIDs deterministically", async () => {
    const dependencies = makeDependencies(1);
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "duplicate",
        historicalKey: {
          documentNumber: "1",
          organizationId: "org-1",
          date: "2026-07-01",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
      {
        linxIdentifier: "duplicate",
        historicalKey: {
          documentNumber: "2",
          organizationId: "org-1",
          date: "2026-07-02",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue([]);

    await expect(
      previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
    ).rejects.toThrow("GUID duplicado na conciliação: duplicate");
  });

  it("rejects conflicting GUIDs on the same historical key", async () => {
    const dependencies = makeDependencies(1);
    const historicalKey = {
      documentNumber: "000123",
      organizationId: "org-1",
      date: "2026-07-29",
    };
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "guid-linx",
        historicalKey,
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "guid-database",
        historicalKey,
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
    ]));

    await expect(
      previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
    ).rejects.toThrow(
      "Colisão de chave histórica na conciliação: org-1/2026-07-29/000123",
    );
  });

  it("rejects duplicate historical keys without relying on input order", async () => {
    const dependencies = makeDependencies(1);
    const historicalKey = {
      documentNumber: "000123",
      organizationId: "org-1",
      date: "2026-07-29",
    };
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: null,
        historicalKey,
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
      {
        linxIdentifier: null,
        historicalKey,
        cancelled: false,
        itemCount: 2,
        grossValue: 2,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue([]);

    await expect(
      previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
    ).rejects.toThrow(
      "Chave histórica duplicada na conciliação: org-1/2026-07-29/000123",
    );
  });

  it("rejects when two Linx identities resolve to the same database order", async () => {
    const dependencies = makeDependencies(1);
    const databaseHistoricalKey = {
      documentNumber: "2",
      organizationId: "org-1",
      date: "2026-07-02",
    };
    dependencies.readLinxOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "shared-guid",
        historicalKey: {
          documentNumber: "1",
          organizationId: "org-1",
          date: "2026-07-01",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
      {
        linxIdentifier: null,
        historicalKey: databaseHistoricalKey,
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
    ]));
    dependencies.readDatabaseOrders.mockResolvedValue(reconciliationOrders([
      {
        linxIdentifier: "shared-guid",
        historicalKey: databaseHistoricalKey,
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      },
    ]));

    await expect(
      previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
    ).rejects.toThrow(
      "Colisão de identidades na conciliação: org-1/2026-07-02/2",
    );
  });

  it.each(["guid-first", "composite-first"] as const)(
    "rejects distinct database matches by GUID and composite (%s)",
    async (order) => {
      const dependencies = makeDependencies(1);
      const linxOrder = {
        linxIdentifier: "shared-guid",
        historicalKey: {
          documentNumber: "1",
          organizationId: "org-1",
          date: "2026-07-01",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      };
      const byGuid = {
        linxIdentifier: "shared-guid",
        historicalKey: {
          documentNumber: "2",
          organizationId: "org-1",
          date: "2026-07-02",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      };
      const byComposite = {
        linxIdentifier: null,
        historicalKey: linxOrder.historicalKey,
        cancelled: false,
        itemCount: 1,
        grossValue: 1,
      };
      dependencies.readLinxOrders.mockResolvedValue(
        reconciliationOrders([linxOrder]),
      );
      dependencies.readDatabaseOrders.mockResolvedValue(
        reconciliationOrders(
          order === "guid-first"
            ? [byGuid, byComposite]
            : [byComposite, byGuid],
        ),
      );

      await expect(
        previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
      ).rejects.toThrow(
        "Colisão GUID/chave histórica na conciliação: org-1/2026-07-01/1",
      );
    },
  );

  it("targets a persisted sale when its business fingerprint changes despite matching aggregates", async () => {
    const dependencies = makeDependencies(1);
    const linxOrder = {
      linxIdentifier: "00000000-0000-4000-8000-000000000099",
      historicalKey: {
        documentNumber: "000123",
        organizationId: "org-1",
        date: "2026-07-29",
      },
      cancelled: false,
      itemCount: 1,
      grossValue: 10,
      businessFingerprint: "linx-product-2-qty-1-unit-10-total-10",
      legacyBusinessFingerprint: "same-legacy-business",
    } as ReconciliationOrder & { businessFingerprint: string };
    const persistedOrder = {
      ...linxOrder,
      businessFingerprint: "database-product-1-qty-2-unit-5-total-10",
    } as ReconciliationOrder & { businessFingerprint: string };
    dependencies.readLinxOrders.mockResolvedValue([linxOrder]);
    dependencies.readDatabaseOrders.mockResolvedValue([persistedOrder]);

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.differences).toEqual({
      missingInDatabase: 0,
      changedOrders: 1,
      databaseOnly: 0,
    });
    expect(preview.targetLinxIdentifiers).toEqual([
      "00000000-0000-4000-8000-000000000099",
    ]);
  });

  it("chooses the legacy fingerprint from persisted CSV ownership, not from the incoming Linx GUID", async () => {
    const dependencies = makeDependencies(1);
    const baseOrder = {
      historicalKey: {
        documentNumber: "000126",
        organizationId: "org-1",
        date: "2026-07-29",
      },
      cancelled: false,
      itemCount: 2,
      grossValue: 10,
      legacyBusinessFingerprint: "same-legacy-business",
    };
    const linxOrder = {
      ...baseOrder,
      linxIdentifier: "00000000-0000-4000-8000-000000000102",
      businessFingerprint: "linx-full-business",
    } as ReconciliationOrder & { legacyBusinessFingerprint: string };
    const persistedOrder = {
      ...baseOrder,
      linxIdentifier: null,
      businessFingerprint: "csv-full-business",
    } as ReconciliationOrder & { legacyBusinessFingerprint: string };
    dependencies.readLinxOrders.mockResolvedValue([linxOrder]);
    dependencies.readDatabaseOrders.mockResolvedValue([persistedOrder]);

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.differences.changedOrders).toBe(0);
    expect(preview.targetLinxIdentifiers).toEqual([]);
  });

  it("targets a persisted CSV order when its legacy product fingerprint changes", async () => {
    const dependencies = makeDependencies(1);
    const baseOrder = {
      historicalKey: {
        documentNumber: "000127",
        organizationId: "org-1",
        date: "2026-07-29",
      },
      cancelled: false,
      itemCount: 1,
      grossValue: 10,
      businessFingerprint: "same-full-business",
    };
    const linxOrder = {
      ...baseOrder,
      linxIdentifier: "00000000-0000-4000-8000-000000000103",
      legacyBusinessFingerprint: "linx-product-2",
    } as ReconciliationOrder & { legacyBusinessFingerprint: string };
    const persistedOrder = {
      ...baseOrder,
      linxIdentifier: null,
      legacyBusinessFingerprint: "csv-product-1",
    } as ReconciliationOrder & { legacyBusinessFingerprint: string };
    dependencies.readLinxOrders.mockResolvedValue([linxOrder]);
    dependencies.readDatabaseOrders.mockResolvedValue([persistedOrder]);

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.differences.changedOrders).toBe(1);
    expect(preview.targetLinxIdentifiers).toEqual([
      "00000000-0000-4000-8000-000000000103",
    ]);
  });

  it("uses the full fingerprint for a persisted Linx-owned order", async () => {
    const dependencies = makeDependencies(1);
    const baseOrder = {
      historicalKey: {
        documentNumber: "000128",
        organizationId: "org-1",
        date: "2026-07-29",
      },
      cancelled: false,
      itemCount: 1,
      grossValue: 10,
      linxIdentifier: "00000000-0000-4000-8000-000000000104",
      legacyBusinessFingerprint: "same-legacy-business",
    };
    const linxOrder = {
      ...baseOrder,
      businessFingerprint: "linx-full-business",
    } as ReconciliationOrder & { legacyBusinessFingerprint: string };
    const persistedOrder = {
      ...baseOrder,
      businessFingerprint: "persisted-full-business",
    } as ReconciliationOrder & { legacyBusinessFingerprint: string };
    dependencies.readLinxOrders.mockResolvedValue([linxOrder]);
    dependencies.readDatabaseOrders.mockResolvedValue([persistedOrder]);

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.differences.changedOrders).toBe(1);
    expect(preview.targetLinxIdentifiers).toEqual([
      "00000000-0000-4000-8000-000000000104",
    ]);
  });

  it("keeps gross-value comparison outside the legacy fingerprint", async () => {
    const dependencies = makeDependencies(1);
    const baseOrder = {
      historicalKey: {
        documentNumber: "000130",
        organizationId: "org-1",
        date: "2026-07-29",
      },
      cancelled: false,
      itemCount: 1,
      businessFingerprint: "same-full-business",
      legacyBusinessFingerprint: "same-legacy-business",
    };
    const linxOrder = {
      ...baseOrder,
      linxIdentifier: "00000000-0000-4000-8000-000000000106",
      grossValue: 10.01,
    };
    const persistedOrder = {
      ...baseOrder,
      linxIdentifier: null,
      grossValue: 10,
    };
    dependencies.readLinxOrders.mockResolvedValue([linxOrder]);
    dependencies.readDatabaseOrders.mockResolvedValue([persistedOrder]);

    const preview = await previewReconciliation(
      { runtimeBudgetMs: 1_000 },
      dependencies,
    );

    expect(preview.differences.changedOrders).toBe(1);
    expect(preview.targetLinxIdentifiers).toEqual([
      "00000000-0000-4000-8000-000000000106",
    ]);
  });

  it.each([
    ["Linx", false, true],
    ["banco", true, false],
    ["Linx e banco", false, false],
  ] as const)(
    "rejects an absent business fingerprint on %s orders",
    async (_source, linxHasFingerprint, databaseHasFingerprint) => {
      const dependencies = makeDependencies(1);
      const baseOrder = {
        linxIdentifier: "00000000-0000-4000-8000-000000000100",
        historicalKey: {
          documentNumber: "000124",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
        legacyBusinessFingerprint: "valid-legacy-fingerprint",
      };
      const linxOrder = {
        ...baseOrder,
        ...(linxHasFingerprint
          ? { businessFingerprint: "valid-linx-fingerprint" }
          : {}),
      } as unknown as ReconciliationOrder;
      const databaseOrder = {
        ...baseOrder,
        ...(databaseHasFingerprint
          ? { businessFingerprint: "valid-database-fingerprint" }
          : {}),
      } as unknown as ReconciliationOrder;
      dependencies.readLinxOrders.mockResolvedValue([linxOrder]);
      dependencies.readDatabaseOrders.mockResolvedValue([databaseOrder]);

      await expect(
        previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
      ).rejects.toThrow("Fingerprint de negócio ausente na conciliação");
    },
  );

  it("rejects a blank business fingerprint", async () => {
    const dependencies = makeDependencies(1);
    const order = {
      linxIdentifier: "00000000-0000-4000-8000-000000000101",
      historicalKey: {
        documentNumber: "000125",
        organizationId: "org-1",
        date: "2026-07-29",
      },
      cancelled: false,
      itemCount: 1,
      grossValue: 10,
      businessFingerprint: "   ",
      legacyBusinessFingerprint: "valid-legacy-fingerprint",
    };
    dependencies.readLinxOrders.mockResolvedValue([order]);
    dependencies.readDatabaseOrders.mockResolvedValue([
      { ...order, businessFingerprint: "valid-database-fingerprint" },
    ]);

    await expect(
      previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
    ).rejects.toThrow("Fingerprint de negócio ausente na conciliação");
  });

  it.each([
    ["Linx", "absent", undefined],
    ["database", "absent", undefined],
    ["Linx", "blank", "   "],
    ["database", "blank", "   "],
  ] as const)(
    "rejects a %s legacy fingerprint when %s",
    async (source, _case, value) => {
      const dependencies = makeDependencies(1);
      const baseOrder = {
        linxIdentifier: "00000000-0000-4000-8000-000000000105",
        historicalKey: {
          documentNumber: "000129",
          organizationId: "org-1",
          date: "2026-07-29",
        },
        cancelled: false,
        itemCount: 1,
        grossValue: 10,
        businessFingerprint: "valid-full-fingerprint",
      };
      const invalidOrder = {
        ...baseOrder,
        ...(value === undefined ? {} : { legacyBusinessFingerprint: value }),
      } as unknown as ReconciliationOrder;
      const validOrder = {
        ...baseOrder,
        legacyBusinessFingerprint: "valid-legacy-fingerprint",
      };
      dependencies.readLinxOrders.mockResolvedValue([
        source === "Linx" ? invalidOrder : validOrder,
      ]);
      dependencies.readDatabaseOrders.mockResolvedValue([
        source === "database" ? invalidOrder : validOrder,
      ]);

      await expect(
        previewReconciliation({ runtimeBudgetMs: 1_000 }, dependencies),
      ).rejects.toThrow(
        "Fingerprint de negócio legado ausente na conciliação",
      );
    },
  );
});
