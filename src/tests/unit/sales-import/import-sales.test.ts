import { describe, expect, it, vi } from "vitest";
import { importOrigins } from "@/services/sales-import/import-origins";
import { importSales } from "@/services/sales-import/import-sales";
import type { CanonicalSale, CanonicalSaleItem } from "@/services/sales-import/contracts";

const date = new Date("2026-07-29T00:00:00.000Z");

function makeCanonicalSale(
  overrides: Partial<CanonicalSale> = {},
): CanonicalSale {
  return {
    source: "CSV",
    organizationExternalCode: 1,
    date,
    documentNumber: "DOC-1",
    natureOperation: "Venda",
    operationType: "Saída",
    operationalOrigin: "Loja",
    cancelled: false,
    customer: { externalCode: 10, name: "Cliente" },
    seller: { externalCode: 20, name: "Vendedora" },
    paymentLabel: "PIX",
    commercialOrigin: "Google",
    items: [makeCanonicalItem()],
    ...overrides,
  };
}

function makeCanonicalItem(
  overrides: Partial<CanonicalSaleItem> = {},
): CanonicalSaleItem {
  return {
    productCode: 100,
    description: "Produto CSV",
    brand: "Marca CSV",
    sector: "Setor CSV",
    quantity: 1,
    unitValue: 20,
    totalValue: 20,
    ...overrides,
  };
}

function makeExistingItem(overrides: Record<string, unknown> = {}) {
  return {
    id: "item-1",
    quantity: 1,
    unitValue: 20,
    totalValue: 20,
    linxOrder: null,
    linxTimestamp: null,
    product: { external_code: 100 },
    ...overrides,
  };
}

function makeTransactionDouble(options: {
  byComposite?: Record<string, unknown> | null;
  byLinx?: Record<string, unknown> | null;
} = {}) {
  const calls: string[] = [];
  const organization = { id: "org-1", external_code: 1 };
  const pedido = options.byComposite ?? null;

  return {
    calls,
    $transaction: vi.fn(),
    $queryRaw: vi.fn(async (query: { values?: unknown[]; strings?: string[] }) => {
      calls.push(`lock:${String(query.values?.[0])}`);
      return [];
    }),
    organization: {
      findUniqueOrThrow: vi.fn(async () => {
        calls.push("organization.findUniqueOrThrow");
        return organization;
      }),
    },
    pedido: {
      findUnique: vi.fn(async () => {
        calls.push("pedido.findUnique");
        return pedido;
      }),
      findFirst: vi.fn(async ({ where }: { where: { linxIdentifier?: string } }) => {
        calls.push("pedido.findFirst");
        return where.linxIdentifier ? options.byLinx ?? null : null;
      }),
      create: vi.fn(async () => {
        calls.push("pedido.create");
        return { id: "pedido-new" };
      }),
      update: vi.fn(async () => {
        calls.push("pedido.update");
        return { id: (pedido as { id?: string } | null)?.id ?? "pedido-1" };
      }),
      updateMany: vi.fn(async () => {
        calls.push("pedido.updateMany");
        return { count: 1 };
      }),
    },
    user: {
      findUnique: vi.fn(async () => {
        calls.push("user.findUnique");
        return { id: "seller-1" };
      }),
      update: vi.fn(async () => {
        calls.push("user.update");
        return { id: "seller-1" };
      }),
      create: vi.fn(async () => {
        calls.push("user.create");
        return { id: "seller-1" };
      }),
      upsert: vi.fn(async () => {
        calls.push("user.upsert");
        return { id: "seller-1" };
      }),
    },
    customer: {
      upsert: vi.fn(async () => {
        calls.push("customer.upsert");
        return { id: "customer-1" };
      }),
    },
    paymentMethod: {
      upsert: vi.fn(async () => {
        calls.push("paymentMethod.upsert");
        return { id: "payment-1" };
      }),
    },
    origin: {
      upsert: vi.fn(async () => {
        calls.push("origin.upsert");
        return { id: "origin-1" };
      }),
    },
    product: {
      upsert: vi.fn(async () => {
        calls.push("product.upsert");
        return { id: "product-1" };
      }),
      updateMany: vi.fn(async () => {
        calls.push("product.updateMany");
        return { count: 1 };
      }),
    },
    saleItem: {
      create: vi.fn(async () => calls.push("saleItem.create")),
      update: vi.fn(async () => calls.push("saleItem.update")),
      deleteMany: vi.fn(async () => {
        calls.push("saleItem.deleteMany");
        return { count: 1 };
      }),
    },
  };
}

