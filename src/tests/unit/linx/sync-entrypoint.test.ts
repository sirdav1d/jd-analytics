import type { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDeadline } from "@/services/linx/deadline";

const runtimeMocks = vi.hoisted(() => ({
  buildProductionSyncDependencies: vi.fn(),
}));

vi.mock("@/services/linx/sync-runtime", () => ({
  buildProductionSyncDependencies:
    runtimeMocks.buildProductionSyncDependencies,
}));

import {
  runLinxSync,
  type SyncDependencies,
  type SyncInput,
} from "@/services/linx/sync";

const deadlineAt = Date.parse("2026-07-29T12:01:00.000Z");
const input: SyncInput = {
  organizationId: "org-1",
  trigger: "CRON",
  mode: "INCREMENTAL",
  deadlineAt,
  transactionTimeoutMs: 10_000,
};

function makeDependencies() {
  const tx = {} as Prisma.TransactionClient;
  const page = { rows: [], nextTimestamp: BigInt(0) };
  const repo = {
    acquireSyncRun: vi.fn().mockResolvedValue({ id: "run-1" }),
    hasCursorBaseline: vi.fn().mockResolvedValue(true),
    getCursors: vi.fn().mockResolvedValue({
      MOVIMENTO: BigInt(0),
      MOVIMENTO_PLANOS: BigInt(0),
      MOVIMENTO_PRINCIPAL: BigInt(0),
      ROTINA_ORIGEM: BigInt(0),
      RESPOSTA_VENDA: BigInt(0),
    }),
    saveCursors: vi.fn().mockResolvedValue(undefined),
    markRunSuccess: vi.fn().mockResolvedValue(undefined),
    markRunFailed: vi.fn().mockResolvedValue(undefined),
  };
  const dependencies = {
    deadline: createDeadline(() => deadlineAt - 20_000, deadlineAt),
    prisma: {
      $transaction: async <T>(
        callback: (client: Prisma.TransactionClient) => Promise<T>,
      ) => callback(tx),
    },
    repo,
    nowDate: () => new Date("2026-07-29T12:00:00.000Z"),
    readOrganization: async () => ({
      linxCnpj: "11222333000144",
      external_code: 7,
    }),
    fetchMovementPages: async () => page,
    fetchMovementPlanPages: async () => page,
    fetchMovementPrincipalPages: async () => page,
    fetchRoutineOriginPages: async () => page,
    fetchSalesResponsePages: async () => page,
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
    mapCanonicalSales: () => [],
    importSales: async () => ({
      ordersProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsRemoved: 0,
    }),
    revalidateSales: () => undefined,
    logger: { warn: vi.fn() },
  } satisfies SyncDependencies;
  return { dependencies, repo };
}

describe("runLinxSync production entrypoint", () => {
  beforeEach(() => {
    runtimeMocks.buildProductionSyncDependencies.mockReset();
  });

  it("builds production dependencies and exposes the one-argument API", async () => {
    const { dependencies, repo } = makeDependencies();
    runtimeMocks.buildProductionSyncDependencies.mockReturnValue(dependencies);

    await expect(runLinxSync(input)).resolves.toEqual({
      ordersProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsRemoved: 0,
    });

    expect(runLinxSync).toHaveLength(1);
    expect(
      runtimeMocks.buildProductionSyncDependencies,
    ).toHaveBeenCalledWith(input);
    expect(repo.acquireSyncRun).toHaveBeenCalledTimes(1);
  });
});
