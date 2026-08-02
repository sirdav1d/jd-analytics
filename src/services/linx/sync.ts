import type {
  LinxSyncMethod,
  LinxSyncTrigger,
  Prisma,
} from "@prisma/client";
import type {
  CanonicalSale,
  ImportSummary,
} from "@/services/sales-import/contracts";
import type { LinxDeadline } from "./deadline";
import { LinxDeadlineError, publicLinxFailureMessage } from "./errors";
import {
  assertDateWithinReconciliationPeriod,
  reconciliationPeriodFor,
} from "./reconciliation";
import type {
  LinxCompletionScope,
  LinxCatalogs,
  ValidatedLinxRows,
} from "./sync-adapter";
import { buildProductionSyncDependencies } from "./sync-runtime";
import {
  LinxInitialReconciliationRequiredError,
  type SyncRunSummary,
} from "./sync-repository";
import type { LinxResponseRow } from "./types";
import {
  createCanonicalSalesSnapshotHash,
  ReconciliationAuthorizationError,
  type VerifiedReconciliationAuthorization,
} from "./preview-authorization";

export type SyncMode = "INCREMENTAL" | "RECONCILIATION";

export type SyncInput = {
  organizationId: string;
  requestedById?: string | null;
  trigger: LinxSyncTrigger;
  mode: SyncMode;
  /** Absolute wall-clock deadline as Unix epoch milliseconds. */
  deadlineAt: number;
  transactionTimeoutMs: number;
  reconciliationAuthorization?: string;
};

type PageResult = {
  rows: LinxResponseRow[];
  nextTimestamp: bigint;
};

type SyncRange = {
  from: string;
  to: string;
};

export type { ValidatedLinxRows } from "./sync-adapter";

export type CollectedLinxData = {
  sales: CanonicalSale[];
  cursors: Partial<Record<LinxSyncMethod, bigint>>;
  rawCounts: Record<string, number>;
};

export type SyncDependencies = {
  prisma: {
    $transaction<T>(
      callback: (tx: Prisma.TransactionClient) => Promise<T>,
      options: { maxWait: number; timeout: number },
    ): Promise<T>;
  };
  repo: {
    acquireSyncRun(input: {
      organizationId: string;
      requestedById?: string | null;
      trigger: LinxSyncTrigger;
      mode?: SyncMode;
      now: Date;
      leaseExpiresAt: Date;
      expectedCnpj?: string;
      reconciliationAuthorizationHash?: string;
    }): Promise<{ id: string }>;
    hasCursorBaseline(organizationId: string): Promise<boolean>;
    getCursors(
      organizationId: string,
    ): Promise<Record<LinxSyncMethod, bigint>>;
    saveCursors(
      tx: Prisma.TransactionClient,
      organizationId: string,
      cursors: Partial<Record<LinxSyncMethod, bigint>>,
    ): Promise<void>;
    markRunSuccess(
      tx: Prisma.TransactionClient,
      runId: string,
      summary: SyncRunSummary,
      finishedAt: Date,
    ): Promise<unknown>;
    markRunFailed(
      runId: string,
      error: unknown,
      finishedAt: Date,
      failureStage?: string,
    ): Promise<unknown>;
    updateRunStage?(runId: string, stage: string): Promise<unknown>;
  };
  deadline: LinxDeadline;
  nowDate(): Date;
  readOrganization(organizationId: string): Promise<{
    linxCnpj: string;
    external_code: number;
  }>;
  fetchMovementPages(input: {
    cnpj: string;
    timestamp: bigint;
    mode: SyncMode;
    range?: SyncRange;
  }): Promise<PageResult>;
  fetchMovementPlanPages(input: {
    cnpj: string;
    timestamp: bigint;
    range?: SyncRange;
  }): Promise<PageResult>;
  fetchMovementPrincipalPages(input: {
    cnpj: string;
    timestamp: bigint;
  }): Promise<PageResult>;
  fetchRoutineOriginPages(input: {
    cnpj: string;
    timestamp: bigint;
  }): Promise<PageResult>;
  fetchSalesResponsePages(input: {
    cnpj: string;
    timestamp: bigint;
  }): Promise<PageResult>;
  validateRows(input: {
    movements: LinxResponseRow[];
    payments: LinxResponseRow[];
    principals: LinxResponseRow[];
    routines: LinxResponseRow[];
    responses: LinxResponseRow[];
  }): ValidatedLinxRows;
  completeRows(
    cnpj: string,
    rows: ValidatedLinxRows,
    scope: LinxCompletionScope,
  ): Promise<ValidatedLinxRows>;
  loadMissingCatalogs(
    cnpj: string,
    movements: ValidatedLinxRows["movements"],
    scope: { mode: SyncMode },
  ): Promise<LinxCatalogs>;
  mapCanonicalSales(
    input: ValidatedLinxRows & {
      organizationExternalCode: number;
      catalogs: LinxCatalogs;
    },
  ): CanonicalSale[];
  importSales(
    tx: Prisma.TransactionClient,
    sales: CanonicalSale[],
  ): Promise<ImportSummary>;
  revalidateSales(): void;
  verifyReconciliationAuthorization?(
    token: string,
    expected: {
      organizationId: string;
      cnpj: string;
      issuedById: string;
    },
  ): VerifiedReconciliationAuthorization;
  reconciliationSnapshotHash?(sales: CanonicalSale[]): string;
  logger: {
    warn(
      message: string,
      metadata?: Record<string, string | number | boolean>,
    ): void;
  };
};

