import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { requireTestDatabaseUrl } from "@/tests/setup-integration";

const url = process.env.TEST_DATABASE_URL
  ? requireTestDatabaseUrl()
  : undefined;
const prisma = url ? new PrismaClient({ datasourceUrl: url }) : undefined;
const describeWithTestDatabase = url ? describe : describe.skip;

afterAll(async () => {
  await prisma?.$disconnect();
});

describeWithTestDatabase("Linx schema", () => {
  it("defaults existing-style products to a known catalog state", async () => {
    let productId: string | undefined;
    try {
      const product = await prisma!.product.create({
        data: {
          external_code: 2_000_000_000 + Math.floor(Math.random() * 100_000),
          description: "Produto de contrato",
          brand: "Marca",
          sector: "Setor",
        },
      });
      productId = product.id;
      expect(product.catalogStatus).toBe("KNOWN");
      expect(product.catalogLastCheckedAt).toBeNull();
      expect(product.catalogResolvedAt).toBeNull();
    } finally {
      if (productId) await prisma!.product.delete({ where: { id: productId } });
    }
  });

  it("accepts nullable Linx identity on historical organizations", async () => {
    let organizationId: string | undefined;

    try {
      const organization = await prisma!.organization.create({
        data: { name: `historical-${crypto.randomUUID()}` },
      });
      organizationId = organization.id;

      expect(organization.linxCnpj).toBeNull();
      expect(organization.linxPortalId).toBeNull();
      expect(organization.linxCompanyId).toBeNull();
      expect(organization.linxSyncEnabled).toBeNull();
    } finally {
      if (organizationId) {
        await prisma!.organization.delete({ where: { id: organizationId } });
      }
    }
  });
});
