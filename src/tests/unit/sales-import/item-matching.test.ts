import { describe, expect, it } from "vitest";
import type { CanonicalSaleItem } from "@/services/sales-import/contracts";
import { planItemChanges } from "@/services/sales-import/item-matching";

type ExistingSaleItem = Omit<
  CanonicalSaleItem,
  "description" | "brand" | "sector" | "linxOrder"
> & {
  id: string;
  linxOrder: number | null;
};

const saleItem = (
  overrides: Partial<CanonicalSaleItem> = {},
): CanonicalSaleItem => ({
  productCode: 10,
  description: "Produto teste",
  brand: "Marca teste",
  sector: "Setor teste",
  quantity: 1,
  unitValue: 20,
  totalValue: 20,
  ...overrides,
});

const existingItem = (
  id: string,
  linxOrder: number | null,
  overrides: Partial<CanonicalSaleItem> = {},
): ExistingSaleItem => ({ id, ...saleItem(overrides), linxOrder });

describe("planItemChanges", () => {
  it("matches repeated CSV lines to distinct existing fingerprint occurrences", () => {
    const result = planItemChanges(
      [
        existingItem("a", null),
        existingItem("b", null),
      ],
      [saleItem(), saleItem()],
    );

    expect(result).toMatchObject({
      create: [],
      update: [{ id: "a" }, { id: "b" }],
      remove: [],
    });
  });

  it("does not reuse one existing item for repeated incoming lines", () => {
    const result = planItemChanges(
      [existingItem("a", null)],
      [saleItem(), saleItem()],
    );

    expect(result).toMatchObject({
      create: [saleItem()],
      update: [{ id: "a" }],
      remove: [],
    });
  });

  it("uses Linx order before the fallback fingerprint", () => {
    const result = planItemChanges(
      [
        existingItem("fingerprint", 1),
        existingItem("linx-order", 2, { quantity: 2, totalValue: 40 }),
      ],
      [saleItem({ linxOrder: 2 })],
    );

    expect(result).toMatchObject({
      create: [],
      update: [{ id: "linx-order", linxOrder: 2, quantity: 1, totalValue: 20 }],
      remove: [],
    });
  });

  it("promotes a CSV item to Linx identity by product occurrence", () => {
    const result = planItemChanges(
      [existingItem("a", null)],
      [saleItem({ quantity: 2, totalValue: 40, linxOrder: 1 })],
    );

    expect(result).toMatchObject({
      create: [],
      update: [{ id: "a", linxOrder: 1, quantity: 2, totalValue: 40 }],
      remove: [],
    });
  });

  it("removes only an explicitly excluded Linx item", () => {
    const result = planItemChanges(
      [existingItem("a", 1)],
      [saleItem({ linxOrder: 1, excluded: true })],
    );

    expect(result).toEqual({ create: [], update: [], remove: ["a"] });
  });

  it("does not remove a different Linx item when an excluded order has no exact match", () => {
    const result = planItemChanges(
      [existingItem("order-1", 1), existingItem("order-2", 2)],
      [saleItem({ linxOrder: 3, excluded: true })],
    );

    expect(result).toEqual({ create: [], update: [], remove: [] });
  });

  it("removes a matching CSV item when its first Linx exclusion arrives", () => {
    const result = planItemChanges(
      [existingItem("csv", null)],
      [saleItem({ linxOrder: 1, excluded: true })],
    );

    expect(result).toEqual({ create: [], update: [], remove: ["csv"] });
  });

  it("ignores an excluded item without a Linx order", () => {
    const result = planItemChanges(
      [existingItem("csv", null)],
      [saleItem({ excluded: true })],
    );

    expect(result).toEqual({ create: [], update: [], remove: [] });
  });

  it("does not create an excluded incoming item without a match", () => {
    const result = planItemChanges([], [saleItem({ linxOrder: 1, excluded: true })]);

    expect(result).toEqual({ create: [], update: [], remove: [] });
  });

  it("does not remove an existing item that is absent from incoming data", () => {
    const result = planItemChanges([existingItem("a", 1)], []);

    expect(result).toEqual({ create: [], update: [], remove: [] });
  });

  it("never fingerprint-matches an existing item whose product has no external code", () => {
    const itemWithoutExternalCode = {
      ...existingItem("missing-code", null),
      productCode: null,
    };

    const result = planItemChanges([itemWithoutExternalCode] as never, [saleItem()]);

    expect(result).toMatchObject({
      create: [saleItem()],
      update: [],
      remove: [],
    });
  });
});
