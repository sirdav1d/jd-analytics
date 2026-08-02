import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { importSales } from "@/services/sales-import/import-sales";
import type { CanonicalSale } from "@/services/sales-import/contracts";
import { requireTestDatabaseUrl } from "@/tests/setup-integration";

const url = process.env.TEST_DATABASE_URL
  ? requireTestDatabaseUrl()
  : undefined;
const prisma = url ? new PrismaClient({ datasourceUrl: url }) : undefined;
const describeWithTestDatabase = url ? describe : describe.skip;

async function cleanupImportFixture(
  organizationId: string | undefined,
  productCode: number,
  sellerCode: number,
) {
  const errors: unknown[] = [];
  const clean = async (operation: () => Promise<unknown>) => {
    try {
      await operation();
    } catch (error) {
      errors.push(error);
    }
  };

  if (organizationId) {
    await clean(() => prisma!.pedido.deleteMany({ where: { organizationId } }));
    await clean(() => prisma!.organization.delete({ where: { id: organizationId } }));
  }
  await clean(() => prisma!.product.deleteMany({ where: { external_code: productCode } }));
  await clean(() => prisma!.user.deleteMany({ where: { externalId: String(sellerCode) } }));

  if (errors.length > 0) {
    throw new AggregateError(errors, "Falha ao limpar fixture de importação");
  }
}

afterAll(async () => {
  await prisma?.$disconnect();
});

describeWithTestDatabase("canonical sales import idempotency", () => {
  it("keeps one pedido and its items while promoting CSV history to Linx", async () => {
    const suffix = crypto.randomUUID();
    const sellerCode = Math.floor(Math.random() * 1_000_000_000);
    const productCode = Math.floor(Math.random() * 1_000_000_000);
    const documentNumber = `test-${suffix}`;
    const date = new Date("2026-07-29T00:00:00.000Z");
    let organizationId: string | undefined;

    try {
      const organization = await prisma!.organization.create({
        data: { name: `import-sales-${suffix}` },
      });
      organizationId = organization.id;
      const csvSale: CanonicalSale = {
        source: "CSV",
        organizationExternalCode: organization.external_code,
        date,
        documentNumber,
        natureOperation: "Venda",
        operationType: "Saída",
        operationalOrigin: "Teste",
        cancelled: false,
        customer: null,
        seller: { externalCode: sellerCode, name: `Seller ${suffix}` },
        paymentLabel: null,
        commercialOrigin: null,
        items: [{
          productCode,
          description: "Produto CSV",
          brand: "Marca CSV",
          sector: "Setor CSV",
          quantity: 1,
          unitValue: 20,
          totalValue: 20,
        }],
      };

      await Promise.all([
        prisma!.$transaction((tx) => importSales(tx, [csvSale])),
        prisma!.$transaction((tx) => importSales(tx, [csvSale])),
      ]);

      const afterRepeatedCsv = await prisma!.pedido.findUniqueOrThrow({
        where: {
          documentNumber_organizationId_data_pedido: {
            documentNumber,
            organizationId: organization.id,
            data_pedido: date,
          },
        },
        include: { items: true },
      });
      expect(afterRepeatedCsv.items).toHaveLength(1);
      expect(afterRepeatedCsv.linxIdentifier).toBeNull();

      const linxIdentifier = crypto.randomUUID();
      const linxSale: CanonicalSale = {
        ...csvSale,
        source: "LINX",
        linxIdentifier,
        items: [{
          ...csvSale.items[0],
          description: "Produto Linx",
          linxOrder: 1,
        }],
      };
      await Promise.all([
        prisma!.$transaction((tx) => importSales(tx, [linxSale])),
        prisma!.$transaction((tx) => importSales(tx, [{
          ...linxSale,
          linxIdentifier: linxIdentifier.toUpperCase(),
        }])),
      ]);

      const promoted = await prisma!.pedido.findUniqueOrThrow({
        where: {
          documentNumber_organizationId_data_pedido: {
            documentNumber,
            organizationId: organization.id,
            data_pedido: date,
          },
        },
        include: { items: true },
      });
      expect(promoted.id).toBe(afterRepeatedCsv.id);
      expect(promoted.linxIdentifier).toBe(linxIdentifier);
      expect(promoted.items).toHaveLength(1);
      expect(promoted.items[0]?.linxOrder).toBe(1);
    } finally {
      await cleanupImportFixture(organizationId, productCode, sellerCode);
    }
  });
});
