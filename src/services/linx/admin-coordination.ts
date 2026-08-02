import "server-only";
import {
  Prisma,
  type PrismaClient,
  type Prisma as PrismaTypes,
} from "@prisma/client";

export const LINX_COORDINATION_LOCK_KEY =
  "linx:active-organization-and-run";

const EXPIRED_LEASE_MESSAGE = "Execução encerrada: lease expirado";

type TransactionHost = Pick<PrismaClient, "$transaction">;

export type LiveLinxRun = {
  id: string;
  organizationId: string;
  status: "RUNNING";
  mode: "INCREMENTAL" | "RECONCILIATION";
  stage: string | null;
  startedAt: Date;
};

export async function withLinxCoordination<T>(
  db: TransactionHost,
  now: Date,
  callback: (tx: PrismaTypes.TransactionClient) => Promise<T>,
): Promise<T> {
  return db.$transaction(
    async (tx) => {
      await tx.$queryRaw(
        Prisma.sql`SELECT pg_advisory_xact_lock(hashtextextended(${LINX_COORDINATION_LOCK_KEY}, 0))::text AS lock_result`,
      );
      await tx.linxSyncRun.updateMany({
        where: {
          status: "RUNNING",
          OR: [
            { leaseExpiresAt: null },
            { leaseExpiresAt: { lte: now } },
          ],
        },
        data: {
          status: "FAILED",
          failureStage: "LEASE_EXPIRED",
          finishedAt: now,
          leaseExpiresAt: null,
          errorMessage: EXPIRED_LEASE_MESSAGE,
        },
      });
      return callback(tx);
    },
    { maxWait: 2_000, timeout: 5_000 },
  );
}

export async function findLiveLinxRun(
  tx: PrismaTypes.TransactionClient,
  organizationId?: string,
): Promise<LiveLinxRun | null> {
  const run = await tx.linxSyncRun.findFirst({
    where: {
      status: "RUNNING",
      ...(organizationId ? { organizationId } : {}),
    },
    orderBy: { startedAt: "desc" },
    select: {
      id: true,
      organizationId: true,
      status: true,
      mode: true,
      stage: true,
      startedAt: true,
    },
  });
  return run ? { ...run, status: "RUNNING" } : null;
}

export type ActivateLinxInput = {
  organizationId: string;
  cnpj: string;
  portalId: number | null;
  companyId: number | null;
};

export class LinxCnpjRemapBlockedError extends Error {
  constructor() {
    super("O CNPJ Linx já possui vendas vinculadas a outra organização.");
    this.name = "LinxCnpjRemapBlockedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export async function inspectLinxOrganization(
  db: TransactionHost,
  organizationId: string,
  now: Date,
): Promise<
  | { kind: "READY" }
  | { kind: "INACTIVE" }
  | { kind: "RUNNING"; run: LiveLinxRun }
> {
  return withLinxCoordination(db, now, async (tx) => {
    const organization = await tx.organization.findUnique({
      where: { id: organizationId },
      select: { linxSyncEnabled: true, linxCnpj: true },
    });
    if (!organization?.linxSyncEnabled || !organization.linxCnpj) {
      return { kind: "INACTIVE" };
    }
    const running = await findLiveLinxRun(tx, organizationId);
    return running
      ? { kind: "RUNNING", run: running }
      : { kind: "READY" };
  });
}

export async function activateLinxOrganization(
  db: TransactionHost,
  input: ActivateLinxInput,
  now: Date,
): Promise<
  | { kind: "ACTIVATED" }
  | { kind: "RUNNING"; run: LiveLinxRun }
> {
  return withLinxCoordination(db, now, async (tx) => {
    const running = await findLiveLinxRun(tx);
    if (running) return { kind: "RUNNING", run: running };

    const targetOrganization = await tx.organization.findUnique({
      where: { id: input.organizationId },
      select: { linxCnpj: true },
    });
    const previousOwner = await tx.organization.findFirst({
      where: {
        linxCnpj: input.cnpj,
        id: { not: input.organizationId },
      },
      select: { id: true },
    });
    if (previousOwner) {
      const linkedSales = await tx.pedido.count({
        where: {
          organizationId: previousOwner.id,
          linxIdentifier: { not: null },
        },
      });
      if (linkedSales > 0) throw new LinxCnpjRemapBlockedError();
      await tx.organization.update({
        where: { id: previousOwner.id },
        data: {
          linxCnpj: null,
          linxPortalId: null,
          linxCompanyId: null,
          linxSyncEnabled: false,
        },
      });
      await tx.linxSyncCursor.deleteMany({
        where: { organizationId: previousOwner.id },
      });
    }
    if (
      targetOrganization &&
      targetOrganization.linxCnpj !== input.cnpj
    ) {
      await tx.linxSyncCursor.deleteMany({
        where: { organizationId: input.organizationId },
      });
    }
    await tx.organization.updateMany({
      data: { linxSyncEnabled: false },
    });
    await tx.organization.update({
      where: { id: input.organizationId },
      data: {
        linxCnpj: input.cnpj,
        linxPortalId: input.portalId,
        linxCompanyId: input.companyId,
        linxSyncEnabled: true,
      },
    });
    return { kind: "ACTIVATED" };
  });
}
