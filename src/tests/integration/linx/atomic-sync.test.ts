import { randomInt, randomUUID } from "node:crypto";
import { PrismaClient, type Prisma } from "@prisma/client";
import { afterAll, describe, expect, it, vi } from "vitest";
import { createDeadline } from "@/services/linx/deadline";
import { LINX_SYNC_FAILURE_MESSAGE } from "@/services/linx/errors";
import {
  runLinxSyncWithDependencies,
  type SyncDependencies,
} from "@/services/linx/sync";
import { importSales } from "@/services/sales-import/import-sales";
import { requireTestDatabaseUrl } from "@/tests/setup-integration";

const testUrl = process.env.TEST_DATABASE_URL
  ? requireTestDatabaseUrl()
  : undefined;
const prisma = testUrl
  ? new PrismaClient({ datasourceUrl: testUrl })
  : undefined;
const describeWithTestDatabase = prisma ? describe : describe.skip;

afterAll(async () => {
  await prisma?.$disconnect();
});

describeWithTestDatabase("atomic Linx synchronization", () => {
  it("rolls back sales and every cursor when the final cursor write violates a constraint", async () => {
    const suffix = randomUUID();
    const sellerCode = randomInt(100_000_000, 900_000_000);
    const productCode = randomInt(100_000_000, 900_000_000);
    const linxIdentifier = randomUUID();
    const cnpj = `99${randomInt(0, 999_999_999_999)
      .toString()
      .padStart(12, "0")}`;
    let organizationId: string | undefined;

    try {
      const organization = await prisma!.organization.create({
        data: { name: `atomic-linx-${suffix}`, linxCnpj: cnpj },
      });
      organizationId = organization.id;
      const deadlineAt = Date.now() + 60_000;
      const transaction = <T>(
        callback: (tx: Prisma.TransactionClient) => Promise<T>,
        options: { maxWait: number; timeout: number },
      ) => prisma!.$transaction(callback, options);
      const page = (timestamp: string) =>
        Promise.resolve({
          rows: [{ timestamp }],
          nextTimestamp: BigInt(timestamp),
        });

      const dependencies: SyncDependencies = {
        prisma: { $transaction: transaction },
        repo: {
          acquireSyncRun: (input) =>
            prisma!.linxSyncRun.create({
              data: {
                organizationId: input.organizationId,
                requestedById: input.requestedById,
                trigger: input.trigger,
                status: "RUNNING",
                stage: "ACQUIRED",
                leaseExpiresAt: input.leaseExpiresAt,
              },
            }),
          hasCursorBaseline: async () => true,
          getCursors: async () => ({
            MOVIMENTO: BigInt(0),
            MOVIMENTO_PLANOS: BigInt(0),
            MOVIMENTO_PRINCIPAL: BigInt(0),
            ROTINA_ORIGEM: BigInt(0),
            RESPOSTA_VENDA: BigInt(0),
          }),
          saveCursors: async (tx, requestedOrganizationId, cursors) => {
            for (const [method, lastTimestamp] of Object.entries(cursors)) {
              await tx.linxSyncCursor.upsert({
                where: {
                  organizationId_method: {
                    organizationId: requestedOrganizationId,
                    method: method as keyof typeof cursors,
                  },
                },
                create: {
                  organizationId: requestedOrganizationId,
                  method: method as keyof typeof cursors,
                  lastTimestamp: lastTimestamp!,
                },
                update: { lastTimestamp },
              });
            }

            try {
              await tx.linxSyncCursor.create({
                data: {
                  organizationId: requestedOrganizationId,
                  method: "RESPOSTA_VENDA",
                  lastTimestamp: BigInt(999),
                },
              });
            } catch {
              throw new Error(
                "<senha>integration-secret</senha> cursor constraint",
              );
            }
          },
          markRunSuccess: (tx, runId, summary, finishedAt) =>
            tx.linxSyncRun.update({
              where: { id: runId },
              data: {
                status: "SUCCESS",
                processedOrders: summary.processedOrders,
                processedItems: summary.processedItems,
                finishedAt,
              },
            }),
          markRunFailed: (runId, error, finishedAt) =>
            prisma!.linxSyncRun.update({
              where: { id: runId },
              data: {
                status: "FAILED",
                stage: "FAILED",
                finishedAt,
                leaseExpiresAt: null,
                errorMessage: String(error),
              },
            }),
        },
        deadline: createDeadline(Date.now, deadlineAt),
        nowDate: () => new Date(),
        readOrganization: async () => ({
          linxCnpj: cnpj,
          external_code: organization.external_code,
        }),
        fetchMovementPages: () => page("11"),
        fetchMovementPlanPages: () => page("12"),
        fetchMovementPrincipalPages: () => page("13"),
        fetchRoutineOriginPages: () => page("14"),
        fetchSalesResponsePages: () => page("15"),
        validateRows: () => ({
          movements: [],
          paymentLabels: new Map(),
          principals: new Map(),
          routineOrigins: new Map(),
          salesResponses: new Map(),
          origins: new Map(),
        }),
        completeRows: async (_cnpj, rows) => rows,
        loadMissingCatalogs: async () => ({
          customers: new Map(),
          sellers: new Map(),
          products: new Map(),
        }),
        mapCanonicalSales: () => [
          {
            source: "LINX",
            organizationExternalCode: organization.external_code,
            date: new Date("2026-07-29T00:00:00.000Z"),
            documentNumber: `atomic-${suffix}`,
            natureOperation: "VENDA",
            operationType: "S",
            operationalOrigin: "LOJA",
            cancelled: false,
            customer: null,
            seller: { externalCode: sellerCode, name: "Atomic Seller" },
            paymentLabel: null,
            commercialOrigin: null,
            linxIdentifier,
            linxTimestamp: BigInt(11),
            items: [
              {
                productCode,
                description: "Atomic Product",
                brand: "Test",
                sector: "Test",
                quantity: 1,
                unitValue: 10,
                totalValue: 10,
                linxOrder: 1,
                linxTimestamp: BigInt(11),
              },
            ],
          },
        ],
        importSales,
        revalidateSales: vi.fn(),
        logger: { warn: vi.fn() },
      };

      await expect(
        runLinxSyncWithDependencies(
          {
            organizationId,
            trigger: "MANUAL",
            mode: "INCREMENTAL",
            deadlineAt,
            transactionTimeoutMs: 20_000,
          },
          dependencies,
        ),
      ).rejects.toThrow("integration-secret");

      await expect(
        prisma!.pedido.count({
          where: { organizationId, linxIdentifier },
        }),
      ).resolves.toBe(0);
      await expect(
        prisma!.saleItem.count({
          where: { sale: { organizationId } },
        }),
      ).resolves.toBe(0);
      await expect(
        prisma!.linxSyncCursor.count({ where: { organizationId } }),
      ).resolves.toBe(0);

      const run = await prisma!.linxSyncRun.findFirstOrThrow({
        where: { organizationId },
      });
      expect(run.status).toBe("FAILED");
      expect(run.errorMessage).toBe(LINX_SYNC_FAILURE_MESSAGE);
      expect(run.errorMessage).not.toContain("integration-secret");
    } finally {
      if (organizationId) {
        await prisma!.pedido.deleteMany({
          where: { organizationId },
        });
        await prisma!.organization.deleteMany({
          where: { id: organizationId },
        });
      }
      await prisma!.product.deleteMany({
        where: { external_code: productCode },
      });
      await prisma!.user.deleteMany({
        where: { externalId: String(sellerCode) },
      });
    }
  });
});