const ZERO_CURSORS: Record<LinxSyncMethod, bigint> = {
  MOVIMENTO: BigInt(0),
  MOVIMENTO_PLANOS: BigInt(0),
  MOVIMENTO_PRINCIPAL: BigInt(0),
  ROTINA_ORIGEM: BigInt(0),
  RESPOSTA_VENDA: BigInt(0),
};

function lastThirtyDays(now: Date): SyncRange {
  return reconciliationPeriodFor(now);
}

function toRunSummary(summary: ImportSummary): SyncRunSummary {
  return {
    processedOrders: summary.ordersProcessed,
    processedItems:
      summary.itemsCreated + summary.itemsUpdated + summary.itemsRemoved,
  };
}

export function selectAuthorizedReconciliationSales(
  sales: CanonicalSale[],
  targets: string[],
): CanonicalSale[] {
  const salesByIdentifier = new Map<string, CanonicalSale>();
  for (const sale of sales) {
    const identifier = sale.linxIdentifier?.toLowerCase();
    if (!identifier) continue;
    if (salesByIdentifier.has(identifier)) {
      throw new ReconciliationAuthorizationError();
    }
    salesByIdentifier.set(identifier, sale);
  }

  const authorizedIdentifiers = new Set<string>();
  for (const target of targets) {
    const identifier = target.toLowerCase();
    if (authorizedIdentifiers.has(identifier) || !salesByIdentifier.has(identifier)) {
      throw new ReconciliationAuthorizationError();
    }
    authorizedIdentifiers.add(identifier);
  }

  return sales.filter((sale) =>
    sale.linxIdentifier
      ? authorizedIdentifiers.has(sale.linxIdentifier.toLowerCase())
      : false,
  );
}

export function sanitizeLinxError(error: unknown): string {
  return publicLinxFailureMessage(error);
}