describe("importSales", () => {
  it("does not create a cancelled Linx sale that is absent from the database", async () => {
    const tx = makeTransactionDouble();

    const result = await importSales(tx as never, [
      makeCanonicalSale({
        source: "LINX",
        cancelled: true,
        linxIdentifier: crypto.randomUUID(),
        items: [makeCanonicalItem({ linxOrder: 1 })],
      }),
    ]);

    expect(result).toEqual({
      ordersProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsRemoved: 0,
    });
    expect(tx.pedido.create).not.toHaveBeenCalled();
    expect(tx.pedido.updateMany).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
  });

  it("does not create a Linx sale with no active items", async () => {
    const tx = makeTransactionDouble();

    const result = await importSales(tx as never, [
      makeCanonicalSale({
        source: "LINX",
        linxIdentifier: crypto.randomUUID(),
        items: [makeCanonicalItem({ linxOrder: 1, excluded: true })],
      }),
    ]);

    expect(result).toEqual({
      ordersProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsRemoved: 0,
    });
    expect(tx.pedido.create).not.toHaveBeenCalled();
    expect(tx.pedido.updateMany).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
  });

  it("promotes a CSV pedido when the Linx GUID belongs to its composite key", async () => {
    const tx = makeTransactionDouble({
      byComposite: { id: "pedido-1", linxIdentifier: null, items: [] },
    });
    const linxIdentifier = crypto.randomUUID();

    await importSales(tx as never, [
      makeCanonicalSale({
        source: "LINX",
        linxIdentifier,
        items: [makeCanonicalItem({ linxOrder: 1 })],
      }),
    ]);

    expect(tx.pedido.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "pedido-1",
          organizationId: "org-1",
          OR: [
            { linxIdentifier: null },
            { linxIdentifier },
          ],
        },
        data: expect.objectContaining({ linxIdentifier }),
      }),
    );
    expect(tx.$transaction).not.toHaveBeenCalled();
  });

  it("does not create item duplicates on a repeated CSV import", async () => {
    const tx = makeTransactionDouble({
      byComposite: { id: "pedido-1", linxIdentifier: null, items: [makeExistingItem()] },
    });

    const result = await importSales(tx as never, [makeCanonicalSale()]);

    expect(result).toMatchObject({ itemsCreated: 0, itemsUpdated: 1 });
    expect(tx.saleItem.create).not.toHaveBeenCalled();
    expect(tx.saleItem.update).toHaveBeenCalledOnce();
  });

  it("does not overwrite an already linked Linx sale with CSV", async () => {
    const tx = makeTransactionDouble({
      byComposite: {
        id: "pedido-1",
        linxIdentifier: crypto.randomUUID(),
        items: [makeExistingItem({ linxOrder: 1 })],
      },
    });

    await importSales(tx as never, [makeCanonicalSale()]);

    expect(tx.pedido.update).not.toHaveBeenCalled();
    expect(tx.user.update).not.toHaveBeenCalled();
    expect(tx.saleItem.update).not.toHaveBeenCalled();
    expect(tx.saleItem.create).not.toHaveBeenCalled();
  });

  it("rejects a CSV exclusion before it can remove an existing item", async () => {
    const tx = makeTransactionDouble({
      byComposite: {
        id: "pedido-1",
        linxIdentifier: null,
        items: [makeExistingItem({ linxOrder: 1 })],
      },
    });

    await expect(importSales(tx as never, [
      makeCanonicalSale({
        items: [makeCanonicalItem({ linxOrder: 1, excluded: true })],
      }),
    ])).rejects.toThrow(/CSV/);

    expect(tx.saleItem.deleteMany).not.toHaveBeenCalled();
  });

  it("fails rather than merging two pedidos found by GUID and composite key", async () => {
    const tx = makeTransactionDouble({
      byLinx: {
        id: "pedido-linx",
        organizationId: "org-1",
        linxIdentifier: crypto.randomUUID(),
        items: [],
      },
      byComposite: { id: "pedido-csv", linxIdentifier: null, items: [] },
    });

    await expect(
      importSales(tx as never, [
        makeCanonicalSale({
          source: "LINX",
          linxIdentifier: crypto.randomUUID(),
          items: [makeCanonicalItem({ linxOrder: 1 })],
        }),
      ]),
    ).rejects.toThrow("colisão");
    expect(tx.pedido.updateMany).not.toHaveBeenCalled();
  });

  it("rejects a Linx GUID owned by another organization without any mutable write", async () => {
    const linxIdentifier = "7c0ab11c-95b6-4e14-8186-bb5292198ff1";
    const tx = makeTransactionDouble({
      byLinx: {
        id: "foreign-pedido",
        organizationId: "org-2",
        linxIdentifier,
        items: [],
      },
    });

    await expect(
      importSales(tx as never, [
        makeCanonicalSale({
          source: "LINX",
          linxIdentifier,
          items: [makeCanonicalItem({ linxOrder: 1 })],
        }),
      ]),
    ).rejects.toThrow("colisão");

    expect(tx.calls).toEqual([
      "lock:sales-import:composite:1:DOC-1:1785283200000",
      `lock:sales-import:linx:${linxIdentifier}`,
      "organization.findUniqueOrThrow",
      "pedido.findFirst",
    ]);
  });

  it("uses the legacy stable seller fallback during the fast lookup", async () => {
    const tx = makeTransactionDouble();

    await importSales(tx as never, [
      makeCanonicalSale({ seller: { externalCode: null, name: "Sem código" } }),
    ]);

    expect(tx.user.findUnique).toHaveBeenCalledWith({
      where: { externalId: "não encontrado" },
    });
  });

  it("keeps CSV product metadata while Linx updates it", async () => {
    const csvTx = makeTransactionDouble();
    await importSales(csvTx as never, [makeCanonicalSale()]);
    expect(csvTx.product.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: {} }),
    );

    const linxTx = makeTransactionDouble();
    await importSales(linxTx as never, [
      makeCanonicalSale({
        source: "LINX",
        linxIdentifier: crypto.randomUUID(),
        items: [makeCanonicalItem({ linxOrder: 1 })],
      }),
    ]);
    expect(linxTx.product.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ description: "Produto CSV" }),
      }),
    );
  });

  it("persists a pending Linx product with its successful check time", async () => {
    const tx = makeTransactionDouble();
    const checkedAt = new Date("2026-08-11T12:00:00.000Z");

    await importSales(tx as never, [
      makeCanonicalSale({
        source: "LINX",
        linxIdentifier: crypto.randomUUID(),
        items: [makeCanonicalItem({
          linxOrder: 1,
          catalogStatus: "PENDING",
          catalogLastCheckedAt: checkedAt,
          catalogResolvedAt: null,
        })],
      }),
    ]);

    expect(tx.product.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: {},
        create: expect.objectContaining({
          catalogStatus: "PENDING",
        }),
      }),
    );
    expect(tx.product.updateMany).toHaveBeenCalledWith({
      where: { id: "product-1", catalogStatus: "PENDING" },
      data: expect.objectContaining({
        catalogStatus: "PENDING",
        catalogLastCheckedAt: checkedAt,
        catalogResolvedAt: null,
      }),
    });
  });

  it("lets CSV metadata resolve only a pending product", async () => {
    const tx = makeTransactionDouble();
    await importSales(tx as never, [makeCanonicalSale()]);

    expect(tx.product.updateMany).toHaveBeenCalledWith({
      where: { id: "product-1", catalogStatus: "PENDING" },
      data: expect.objectContaining({
        description: "Produto CSV",
        brand: "Marca CSV",
        sector: "Setor CSV",
        catalogStatus: "KNOWN",
        catalogResolvedAt: expect.any(Date),
      }),
    });
  });

  it("applies explicit Linx removals after creates and updates in the supplied transaction", async () => {
    const tx = makeTransactionDouble({
      byComposite: {
        id: "pedido-1",
        linxIdentifier: null,
        items: [makeExistingItem({ linxOrder: 1 }), makeExistingItem({ id: "item-2", linxOrder: 2 })],
      },
    });

    const result = await importSales(tx as never, [
      makeCanonicalSale({
        source: "LINX",
        linxIdentifier: crypto.randomUUID(),
        items: [
          makeCanonicalItem({ linxOrder: 1, quantity: 2, totalValue: 40 }),
          makeCanonicalItem({ productCode: 200, linxOrder: 3 }),
          makeCanonicalItem({ productCode: 999, linxOrder: 2, excluded: true }),
        ],
      }),
    ]);

    expect(result).toMatchObject({ itemsCreated: 1, itemsUpdated: 1, itemsRemoved: 1 });
    expect(tx.calls).toEqual(expect.arrayContaining([
      "pedido.updateMany",
      "saleItem.update",
      "saleItem.create",
      "saleItem.deleteMany",
    ]));
    expect(tx.calls.indexOf("saleItem.deleteMany")).toBeGreaterThan(
      tx.calls.indexOf("saleItem.create"),
    );
  });

  it("creates a disambiguated pedido when the historical key belongs to another Linx GUID", async () => {
    const linxIdentifier = crypto.randomUUID();
    const tx = makeTransactionDouble({
      byComposite: {
        id: "pedido-1",
        linxIdentifier: crypto.randomUUID(),
        items: [],
      },
    });

    await expect(importSales(tx as never, [
      makeCanonicalSale({
        source: "LINX",
        linxIdentifier,
        items: [makeCanonicalItem({ linxOrder: 1 })],
      }),
    ])).resolves.toMatchObject({ ordersProcessed: 1 });

    expect(tx.pedido.updateMany).not.toHaveBeenCalled();
    expect(tx.pedido.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        documentNumber: `DOC-1#linx:${linxIdentifier}`,
        linxIdentifier,
      }),
    });
    expect(tx.saleItem.create).toHaveBeenCalledOnce();
  });

  it("preserves a disambiguated document when replaying its Linx GUID", async () => {
    const linxIdentifier = crypto.randomUUID();
    const documentNumber = `DOC-1#linx:${linxIdentifier}`;
    const tx = makeTransactionDouble({
      byLinx: {
        id: "pedido-linx",
        organizationId: "org-1",
        documentNumber,
        linxIdentifier,
        items: [],
      },
      byComposite: {
        id: "pedido-other",
        organizationId: "org-1",
        documentNumber: "DOC-1",
        linxIdentifier: crypto.randomUUID(),
        items: [],
      },
    });

    await expect(
      importSales(tx as never, [
        makeCanonicalSale({
          source: "LINX",
          linxIdentifier,
          items: [makeCanonicalItem({ linxOrder: 1 })],
        }),
      ]),
    ).resolves.toMatchObject({ ordersProcessed: 1 });

    expect(tx.pedido.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ documentNumber }),
      }),
    );
  });

  it.each([
    ["identifier", makeCanonicalSale({ linxIdentifier: crypto.randomUUID() })],
    ["sale timestamp", makeCanonicalSale({ linxTimestamp: BigInt(1) })],
    ["item order", makeCanonicalSale({ items: [makeCanonicalItem({ linxOrder: 1 })] })],
    ["item timestamp", makeCanonicalSale({ items: [makeCanonicalItem({ linxTimestamp: BigInt(1) })] })],
    ["item exclusion", makeCanonicalSale({ items: [makeCanonicalItem({ excluded: false })] })],
  ])("rejects CSV Linx metadata (%s) before any transaction effect", async (_case, sale) => {
    const tx = makeTransactionDouble();

    await expect(importSales(tx as never, [sale])).rejects.toThrow(/CSV/);

    expect(tx.calls).toEqual([]);
  });

  it.each([
    ["missing GUID", makeCanonicalSale({ source: "LINX", linxIdentifier: undefined, items: [makeCanonicalItem({ linxOrder: 1 })] })],
    ["invalid GUID", makeCanonicalSale({ source: "LINX", linxIdentifier: "not-a-uuid", items: [makeCanonicalItem({ linxOrder: 1 })] })],
    ["missing item order", makeCanonicalSale({ source: "LINX", linxIdentifier: crypto.randomUUID() })],
    ["fractional item order", makeCanonicalSale({ source: "LINX", linxIdentifier: crypto.randomUUID(), items: [makeCanonicalItem({ linxOrder: 1.5 })] })],
    ["duplicate item order", makeCanonicalSale({ source: "LINX", linxIdentifier: crypto.randomUUID(), items: [makeCanonicalItem({ linxOrder: 1 }), makeCanonicalItem({ productCode: 101, linxOrder: 1 })] })],
  ])("rejects Linx %s before any transaction effect", async (_case, sale) => {
    const tx = makeTransactionDouble();

    await expect(importSales(tx as never, [sale])).rejects.toThrow(/Linx/);

    expect(tx.calls).toEqual([]);
  });

  it.each([
    makeCanonicalSale({ items: [makeCanonicalItem({ productCode: -1 })] }),
    makeCanonicalSale({ items: [makeCanonicalItem({ productCode: 1.5 })] }),
    makeCanonicalSale({ source: "LINX", linxIdentifier: crypto.randomUUID(), items: [makeCanonicalItem({ productCode: -1, linxOrder: 1 })] }),
  ])("rejects a non-positive or non-integer product code before any transaction effect", async (sale) => {
    const tx = makeTransactionDouble();

    await expect(importSales(tx as never, [sale])).rejects.toThrow(/Código de produto/);

    expect(tx.calls).toEqual([]);
  });

  it("takes sorted advisory locks for the composite and Linx identities before querying", async () => {
    const tx = makeTransactionDouble();
    const linxIdentifier = crypto.randomUUID();

    await importSales(tx as never, [
      makeCanonicalSale({
        source: "LINX",
        linxIdentifier,
        items: [makeCanonicalItem({ linxOrder: 1 })],
      }),
      makeCanonicalSale({ documentNumber: "DOC-2" }),
    ]);

    const lockKeys = tx.$queryRaw.mock.calls.map(([query]) => query.values![0] as string);
    const lockSql = tx.$queryRaw.mock.calls
      .map(([query]) => query.strings!.join("?"))
      .join(" ");
    expect(lockKeys).toHaveLength(3);
    expect(lockKeys).toEqual([...lockKeys].sort());
    expect(lockSql).toContain("pg_advisory_xact_lock(hashtextextended(");
    expect(lockSql).toContain(")::text");
    expect(lockKeys.join(" ")).toContain("composite");
    expect(lockKeys.join(" ")).toContain(linxIdentifier);
    expect(tx.calls.indexOf("organization.findUniqueOrThrow")).toBeGreaterThan(
      tx.calls.lastIndexOf(`lock:${lockKeys.at(-1)}`),
    );
  });

  it("aborts when conditional Linx promotion loses its identity race", async () => {
    const tx = makeTransactionDouble({
      byComposite: { id: "pedido-1", linxIdentifier: null, items: [] },
    });
    tx.pedido.updateMany.mockResolvedValue({ count: 0 });

    await expect(importSales(tx as never, [makeCanonicalSale({
      source: "LINX",
      linxIdentifier: crypto.randomUUID(),
      items: [makeCanonicalItem({ linxOrder: 1 })],
    })])).rejects.toThrow("colisão");

    expect(tx.saleItem.create).not.toHaveBeenCalled();
    expect(tx.saleItem.update).not.toHaveBeenCalled();
  });

  it("replays an uppercase Linx GUID as the same canonical lowercase identity", async () => {
    const lowercaseGuid = crypto.randomUUID();
    const tx = makeTransactionDouble({
      byComposite: {
        id: "pedido-1",
        linxIdentifier: lowercaseGuid,
        items: [makeExistingItem({ linxOrder: 1 })],
      },
      byLinx: {
        id: "pedido-1",
        organizationId: "org-1",
        linxIdentifier: lowercaseGuid,
        items: [makeExistingItem({ linxOrder: 1 })],
      },
    });

    await expect(importSales(tx as never, [makeCanonicalSale({
      source: "LINX",
      linxIdentifier: lowercaseGuid.toUpperCase(),
      items: [makeCanonicalItem({ linxOrder: 1 })],
    })])).resolves.toMatchObject({ ordersProcessed: 1 });

    expect(tx.pedido.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { linxIdentifier: lowercaseGuid },
    }));
    expect(tx.pedido.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ linxIdentifier: lowercaseGuid }),
    }));
    expect(tx.$queryRaw.mock.calls.map(([query]) => query.values![0])).toContain(
      `sales-import:linx:${lowercaseGuid}`,
    );
  });

  it("rejects an invalid sale date before locks or transaction delegates", async () => {
    const tx = makeTransactionDouble();

    await expect(importSales(tx as never, [makeCanonicalSale({
      date: new Date("not-a-date"),
    })])).rejects.toThrow(/Data/);

    expect(tx.calls).toEqual([]);
  });
});

describe("importOrigins", () => {
  it("fails when the requested pedido does not exist", async () => {
    const tx = makeTransactionDouble();

    await expect(
      importOrigins(tx as never, [{
        organizationExternalCode: 1,
        date,
        documentNumber: "missing",
        commercialOrigin: "Google",
      }]),
    ).rejects.toThrow("Pedido missing não encontrado");

    expect(tx.origin.upsert).not.toHaveBeenCalled();
  });
});
