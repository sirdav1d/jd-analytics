import "server-only";
import { prisma } from "@/lib/prisma";
import { collectCurrentMarketingSpend } from "@/services/marketing-spend/collect";
import { runLinxSync } from "@/services/linx/sync";
import { revalidatePublishedDataSync } from "./cache";
import { runDataSyncWithDependencies } from "./run";
import type { DataSyncInput } from "./types";

export function runDataSync(input: DataSyncInput) {
  return runDataSyncWithDependencies(input, {
    nowDate: () => new Date(),
    nowMs: () => Date.now(),
    runLinx: runLinxSync,
    collectSpend: collectCurrentMarketingSpend,
    upsertMeta: (value) =>
      prisma.metaInvestment.upsert({
        where: { periodStart: value.periodStart },
        update: {
          periodEnd: value.periodEnd,
          totalInvestment: value.totalInvestment,
          lastSyncAt: value.lastSyncAt,
        },
        create: value,
      }),
    revalidate: revalidatePublishedDataSync,
  });
}