export async function collectLinxData(
  input: SyncInput,
  deps: SyncDependencies,
  options: {
    reconciliationPeriod?: SyncRange;
    onStage?: (stage: string) => Promise<unknown>;
  } = {},
): Promise<CollectedLinxData> {
  const stage = async (value: string) => {
    if (options.onStage) await options.onStage(value);
  };
  await stage("READING_ORGANIZATION");
  const organization = await deps.readOrganization(input.organizationId);
  const current =
    input.mode === "RECONCILIATION"
      ? ZERO_CURSORS
      : await deps.repo.getCursors(input.organizationId);
  const range =
    input.mode === "RECONCILIATION"
      ? options.reconciliationPeriod ?? lastThirtyDays(deps.nowDate())
      : undefined;

  await stage("MOVIMENTO");
  deps.deadline.assert();
  const movements = await deps.fetchMovementPages({
    cnpj: organization.linxCnpj,
    timestamp: current.MOVIMENTO,
    mode: input.mode,
    range,
  });
  await stage("MOVIMENTO_PLANOS");
  deps.deadline.assert();
  const payments = await deps.fetchMovementPlanPages({
    cnpj: organization.linxCnpj,
    timestamp: current.MOVIMENTO_PLANOS,
    range,
  });
  await stage("MOVIMENTO_PRINCIPAL");
  deps.deadline.assert();
  const principals = await deps.fetchMovementPrincipalPages({
    cnpj: organization.linxCnpj,
    timestamp: current.MOVIMENTO_PRINCIPAL,
  });
  await stage("ROTINA_ORIGEM");
  deps.deadline.assert();
  const routines = await deps.fetchRoutineOriginPages({
    cnpj: organization.linxCnpj,
    timestamp: current.ROTINA_ORIGEM,
  });
  await stage("RESPOSTA_VENDA");
  deps.deadline.assert();
  const responses = await deps.fetchSalesResponsePages({
    cnpj: organization.linxCnpj,
    timestamp: current.RESPOSTA_VENDA,
  });
  deps.deadline.assert();

  await stage("VALIDATING");
  const parsed = deps.validateRows({
    movements: movements.rows,
    payments: payments.rows,
    principals: principals.rows,
    routines: routines.rows,
    responses: responses.rows,
  });
  deps.deadline.assert();
  const completionScope: LinxCompletionScope =
    input.mode === "RECONCILIATION"
      ? {
          mode: "RECONCILIATION",
          authorizedIdentifiers: new Set([
            ...parsed.movements.map(
              (movement) => movement.identificador,
            ),
          ]),
        }
      : { mode: "INCREMENTAL" };
  await stage("COMPLETING");
  const completed = await deps.completeRows(
    organization.linxCnpj,
    parsed,
    completionScope,
  );
  deps.deadline.assert();
  await stage("CATALOGS");
  const catalogs = await deps.loadMissingCatalogs(
    organization.linxCnpj,
    completed.movements,
    { mode: input.mode },
  );
  deps.deadline.assert();
  await stage("MAPPING");
  const sales = deps.mapCanonicalSales({
    organizationExternalCode: organization.external_code,
    ...completed,
    catalogs,
  });
  if (range) {
    for (const sale of sales) {
      assertDateWithinReconciliationPeriod(sale.date, range);
    }
  }

  return {
    sales,
    cursors: {
      MOVIMENTO: movements.nextTimestamp,
      MOVIMENTO_PLANOS: payments.nextTimestamp,
      MOVIMENTO_PRINCIPAL: principals.nextTimestamp,
      ROTINA_ORIGEM: routines.nextTimestamp,
      RESPOSTA_VENDA: responses.nextTimestamp,
    },
    rawCounts: {
      movements: movements.rows.length,
      payments: payments.rows.length,
      principals: principals.rows.length,
      routines: routines.rows.length,
      responses: responses.rows.length,
    },
  };
}

