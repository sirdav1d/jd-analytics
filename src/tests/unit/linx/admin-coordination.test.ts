import { describe, expect, it, vi } from "vitest";
import {
  activateLinxOrganization,
  LINX_COORDINATION_LOCK_KEY,
  LinxCnpjRemapBlockedError,
  withLinxCoordination,
} from "@/services/linx/admin-coordination";
import {
  createSyncRepository,
  LinxInactiveOrganizationError,
} from "@/services/linx/sync-repository";

const now = new Date("2026-07-29T12:00:00.000Z");
const oldOrganizationId = "old-org";
const newOrganizationId = "new-org";

type OrganizationState = {
  id: string;
  linxCnpj: string | null;
  linxSyncEnabled: boolean;
};

type CursorState = {
  organizationId: string;
  method: string;
};

type RunState = {
  id: string;
  organizationId: string;
  status: "RUNNING" | "FAILED";
  stage: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  leaseExpiresAt: Date | null;
  errorMessage: string | null;
  failureStage?: string | null;
};

function makeCoordinatedDatabase() {
  const organizations: OrganizationState[] = [
    {
      id: oldOrganizationId,
      linxCnpj: "11222333000144",
      linxSyncEnabled: true,
    },
    {
      id: newOrganizationId,
      linxCnpj: null,
      linxSyncEnabled: false,
    },
  ];
  const runs: RunState[] = [];
  const cursors: CursorState[] = [
    { organizationId: oldOrganizationId, method: "MOVIMENTO" },
    { organizationId: newOrganizationId, method: "MOVIMENTO_PLANOS" },
  ];
  const lockKeys: string[] = [];
  let transactionTail = Promise.resolve();

  const tx = {
    $queryRaw: vi.fn(async (query: {
      values?: unknown[];
      strings: readonly string[];
    }) => {
      lockKeys.push(String(query.values?.[0]));
      return [];
    }),
    organization: {
      findFirst: vi.fn(
        async ({
          where,
        }: {
          where: { linxCnpj: string; id: { not: string } };
        }) =>
          organizations.find(
            (candidate) =>
              candidate.linxCnpj === where.linxCnpj &&
              candidate.id !== where.id.not,
          ) ?? null,
      ),
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        const organization = organizations.find(
          (candidate) => candidate.id === where.id,
        );
        return organization
          ? {
              linxSyncEnabled: organization.linxSyncEnabled,
              linxCnpj: organization.linxCnpj,
            }
          : null;
      }),
      updateMany: vi.fn(async () => {
        organizations.forEach((organization) => {
          organization.linxSyncEnabled = false;
        });
        return { count: organizations.length };
      }),
      update: vi.fn(
        async ({
          where,
          data,
        }: {
          where: { id: string };
          data: {
            linxCnpj: string;
            linxSyncEnabled: boolean;
          };
        }) => {
          const organization = organizations.find(
            (candidate) => candidate.id === where.id,
          );
          if (!organization) throw new Error("not found");
          Object.assign(organization, data);
          return organization;
        },
      ),
    },
    linxSyncRun: {
      updateMany: vi.fn(
        async ({
          data,
        }: {
          data: {
            status: "FAILED";
            failureStage: string;
            finishedAt: Date;
            leaseExpiresAt: null;
            errorMessage: string;
          };
        }) => {
          let count = 0;
          for (const run of runs) {
            if (
              run.status === "RUNNING" &&
              (!run.leaseExpiresAt || run.leaseExpiresAt <= now)
            ) {
              Object.assign(run, data);
              count += 1;
            }
          }
          return { count };
        },
      ),
      findFirst: vi.fn(
        async ({
          where,
        }: {
          where: {
            status: "RUNNING";
            organizationId?: string;
          };
        }) =>
          runs.find(
            (run) =>
              run.status === where.status &&
              (!where.organizationId ||
                run.organizationId === where.organizationId),
          ) ?? null,
      ),
      create: vi.fn(
        async ({
          data,
        }: {
          data: Omit<
            RunState,
            "id" | "startedAt" | "finishedAt" | "errorMessage"
          > & {
            requestedById?: string | null;
            trigger: string;
          };
        }) => {
          const run: RunState = {
            id: `run-${runs.length + 1}`,
            organizationId: data.organizationId,
            status: "RUNNING",
            stage: data.stage,
            startedAt: now,
            finishedAt: null,
            leaseExpiresAt: data.leaseExpiresAt,
            errorMessage: null,
          };
          runs.push(run);
          return run;
        },
      ),
      update: vi.fn(),
    },
    linxSyncCursor: {
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn(async ({ where }: { where: { organizationId: string } }) => {
        let count = 0;
        for (let index = cursors.length - 1; index >= 0; index -= 1) {
          if (cursors[index].organizationId === where.organizationId) {
            cursors.splice(index, 1);
            count += 1;
          }
        }
        return { count };
      }),
    },
    pedido: {
      count: vi.fn().mockResolvedValue(0),
    },
  };

  const db = {
    ...tx,
    $transaction: vi.fn(
      <T>(callback: (transaction: typeof tx) => Promise<T>) => {
        const result = transactionTail.then(() => callback(tx));
        transactionTail = result.then(
          () => undefined,
          () => undefined,
        );
        return result;
      },
    ),
  };

  return { db, organizations, runs, cursors, lockKeys, tx };
}

