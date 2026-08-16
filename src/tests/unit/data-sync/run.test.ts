import { describe, expect, it, vi } from "vitest";
import { DataSyncPublicationError } from "@/services/data-sync/errors";
import { runDataSyncWithDependencies } from "@/services/data-sync/run";
import { LinxConcurrentRunError } from "@/services/linx/sync-repository";
import type { MarketingSpendBatch } from "@/services/marketing-spend/types";

const startedAt = new Date("2026-08-17T02:30:00.000Z");
const completedAt = new Date("2026-08-17T02:30:08.000Z");
const input = {
  organizationId: "synthetic-organization",
  requestedById: "synthetic-user",
  trigger: "MANUAL" as const,
  deadlineAt: Date.parse("2026-08-17T02:30:48.000Z"),
  transactionTimeoutMs: 30_000,
};
const linxSummary = {
  ordersProcessed: 2,
  itemsCreated: 3,
  itemsUpdated: 1,
  itemsRemoved: 0,
};

function successfulMedia(): MarketingSpendBatch {
  return {
    results: {
      META: { status: "SUCCESS", durationMs: 100, amount: "1.000000" },
      GOOGLE_PRODUCTS: {
        status: "SUCCESS",
        durationMs: 200,
        amount: "2.000000",
      },
      GOOGLE_SERVICES: {
        status: "SUCCESS",
        durationMs: 300,
        amount: "3.000000",
      },
    },
    values: {
      metaInvestment: "1.000000",
      googleProductsInvestment: "2.000000",
      googleServicesInvestment: "3.000000",
      currency: "BRL",
    },
  };
}

function makeDependencies() {
  return {
    nowDate: vi.fn()
      .mockReturnValueOnce(startedAt)
      .mockReturnValue(completedAt),
    nowMs: vi.fn(() => 0),
    runLinx: vi.fn().mockResolvedValue(linxSummary),
    collectSpend: vi.fn().mockResolvedValue(successfulMedia()),
    upsertMeta: vi.fn().mockResolvedValue({ id: "synthetic-investment" }),
    revalidate: vi.fn(),
  };
}