async function persistCollectedRun(
  run: { id: string },
  collected: CollectedLinxData,
  input: SyncInput,
  deps: SyncDependencies,
) {
  await deps.repo.updateRunStage?.(run.id, "PERSISTING");
  const maxWaitMs = 2_000;
  const safetyMarginMs = 1_000;
  deps.deadline.assert(2_000);
  const transactionTimeoutMs = Math.min(
    input.transactionTimeoutMs,
    deps.deadline.remainingMs() - maxWaitMs - safetyMarginMs,
  );
  if (transactionTimeoutMs < 1_000) {
    throw new LinxDeadlineError("Sem margem para iniciar a transação");
  }

  const summary = await deps.prisma.$transaction(
    async (tx) => {
      const imported = await deps.importSales(tx, collected.sales);
      await deps.repo.saveCursors(tx, input.organizationId, collected.cursors);
      await deps.repo.markRunSuccess(
        tx,
        run.id,
        toRunSummary(imported),
        deps.nowDate(),
      );
      return imported;
    },
    { maxWait: maxWaitMs, timeout: transactionTimeoutMs },
  );

  try {
    deps.revalidateSales();
  } catch {
    deps.logger.warn("Dados sincronizados; falha ao invalidar cache", {
      runId: run.id,
    });
  }

  return summary;
}

export async function runLinxSyncWithDependencies(
  input: SyncInput,
  deps: SyncDependencies,
): Promise<ImportSummary> {
  if (
    !Number.isSafeInteger(input.deadlineAt) ||
    input.deadlineAt < 1_000_000_000_000 ||
    input.deadlineAt > 8_640_000_000_000_000
  ) {
    throw new Error("deadlineAt deve usar Unix epoch em milissegundos");
  }
  if (deps.deadline.deadlineAt !== input.deadlineAt) {
    throw new Error("Deadline da execução não corresponde ao input");
  }
  if (
    input.mode === "INCREMENTAL" &&
    !(await deps.repo.hasCursorBaseline(input.organizationId))
  ) {
    throw new LinxInitialReconciliationRequiredError();
  }
  let authorization:
    | VerifiedReconciliationAuthorization
    | undefined;
  if (input.mode === "RECONCILIATION") {
    if (!input.reconciliationAuthorization || !input.requestedById) {
      throw new ReconciliationAuthorizationError();
    }
    const organization = await deps.readOrganization(input.organizationId);
    if (!deps.verifyReconciliationAuthorization) {
      throw new ReconciliationAuthorizationError();
    }
    authorization = deps.verifyReconciliationAuthorization(
      input.reconciliationAuthorization,
      {
        organizationId: input.organizationId,
        cnpj: organization.linxCnpj,
        issuedById: input.requestedById,
      },
    );
  }

  deps.deadline.assert();
  const run = await deps.repo.acquireSyncRun({
    organizationId: input.organizationId,
    requestedById: input.requestedById,
    trigger: input.trigger,
    mode: input.mode,
    now: deps.nowDate(),
    leaseExpiresAt: new Date(input.deadlineAt + 5_000),
    expectedCnpj: authorization?.cnpj,
    reconciliationAuthorizationHash: authorization?.tokenHash,
  });

  let failureStage = "ACQUIRED";
  try {
    const collected = await collectLinxData(input, deps, {
      reconciliationPeriod: authorization?.period,
      onStage: async (stage) => {
        failureStage = stage;
        await deps.repo.updateRunStage?.(run.id, stage);
      },
    });
    if (authorization) {
      if (
        (deps.reconciliationSnapshotHash?.(collected.sales) ??
          createCanonicalSalesSnapshotHash(collected.sales)) !==
        authorization.snapshotHash
      ) {
        throw new ReconciliationAuthorizationError();
      }
      collected.sales = selectAuthorizedReconciliationSales(
        collected.sales,
        authorization.targetLinxIdentifiers,
      );
    }
    failureStage = "PERSISTING";
    return await persistCollectedRun(run, collected, input, deps);
  } catch (error) {
    try {
      await deps.repo.markRunFailed(
        run.id,
        sanitizeLinxError(error),
        deps.nowDate(),
        failureStage,
      );
    } catch {
      deps.logger.warn("Falha ao registrar execução Linx", { runId: run.id });
    }
    throw error;
  }
}

export async function runLinxSync(input: SyncInput): Promise<ImportSummary> {
  return runLinxSyncWithDependencies(
    input,
    buildProductionSyncDependencies(input),
  );
}