describe("Linx ADMIN coordination", () => {
  it("casts the advisory lock result to a Prisma-supported type", async () => {
    const db = makeCoordinatedDatabase();

    await withLinxCoordination(db.db as never, now, async () => undefined);

    const lockSql = db.tx.$queryRaw.mock.calls[0][0].strings.join("?");
    expect(lockSql).toContain(")::text");
  });

  it("reconciles null and expired leases to FAILED under the advisory lock", async () => {
    const db = makeCoordinatedDatabase();
    db.runs.push(
      {
        id: "null-lease",
        organizationId: oldOrganizationId,
        status: "RUNNING",
        stage: "MOVIMENTO",
        startedAt: new Date("2026-07-29T11:00:00.000Z"),
        finishedAt: null,
        leaseExpiresAt: null,
        errorMessage: null,
      },
      {
        id: "expired-lease",
        organizationId: oldOrganizationId,
        status: "RUNNING",
        stage: "MOVIMENTO_PLANOS",
        startedAt: new Date("2026-07-29T11:30:00.000Z"),
        finishedAt: null,
        leaseExpiresAt: new Date("2026-07-29T11:59:59.999Z"),
        errorMessage: null,
      },
    );

    await withLinxCoordination(db.db as never, now, async () => undefined);

    expect(db.runs).toEqual([
      expect.objectContaining({
        id: "null-lease",
        status: "FAILED",
        stage: "MOVIMENTO",
        failureStage: "LEASE_EXPIRED",
        finishedAt: now,
        leaseExpiresAt: null,
        errorMessage: "Execução encerrada: lease expirado",
      }),
      expect.objectContaining({
        id: "expired-lease",
        status: "FAILED",
        stage: "MOVIMENTO_PLANOS",
        failureStage: "LEASE_EXPIRED",
        finishedAt: now,
        leaseExpiresAt: null,
        errorMessage: "Execução encerrada: lease expirado",
      }),
    ]);
    expect(db.lockKeys).toEqual([LINX_COORDINATION_LOCK_KEY]);
  });

  it("blocks activation that starts after a run is acquired", async () => {
    const database = makeCoordinatedDatabase();
    const repository = createSyncRepository(database.db as never);

    const acquire = repository.acquireSyncRun({
      organizationId: oldOrganizationId,
      requestedById: "admin-id",
      trigger: "MANUAL",
      now,
      leaseExpiresAt: new Date("2026-07-29T12:00:48.000Z"),
    });
    const activate = activateLinxOrganization(
      database.db as never,
      {
        organizationId: newOrganizationId,
        cnpj: "99888777000166",
        portalId: 8,
        companyId: 10,
      },
      now,
    );

    await expect(acquire).resolves.toMatchObject({ id: "run-1" });
    await expect(activate).resolves.toMatchObject({
      kind: "RUNNING",
      run: { id: "run-1", organizationId: oldOrganizationId },
    });
    expect(
      database.organizations.find(
        (organization) => organization.id === oldOrganizationId,
      )?.linxSyncEnabled,
    ).toBe(true);
    expect(database.lockKeys).toEqual([
      LINX_COORDINATION_LOCK_KEY,
      LINX_COORDINATION_LOCK_KEY,
    ]);
  });

  it("rejects an old sync gate after activation changes the active organization", async () => {
    const database = makeCoordinatedDatabase();
    const repository = createSyncRepository(database.db as never);

    await expect(
      activateLinxOrganization(
        database.db as never,
        {
          organizationId: newOrganizationId,
          cnpj: "99888777000166",
          portalId: 8,
          companyId: 10,
        },
        now,
      ),
    ).resolves.toEqual({ kind: "ACTIVATED" });

    await expect(
      repository.acquireSyncRun({
        organizationId: oldOrganizationId,
        requestedById: "admin-id",
        trigger: "MANUAL",
        now,
        leaseExpiresAt: new Date("2026-07-29T12:00:48.000Z"),
      }),
    ).rejects.toBeInstanceOf(LinxInactiveOrganizationError);
    expect(database.runs).toHaveLength(0);
  });

  it("safely clears an unused prior CNPJ owner before remapping the discovered store", async () => {
    const database = makeCoordinatedDatabase();
    await expect(
      activateLinxOrganization(
        database.db as never,
        {
          organizationId: newOrganizationId,
          cnpj: "11222333000144",
          portalId: 8,
          companyId: 10,
        },
        now,
      ),
    ).resolves.toEqual({ kind: "ACTIVATED" });
    expect(database.organizations).toEqual([
      expect.objectContaining({
        id: oldOrganizationId,
        linxCnpj: null,
        linxSyncEnabled: false,
      }),
      expect.objectContaining({
        id: newOrganizationId,
        linxCnpj: "11222333000144",
        linxSyncEnabled: true,
      }),
    ]);
    expect(database.cursors).toEqual([]);
  });

  it("clears only the target cursors when its configured CNPJ changes", async () => {
    const database = makeCoordinatedDatabase();

    await activateLinxOrganization(
      database.db as never,
      {
        organizationId: oldOrganizationId,
        cnpj: "99888777000166",
        portalId: 8,
        companyId: 10,
      },
      now,
    );

    expect(database.cursors).toEqual([
      { organizationId: newOrganizationId, method: "MOVIMENTO_PLANOS" },
    ]);
  });

  it("preserves cursors when the target remains bound to the same CNPJ", async () => {
    const database = makeCoordinatedDatabase();

    await activateLinxOrganization(
      database.db as never,
      {
        organizationId: oldOrganizationId,
        cnpj: "11222333000144",
        portalId: 8,
        companyId: 10,
      },
      now,
    );

    expect(database.cursors).toEqual([
      { organizationId: oldOrganizationId, method: "MOVIMENTO" },
      { organizationId: newOrganizationId, method: "MOVIMENTO_PLANOS" },
    ]);
  });

  it("refuses to remap a CNPJ whose prior owner already has Linx sales", async () => {
    const database = makeCoordinatedDatabase();
    database.tx.pedido.count.mockResolvedValueOnce(1);
    await expect(
      activateLinxOrganization(
        database.db as never,
        {
          organizationId: newOrganizationId,
          cnpj: "11222333000144",
          portalId: 8,
          companyId: 10,
        },
        now,
      ),
    ).rejects.toBeInstanceOf(LinxCnpjRemapBlockedError);
    expect(database.organizations[0]).toMatchObject({
      linxCnpj: "11222333000144",
      linxSyncEnabled: true,
    });
    expect(database.cursors).toEqual([
      { organizationId: oldOrganizationId, method: "MOVIMENTO" },
      { organizationId: newOrganizationId, method: "MOVIMENTO_PLANOS" },
    ]);
  });
});
