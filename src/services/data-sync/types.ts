import type { MediaSourceResult } from "@/services/marketing-spend/types";

export type DataSyncInput = {
  organizationId: string;
  requestedById?: string | null;
  trigger: "CRON" | "MANUAL";
  deadlineAt: number;
  transactionTimeoutMs: number;
};

export type LinxSourceResult =
  | {
      status: "SUCCESS";
      durationMs: number;
      summary: {
        ordersProcessed: number;
        itemsCreated: number;
        itemsUpdated: number;
        itemsRemoved: number;
      };
    }
  | { status: "FAILED"; durationMs: number; error: string };

export type DataSyncSources = {
  LINX: LinxSourceResult;
  META: MediaSourceResult;
  GOOGLE_PRODUCTS: MediaSourceResult;
  GOOGLE_SERVICES: MediaSourceResult;
};

export type DataSyncSuccess = {
  cutoffDate: string;
  lastSuccessfulSyncAt: string;
  sources: DataSyncSources;
};
