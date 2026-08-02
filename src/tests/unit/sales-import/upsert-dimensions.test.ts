import { afterEach, describe, expect, it, vi } from "vitest";

const bcryptHash = vi.hoisted(() => vi.fn());

vi.mock("bcrypt", () => ({
  default: { hash: bcryptHash },
}));

import { upsertSeller } from "@/services/sales-import/upsert-dimensions";

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
