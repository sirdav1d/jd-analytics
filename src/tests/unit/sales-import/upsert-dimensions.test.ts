import { afterEach, describe, expect, it, vi } from "vitest";

const bcryptHash = vi.hoisted(() => vi.fn());

vi.mock("bcrypt", () => ({
  default: { hash: bcryptHash },
}));

import {
  upsertProduct,
  upsertSeller,
} from "@/services/sales-import/upsert-dimensions";

afterEach(() => {
  bcryptHash.mockReset();
});

describe("upsertSeller", () => {
  it("updates an existing seller without hashing a throwaway password", async () => {
    const tx = {
      user: {
        findUnique: vi.fn().mockResolvedValue({ id: "seller-1" }),
        update: vi.fn().mockResolvedValue({ id: "seller-1" }),
        upsert: vi.fn(),
      },
    };

    await upsertSeller(tx as never, { externalCode: 20, name: "Vendedora" });

    expect(tx.user.update).toHaveBeenCalledWith({
      where: { id: "seller-1" },
      data: { name: "Vendedora" },
    });
    expect(tx.user.upsert).not.toHaveBeenCalled();
    expect(bcryptHash).not.toHaveBeenCalled();
  });

  it("hashes a random password only for a missing seller and still uses atomic upsert", async () => {
    bcryptHash.mockResolvedValue("bcrypt-hash");
    const tx = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        update: vi.fn(),
        upsert: vi.fn().mockResolvedValue({ id: "seller-1" }),
      },
    };

    await upsertSeller(tx as never, { externalCode: 20, name: "Vendedora" });

    expect(bcryptHash).toHaveBeenCalledOnce();
    expect(tx.user.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { externalId: "20" },
      create: expect.objectContaining({ password: "bcrypt-hash" }),
    }));
  });
});

describe("upsertProduct", () => {
  it("does not let a delayed Linx PENDING write downgrade CSV-resolved metadata", async () => {
    const product = {
      id: "product-1",
      external_code: 100,
      description: "Produto não identificado — código 100",
      brand: "Não informado",
      sector: "Não informado",
      catalogStatus: "PENDING" as "KNOWN" | "PENDING",
      catalogLastCheckedAt: new Date("2026-08-11T11:00:00.000Z") as Date | null,
      catalogResolvedAt: null as Date | null,
    };
    let releaseFirstUpsert!: () => void;
    const firstUpsertBlocked = new Promise<void>((resolve) => {
      releaseFirstUpsert = resolve;
    });
    let markFirstUpsertEntered!: () => void;
    const firstUpsertEntered = new Promise<void>((resolve) => {
      markFirstUpsertEntered = resolve;
    });
    let upsertCallCount = 0;
    const tx = {
      product: {
        upsert: vi.fn(async (args: {
          update: Record<string, unknown>;
          create: Record<string, unknown>;
        }) => {
          upsertCallCount += 1;
          if (upsertCallCount === 1) {
            markFirstUpsertEntered();
            await firstUpsertBlocked;
          }
          Object.assign(product, args.update);
          return { ...product };
        }),
        updateMany: vi.fn(async (args: {
          where: { id: string; catalogStatus: "PENDING" };
          data: Record<string, unknown>;
        }) => {
          if (
            args.where.id === product.id &&
            product.catalogStatus === args.where.catalogStatus
          ) {
            Object.assign(product, args.data);
            return { count: 1 };
          }
          return { count: 0 };
        }),
      },
    };

    const linxWrite = upsertProduct(
      tx as never,
      {
        productCode: 100,
        description: "Produto não identificado — código 100",
        brand: "Não informado",
        sector: "Não informado",
        quantity: 1,
        unitValue: 20,
        totalValue: 20,
        catalogStatus: "PENDING",
        catalogLastCheckedAt: new Date("2026-08-11T12:00:00.000Z"),
        catalogResolvedAt: null,
      },
      "LINX",
    );
    await firstUpsertEntered;

    await upsertProduct(
      tx as never,
      {
        productCode: 100,
        description: "Produto CSV",
        brand: "Marca CSV",
        sector: "Setor CSV",
        quantity: 1,
        unitValue: 20,
        totalValue: 20,
      },
      "CSV",
    );
    releaseFirstUpsert();
    await linxWrite;

    expect(product).toMatchObject({
      description: "Produto CSV",
      brand: "Marca CSV",
      sector: "Setor CSV",
      catalogStatus: "KNOWN",
      catalogResolvedAt: expect.any(Date),
    });
  });
});
