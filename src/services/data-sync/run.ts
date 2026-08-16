import type { ImportSummary } from "@/services/sales-import/contracts";
import { resolveBusinessMonthToDate } from "@/services/data-services/civil-date-range";
import {
  LinxConcurrentRunError,
  LinxInactiveOrganizationError,
  LinxInitialReconciliationRequiredError,
} from "@/services/linx/sync-repository";
import { SAFE_MEDIA_ERRORS } from "@/services/marketing-spend/collect";
import type {
  MarketingSpendBatch,
  MarketingSpendRange,
} from "@/services/marketing-spend/types";
import { DataSyncPublicationError } from "./errors";
import type {
  DataSyncInput,
  DataSyncSources,
  DataSyncSuccess,
} from "./types";

type MetaInvestmentWrite = {
  periodStart: Date;
  periodEnd: Date;
  totalInvestment: number;
  lastSyncAt: Date;
};

export type DataSyncDependencies = {
  nowDate(): Date;
  nowMs(): number;
  runLinx(input: DataSyncInput & {
    mode: "INCREMENTAL";
    revalidateSales: false;
  }): Promise<ImportSummary>;
  collectSpend(range: MarketingSpendRange): Promise<MarketingSpendBatch>;
  upsertMeta(value: MetaInvestmentWrite): Promise<unknown>;
  revalidate(): void;
};

function failedMarketingBatch(): MarketingSpendBatch {
  return {
    results: {
      META: { status: "FAILED", durationMs: 0, error: SAFE_MEDIA_ERRORS.META },
      GOOGLE_PRODUCTS: {
        status: "FAILED",
        durationMs: 0,
        error: SAFE_MEDIA_ERRORS.GOOGLE_PRODUCTS,
      },
      GOOGLE_SERVICES: {
        status: "FAILED",
        durationMs: 0,
        error: SAFE_MEDIA_ERRORS.GOOGLE_SERVICES,
      },
    },
    values: null,
  };
}

function isKnownLinxCoordinationError(error: unknown) {
  return (
    error instanceof LinxConcurrentRunError ||
    error instanceof LinxInitialReconciliationRequiredError ||
    error instanceof LinxInactiveOrganizationError
  );
}

export async function runDataSyncWithDependencies(
  input: DataSyncInput,
  deps: DataSyncDependencies,
): Promise<DataSyncSuccess> {
  const startedAt = deps.nowDate();
  const range = resolveBusinessMonthToDate(startedAt);
  const linxStartedAt = deps.nowMs();
  const linxPromise = deps.runLinx({
    ...input,
    mode: "INCREMENTAL",
    revalidateSales: false,
  });
  const mediaPromise = deps.collectSpend(range);
  const [linx, media] = await Promise.allSettled([
    linxPromise,
    mediaPromise,
  ]);

  const linxResult = linx.status === "fulfilled"
    ? {
        status: "SUCCESS" as const,
        durationMs: Math.max(0, deps.nowMs() - linxStartedAt),
        summary: linx.value,
      }
    : {
        status: "FAILED" as const,
        durationMs: Math.max(0, deps.nowMs() - linxStartedAt),
        error: "Não foi possível concluir a sincronização Linx.",
      };
  const mediaBatch = media.status === "fulfilled"
    ? media.value
    : failedMarketingBatch();
  const sources: DataSyncSources = {
    LINX: linxResult,
    ...mediaBatch.results,
  };

  if (linx.status === "rejected" || mediaBatch.values === null) {
    if (
      linx.status === "rejected" &&
      isKnownLinxCoordinationError(linx.reason)
    ) {
      throw linx.reason;
    }
    throw new DataSyncPublicationError(sources);
  }

  const totalInvestment = Number(mediaBatch.values.metaInvestment);
  if (!Number.isFinite(totalInvestment) || totalInvestment < 0) {
    throw new DataSyncPublicationError(sources);
  }
  const lastSyncAt = deps.nowDate();
  try {
    await deps.upsertMeta({
      periodStart: new Date(`${range.startDate}T00:00:00.000Z`),
      periodEnd: new Date(`${range.endDate}T00:00:00.000Z`),
      totalInvestment,
      lastSyncAt,
    });
  } catch {
    throw new DataSyncPublicationError(sources);
  }
  deps.revalidate();
  return {
    cutoffDate: range.endDate,
    lastSuccessfulSyncAt: lastSyncAt.toISOString(),
    sources,
  };
}
