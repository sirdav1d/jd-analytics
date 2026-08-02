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