describe("coordinated data synchronization", () => {
  it("updates the existing Meta month only after all four sources succeed", async () => {
    const deps = makeDependencies();

    const result = await runDataSyncWithDependencies(input, deps);

    expect(result).toEqual({
      cutoffDate: "2026-08-16",
      lastSuccessfulSyncAt: completedAt.toISOString(),
      sources: {
        LINX: { status: "SUCCESS", durationMs: 0, summary: linxSummary },
        ...successfulMedia().results,
      },
    });
    expect(deps.collectSpend).toHaveBeenCalledWith({
      startDate: "2026-08-01",
      endDate: "2026-08-16",
    });
    expect(deps.runLinx).toHaveBeenCalledWith({
      ...input,
      mode: "INCREMENTAL",
      revalidateSales: false,
    });
    expect(deps.upsertMeta).toHaveBeenCalledWith({
      periodStart: new Date("2026-08-01T00:00:00.000Z"),
      periodEnd: new Date("2026-08-16T00:00:00.000Z"),
      totalInvestment: 1,
      lastSyncAt: completedAt,
    });
    expect(deps.revalidate).toHaveBeenCalledTimes(1);
    expect(deps.upsertMeta.mock.invocationCallOrder[0]).toBeLessThan(
      deps.revalidate.mock.invocationCallOrder[0],
    );
  });

  it("starts Linx and media before either branch finishes", async () => {
    const deps = makeDependencies();
    let resolveLinx!: (value: typeof linxSummary) => void;
    let resolveMedia!: (value: MarketingSpendBatch) => void;
    deps.runLinx.mockImplementation(() => new Promise((resolve) => {
      resolveLinx = resolve;
    }));
    deps.collectSpend.mockImplementation(() => new Promise((resolve) => {
      resolveMedia = resolve;
    }));

    const pending = runDataSyncWithDependencies(input, deps);
    await Promise.resolve();

    expect(deps.runLinx).toHaveBeenCalledTimes(1);
    expect(deps.collectSpend).toHaveBeenCalledTimes(1);
    expect(deps.upsertMeta).not.toHaveBeenCalled();

    resolveLinx(linxSummary);
    resolveMedia(successfulMedia());
    await expect(pending).resolves.toMatchObject({ cutoffDate: "2026-08-16" });
  });

  it("measures Linx when its branch settles, independently from media", async () => {
    const deps = makeDependencies();
    deps.nowMs.mockReturnValueOnce(100).mockReturnValueOnce(105);
    let resolveLinx!: (value: typeof linxSummary) => void;
    let resolveMedia!: (value: MarketingSpendBatch) => void;
    deps.runLinx.mockImplementation(() => new Promise((resolve) => {
      resolveLinx = resolve;
    }));
    deps.collectSpend.mockImplementation(() => new Promise((resolve) => {
      resolveMedia = resolve;
    }));

    const pending = runDataSyncWithDependencies(input, deps);
    resolveLinx(linxSummary);
    await Promise.resolve();
    await Promise.resolve();

    expect(deps.nowMs).toHaveBeenCalledTimes(2);
    resolveMedia(successfulMedia());
    await expect(pending).resolves.toMatchObject({
      sources: { LINX: { status: "SUCCESS", durationMs: 5 } },
    });
  });

  it.each([
    ["META", "Não foi possível consultar o investimento Meta."],
    [
      "GOOGLE_PRODUCTS",
      "Não foi possível consultar o investimento Google Produtos.",
    ],
    [
      "GOOGLE_SERVICES",
      "Não foi possível consultar o investimento Google Serviços.",
    ],
  ] as const)("does not publish when %s fails", async (source, error) => {
    const deps = makeDependencies();
    const batch = successfulMedia();
    batch.results[source] = { status: "FAILED", durationMs: 50, error };
    batch.values = null;
    deps.collectSpend.mockResolvedValue(batch);

    await expect(runDataSyncWithDependencies(input, deps)).rejects
      .toBeInstanceOf(DataSyncPublicationError);
    expect(deps.upsertMeta).not.toHaveBeenCalled();
    expect(deps.revalidate).not.toHaveBeenCalled();
  });

  it("does not expose an unexpected Linx failure", async () => {
    const deps = makeDependencies();
    const privateMarker = ["private", "linx", "marker"].join("-");
    deps.runLinx.mockRejectedValueOnce(new Error(privateMarker));

    const error = await runDataSyncWithDependencies(input, deps).catch(
      (value) => value,
    );

    expect(error).toBeInstanceOf(DataSyncPublicationError);
    expect(JSON.stringify(error)).not.toContain(privateMarker);
    expect(String(error)).not.toContain(privateMarker);
    expect(deps.collectSpend).toHaveBeenCalledTimes(1);
    expect(deps.upsertMeta).not.toHaveBeenCalled();
    expect(deps.revalidate).not.toHaveBeenCalled();
  });

  it("preserves a safe Linx concurrency error after media settles", async () => {
    const deps = makeDependencies();
    const concurrency = new LinxConcurrentRunError("synthetic-run");
    deps.runLinx.mockRejectedValueOnce(concurrency);

    await expect(runDataSyncWithDependencies(input, deps)).rejects
      .toBe(concurrency);
    expect(deps.collectSpend).toHaveBeenCalledTimes(1);
    expect(deps.upsertMeta).not.toHaveBeenCalled();
  });

  it("maps an unexpected media-batch failure to safe source results", async () => {
    const deps = makeDependencies();
    const privateMarker = ["private", "media", "marker"].join("-");
    deps.collectSpend.mockRejectedValueOnce(new Error(privateMarker));

    const error = await runDataSyncWithDependencies(input, deps).catch(
      (value) => value,
    );

    expect(error).toBeInstanceOf(DataSyncPublicationError);
    expect(JSON.stringify(error)).not.toContain(privateMarker);
    expect(error.sources).toMatchObject({
      META: { status: "FAILED" },
      GOOGLE_PRODUCTS: { status: "FAILED" },
      GOOGLE_SERVICES: { status: "FAILED" },
    });
    expect(deps.upsertMeta).not.toHaveBeenCalled();
  });

  it("does not invalidate caches when the existing Meta upsert fails", async () => {
    const deps = makeDependencies();
    deps.upsertMeta.mockRejectedValueOnce(new Error("synthetic database error"));

    await expect(runDataSyncWithDependencies(input, deps)).rejects
      .toBeInstanceOf(DataSyncPublicationError);
    expect(deps.revalidate).not.toHaveBeenCalled();
  });
});
