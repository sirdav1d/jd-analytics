import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import {
  createSyncRepository,
  LinxConcurrentRunError,
} from "@/services/linx/sync-repository";
import { requireTestDatabaseUrl } from "@/tests/setup-integration";

const url = process.env.TEST_DATABASE_URL
  ? requireTestDatabaseUrl()
  : undefined;
const prisma = url ? new PrismaClient({ datasourceUrl: url }) : undefined;
const repository = prisma ? createSyncRepository(prisma) : undefined;
const describeWithTestDatabase = url ? describe : describe.skip;

afterAll(async () => {
  await prisma?.$disconnect();
});

describeWithTestDatabase("Linx sync repository", () => {
  it("allows exactly one concurrent RUNNING run per organization", async () => {
    const suffix = crypto.randomUUID();
    let organizationId: string | undefined;

    try {
      const organization = await prisma!.organization.create({
        data: {
          name: `linx-sync-${suffix}`,
          linxCnpj: suffix.replace(/\D/g, "").padEnd(14, "0").slice(0, 14),
          linxSyncEnabled: true,
        },
      });
      organizationId = organization.id;
      const now = new Date();
      const input = {
        organizationId,
        trigger: "MANUAL" as const,
        now,
        leaseExpiresAt: new Date(now.getTime() + 60_000),
      };

      const results = await Promise.allSettled([
        repository!.acquireSyncRun(input),
        repository!.acquireSyncRun(input),
      ]);

      expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
      expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
      expect(results.find((result) => result.status === "rejected")).toMatchObject({
        reason: expect.any(LinxConcurrentRunError),
      });
      await expect(prisma!.linxSyncRun.count({
        where: { organizationId, status: "RUNNING" },
      })).resolves.toBe(1);
    } finally {
      if (organizationId) {
        await prisma!.organization.delete({ where: { id: organizationId } });
      }
    }
  });

  it("never regresses a persisted cursor across reconciliation and incremental saves", async () => {
    let organizationId: string | undefined;
    try {
      const organization = await prisma!.organization.create({
        data: { name: `linx-cursor-${crypto.randomUUID()}` },
      });
      organizationId = organization.id;
      await prisma!.$transaction((tx) =>
        repository!.saveCursors(tx, organizationId!, {
          MOVIMENTO: BigInt(100),
        }),
      );
      await prisma!.$transaction((tx) =>
        repository!.saveCursors(tx, organizationId!, {
          MOVIMENTO: BigInt(50),
        }),
      );
      await expect(
        prisma!.linxSyncCursor.findUniqueOrThrow({
          where: {
            organizationId_method: {
              organizationId,
              method: "MOVIMENTO",
            },
          },
        }),
      ).resolves.toMatchObject({ lastTimestamp: BigInt(100) });
      await prisma!.$transaction((tx) =>
        repository!.saveCursors(tx, organizationId!, {
          MOVIMENTO: BigInt(150),
        }),
      );
      await expect(
        prisma!.linxSyncCursor.findUniqueOrThrow({
          where: {
            organizationId_method: {
              organizationId,
              method: "MOVIMENTO",
            },
          },
        }),
      ).resolves.toMatchObject({ lastTimestamp: BigInt(150) });
    } finally {
      if (organizationId) {
        await prisma!.organization.delete({ where: { id: organizationId } });
      }
    }
  });
});
