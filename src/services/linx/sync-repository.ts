import {
  LinxSyncMethod,
  Prisma,
  type PrismaClient,
  type LinxSyncTrigger,
  type LinxSyncMode,
} from "@prisma/client";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { withLinxCoordination } from "./admin-coordination";
import { publicLinxFailureMessage } from "./errors";


export type AcquireRunInput = {
  organizationId: string;
  requestedById?: string | null;
  trigger: LinxSyncTrigger;
  mode?: LinxSyncMode;
  now: Date;
  leaseExpiresAt: Date;
  expectedCnpj?: string;
  reconciliationAuthorizationHash?: string;
};

export type SyncRunSummary = {
  processedOrders: number;
  processedItems: number;
};

type SyncDatabaseClient = Pick<
  PrismaClient,
  "$transaction" | "linxSyncCursor" | "linxSyncRun"
>;

export class LinxConcurrentRunError extends Error {
  readonly runId?: string;

  constructor(runId?: string) {
    super("Já existe uma sincronização Linx em andamento para esta organização");
    this.name = "LinxConcurrentRunError";
    this.runId = runId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class LinxInactiveOrganizationError extends Error {
  constructor() {
    super("A organização selecionada não é a loja Linx ativa.");
    this.name = "LinxInactiveOrganizationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class LinxReconciliationAuthorizationUsedError extends Error {
  constructor() {
    super("A autorização de preview já foi utilizada");
    this.name = "LinxReconciliationAuthorizationUsedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class LinxInitialReconciliationRequiredError extends Error {
  constructor() {
    super("Faça a conciliação inicial antes da sincronização incremental.");
    this.name = "LinxInitialReconciliationRequiredError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function isRunningRunConstraint(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== "P2002" ||
    !("meta" in error) ||
    typeof error.meta !== "object" ||
    error.meta === null ||
    !("target" in error.meta)
  ) {
    return false;
  }

  const target = error.meta.target;
  return (
    target === "LinxSyncRun_one_running_per_org" ||
    target === "organizationId" ||
    (Array.isArray(target) &&
      target.length === 1 &&
      (target[0] === "organizationId" ||
        target[0] === "LinxSyncRun_one_running_per_org"))
  );
}

function isAuthorizationHashConstraint(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== "P2002" ||
    !("meta" in error) ||
    typeof error.meta !== "object" ||
    error.meta === null ||
    !("target" in error.meta)
  ) {
    return false;
  }
  const target = error.meta.target;
  return (
    target === "LinxSyncRun_reconciliationAuthorizationHash_key" ||
    target === "reconciliationAuthorizationHash" ||
    (Array.isArray(target) &&
      target.includes("reconciliationAuthorizationHash"))
  );
}

async function acquireSyncRunWithClient(
  db: Prisma.TransactionClient,
  input: AcquireRunInput,
) {
  const organization = await db.organization.findUnique({
    where: { id: input.organizationId },
    select: { linxSyncEnabled: true, linxCnpj: true },
  });
  if (!organization?.linxSyncEnabled || !organization.linxCnpj) {
    throw new LinxInactiveOrganizationError();
  }
  if (
    input.expectedCnpj !== undefined &&
    organization.linxCnpj !== input.expectedCnpj
  ) {
    throw new LinxInactiveOrganizationError();
  }

  const running = await db.linxSyncRun.findFirst({
    where: { organizationId: input.organizationId, status: "RUNNING" },
  });

  if (running) {
    throw new LinxConcurrentRunError(running.id);
  }

  try {
    return await db.linxSyncRun.create({
      data: {
        organizationId: input.organizationId,
        requestedById: input.requestedById,
        trigger: input.trigger,
        mode: input.mode ?? "INCREMENTAL",
        status: "RUNNING",
        stage: "ACQUIRED",
        leaseExpiresAt: input.leaseExpiresAt,
        reconciliationAuthorizationHash:
          input.reconciliationAuthorizationHash,
      },
    });
  } catch (error) {
    if (isRunningRunConstraint(error)) throw new LinxConcurrentRunError();
    if (isAuthorizationHashConstraint(error)) {
      throw new LinxReconciliationAuthorizationUsedError();
    }
    throw error;
  }
}

async function getCursorsWithClient(
  db: SyncDatabaseClient,
  organizationId: string,
): Promise<Record<LinxSyncMethod, bigint>> {
  const persisted = await db.linxSyncCursor.findMany({
    where: { organizationId },
    select: { method: true, lastTimestamp: true },
  });
  const cursors = Object.fromEntries(
    Object.values(LinxSyncMethod).map((method) => [method, BigInt(0)]),
  ) as Record<LinxSyncMethod, bigint>;

  for (const cursor of persisted) {
    cursors[cursor.method] = cursor.lastTimestamp;
  }

  return cursors;
}

async function hasCursorBaselineWithClient(
  db: SyncDatabaseClient,
  organizationId: string,
): Promise<boolean> {
  const persisted = await db.linxSyncCursor.findMany({
    where: { organizationId },
    select: { method: true },
  });
  const persistedMethods = new Set(persisted.map((cursor) => cursor.method));

  return Object.values(LinxSyncMethod).every((method) =>
    persistedMethods.has(method),
  );
}

export async function saveCursors(
  tx: Prisma.TransactionClient,
  organizationId: string,
  values: Partial<Record<LinxSyncMethod, bigint>>,
): Promise<void> {
  for (const method of Object.values(LinxSyncMethod)) {
    const lastTimestamp = values[method];
    if (lastTimestamp === undefined) continue;

    await tx.$executeRaw(
      Prisma.sql`
        INSERT INTO "LinxSyncCursor"
          ("id", "organizationId", "method", "lastTimestamp", "createdAt", "updatedAt")
        VALUES
          (${randomUUID()}, ${organizationId}, ${method}::"LinxSyncMethod", ${lastTimestamp}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT ("organizationId", "method")
        DO UPDATE SET
          "lastTimestamp" = GREATEST(
            "LinxSyncCursor"."lastTimestamp",
            EXCLUDED."lastTimestamp"
          ),
          "updatedAt" = CURRENT_TIMESTAMP
      `,
    );
  }
}

export async function markRunSuccess(
  tx: Prisma.TransactionClient,
  runId: string,
  summary: SyncRunSummary,
  finishedAt: Date,
) {
  return tx.linxSyncRun.update({
    where: { id: runId },
    data: {
      status: "SUCCESS",
      stage: "COMPLETED",
      processedOrders: summary.processedOrders,
      processedItems: summary.processedItems,
      finishedAt,
      leaseExpiresAt: null,
      errorMessage: null,
    },
  });
}

async function markRunFailedWithClient(
  db: SyncDatabaseClient,
  runId: string,
  message: unknown,
  finishedAt: Date,
  failureStage?: string,
) {
  return db.linxSyncRun.update({
    where: { id: runId },
    data: {
      status: "FAILED",
      failureStage: failureStage ?? "UNKNOWN",
      finishedAt,
      leaseExpiresAt: null,
      errorMessage: publicLinxFailureMessage(message),
    },
  });
}

async function updateRunStageWithClient(
  db: SyncDatabaseClient,
  runId: string,
  stage: string,
) {
  return db.linxSyncRun.update({
    where: { id: runId },
    data: { stage },
  });
}

/** Builds the repository against a caller-provided Prisma client (including tests). */
export function createSyncRepository(db: SyncDatabaseClient) {
  return {
    acquireSyncRun: (input: AcquireRunInput) =>
      withLinxCoordination(db, input.now, (tx) =>
        acquireSyncRunWithClient(tx, input),
      ),
    hasCursorBaseline: (organizationId: string) =>
      hasCursorBaselineWithClient(db, organizationId),
    getCursors: (organizationId: string) => getCursorsWithClient(db, organizationId),
    saveCursors,
    markRunSuccess,
    markRunFailed: (
      runId: string,
      message: unknown,
      finishedAt: Date,
      failureStage?: string,
    ) =>
      markRunFailedWithClient(
        db,
        runId,
        message,
        finishedAt,
        failureStage,
      ),
    updateRunStage: (runId: string, stage: string) =>
      updateRunStageWithClient(db, runId, stage),
  };
}

const defaultRepository = createSyncRepository(prisma);

export const acquireSyncRun = defaultRepository.acquireSyncRun;
export const hasCursorBaseline = defaultRepository.hasCursorBaseline;
export const getCursors = defaultRepository.getCursors;
export const markRunFailed = defaultRepository.markRunFailed;
export const updateRunStage = defaultRepository.updateRunStage;
