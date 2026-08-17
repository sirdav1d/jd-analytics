import { beforeEach, describe, expect, it, vi } from "vitest";
import vercelConfig from "../../../../vercel.json";
import { AuthorizationError } from "@/lib/authorization";
import { DataSyncPublicationError } from "@/services/data-sync/errors";
import {
  LinxConcurrentRunError,
  LinxInitialReconciliationRequiredError,
} from "@/services/linx/sync-repository";

const mocks = vi.hoisted(() => ({
  requireActiveUser: vi.fn(),
  readUniqueActiveLinxOrganization: vi.fn(),
  readLastSuccessfulSyncAt: vi.fn(),
  readCurrentMetaLastSyncAt: vi.fn(),
  inspectLinxOrganization: vi.fn(),
  runDataSync: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireActiveUser: mocks.requireActiveUser,
}));
vi.mock("@/lib/prisma", () => ({ prisma: { synthetic: true } }));
vi.mock("@/app/api/linx/_operations", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/app/api/linx/_operations")
  >();
  return {
    ...actual,
    readUniqueActiveLinxOrganization: mocks.readUniqueActiveLinxOrganization,
    readLastSuccessfulSyncAt: mocks.readLastSuccessfulSyncAt,
    readCurrentMetaLastSyncAt: mocks.readCurrentMetaLastSyncAt,
  };
});
vi.mock("@/services/linx/admin-coordination", () => ({
  inspectLinxOrganization: mocks.inspectLinxOrganization,
}));
vi.mock("@/services/data-sync/runtime", () => ({
  runDataSync: mocks.runDataSync,
}));

import {
  maxDuration as manualMaxDuration,
  POST as syncPost,
} from "@/app/api/sync/route";
import { GET as statusGet } from "@/app/api/sync/status/route";
import {
  GET as cronGet,
  maxDuration as cronMaxDuration,
} from "@/app/api/cron/sync/route";

const organization = {
  id: "synthetic-organization",
  linxCnpj: "00000000000000",
};
const activeUser = {
  id: "synthetic-user",
  name: "Test User",
  email: "user@example.test",
  role: "MANAGER",
  isActive: true,
};
const success = {
  cutoffDate: "2026-08-16",
  lastSuccessfulSyncAt: "2026-08-16T22:00:08.000Z",
  sources: {
    LINX: {
      status: "SUCCESS" as const,
      durationMs: 8000,
      summary: {
        ordersProcessed: 2,
        itemsCreated: 3,
        itemsUpdated: 1,
        itemsRemoved: 0,
      },
    },
    META: { status: "SUCCESS" as const, durationMs: 100, amount: "123.45" },
    GOOGLE_PRODUCTS: {
      status: "SUCCESS" as const,
      durationMs: 200,
      amount: "456.780000",
    },
    GOOGLE_SERVICES: {
      status: "SUCCESS" as const,
      durationMs: 300,
      amount: "9.100000",
    },
  },
};

function manualRequest(body?: unknown) {
  return new Request("http://localhost/api/sync", {
    method: "POST",
    headers: body === undefined
      ? undefined
      : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function cronRequest(secret?: string) {
  return new Request("http://localhost/api/cron/sync", {
    headers: secret ? { authorization: `Bearer ${secret}` } : undefined,
  });
}

beforeEach(() => {
  mocks.requireActiveUser.mockResolvedValue(activeUser);
  mocks.readUniqueActiveLinxOrganization.mockResolvedValue(organization);
  mocks.readLastSuccessfulSyncAt.mockResolvedValue(
    "2026-08-16T21:59:58.000Z",
  );
  mocks.readCurrentMetaLastSyncAt.mockResolvedValue(
    "2026-08-16T22:00:08.000Z",
  );
  mocks.inspectLinxOrganization.mockResolvedValue({ kind: "READY" });
  mocks.runDataSync.mockResolvedValue(success);
});

describe("manual coordinated sync", () => {
  it.each([
    [new AuthorizationError(401, "Não autenticado"), 401],
    [new AuthorizationError(403, "Usuário inativo"), 403],
  ])("rejects authorization before body and data access", async (error, status) => {
    mocks.requireActiveUser.mockRejectedValueOnce(error);

    const response = await syncPost(manualRequest({ forbidden: true }));

    expect(response.status).toBe(status);
    expect(mocks.readUniqueActiveLinxOrganization).not.toHaveBeenCalled();
    expect(mocks.runDataSync).not.toHaveBeenCalled();
  });

  it.each(["ADMIN", "MANAGER", "SELLER"] as const)(
    "allows an active %s to start the fixed coordinated sync",
    async (role) => {
      mocks.requireActiveUser.mockResolvedValueOnce({ ...activeUser, role });
      vi.spyOn(Date, "now").mockReturnValue(
        Date.parse("2026-08-16T22:00:00.000Z"),
      );

      const response = await syncPost(manualRequest());

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(success);
      expect(mocks.runDataSync).toHaveBeenCalledWith({
        organizationId: organization.id,
        requestedById: activeUser.id,
        trigger: "MANUAL",
        deadlineAt: Date.parse("2026-08-16T22:00:48.000Z"),
        transactionTimeoutMs: 30_000,
      });
    },
  );

  it("accepts an explicitly empty object body", async () => {
    const response = await syncPost(manualRequest({}));

    expect(response.status).toBe(200);
    expect(mocks.runDataSync).toHaveBeenCalledTimes(1);
  });

  it.each([null, [], "invalid", 1, { mode: "RECONCILIATION" }])(
    "rejects unsupported body %j",
    async (body) => {
      const response = await syncPost(manualRequest(body));

      expect(response.status).toBe(400);
      expect(mocks.runDataSync).not.toHaveBeenCalled();
    },
  );

  it("does not start providers while the existing Linx gate is running", async () => {
    mocks.inspectLinxOrganization.mockResolvedValueOnce({
      kind: "RUNNING",
      run: {
        id: "synthetic-run",
        organizationId: organization.id,
        status: "RUNNING",
        mode: "INCREMENTAL",
        stage: "MOVIMENTO",
        startedAt: new Date("2026-08-16T22:00:00.000Z"),
      },
    });

    const response = await syncPost(manualRequest());

    expect(response.status).toBe(409);
    expect(mocks.runDataSync).not.toHaveBeenCalled();
  });

  it.each([
    new LinxConcurrentRunError("synthetic-run"),
    new LinxInitialReconciliationRequiredError(),
  ])("maps a safe Linx coordination error to 409", async (error) => {
    mocks.runDataSync.mockRejectedValueOnce(error);

    const response = await syncPost(manualRequest());

    expect(response.status).toBe(409);
    const payload = await response.json();
    expect(payload.error).toBe(error.message);
  });

  it("returns a safe failure when complete publication is impossible", async () => {
    const sources = {
      ...success.sources,
      META: {
        status: "FAILED" as const,
        durationMs: 10,
        error: "Não foi possível consultar o investimento Meta.",
      },
    };
    mocks.runDataSync.mockRejectedValueOnce(
      new DataSyncPublicationError(sources),
    );

    const response = await syncPost(manualRequest());
    const text = await response.clone().text();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Não foi possível concluir a sincronização de dados.",
      sources,
    });
    expect(text).not.toContain("access_token");
  });

  it("keeps a 60-second function budget", () => {
    expect(manualMaxDuration).toBe(60);
  });
});

describe("coordinated sync status", () => {
  it("returns existing Linx state and current-month Meta update separately", async () => {
    mocks.inspectLinxOrganization.mockResolvedValueOnce({
      kind: "RUNNING",
      run: {
        id: "synthetic-run",
        organizationId: organization.id,
        status: "RUNNING",
        mode: "INCREMENTAL",
        stage: "MOVIMENTO_PLANOS",
        startedAt: new Date("2026-08-16T22:00:00.000Z"),
      },
    });

    const response = await statusGet();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      running: true,
      lastLinxSuccessfulSyncAt: "2026-08-16T21:59:58.000Z",
      lastMetaSyncAt: "2026-08-16T22:00:08.000Z",
    });
  });

  it("rejects an inactive user before data access", async () => {
    mocks.requireActiveUser.mockRejectedValueOnce(
      new AuthorizationError(403, "Usuário inativo"),
    );

    const response = await statusGet();

    expect(response.status).toBe(403);
    expect(mocks.readUniqueActiveLinxOrganization).not.toHaveBeenCalled();
  });
});

describe("coordinated cron", () => {
  it.each([
    ["missing", undefined],
    ["invalid", "invalid-synthetic-value"],
  ])("rejects a %s authorization before data access", async (_case, actual) => {
    const syntheticCronSecret = `test-${"c".repeat(24)}`;
    vi.stubEnv("CRON_SECRET", syntheticCronSecret);

    const response = await cronGet(cronRequest(actual));

    expect(response.status).toBe(401);
    expect(mocks.readUniqueActiveLinxOrganization).not.toHaveBeenCalled();
    expect(mocks.runDataSync).not.toHaveBeenCalled();
  });

  it("runs the same coordinator with cron limits", async () => {
    const syntheticCronSecret = `test-${"c".repeat(24)}`;
    vi.stubEnv("CRON_SECRET", syntheticCronSecret);
    vi.spyOn(Date, "now").mockReturnValue(
      Date.parse("2026-08-16T22:00:00.000Z"),
    );

    const response = await cronGet(cronRequest(syntheticCronSecret));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(success);
    expect(mocks.runDataSync).toHaveBeenCalledWith({
      organizationId: organization.id,
      trigger: "CRON",
      deadlineAt: Date.parse("2026-08-16T22:00:48.000Z"),
      transactionTimeoutMs: 15_000,
    });
  });

  it("uses the unified 22 UTC schedule and 60-second budget", () => {
    expect(vercelConfig.crons).toEqual([
      { path: "/api/cron/sync", schedule: "0 22 * * *" },
    ]);
    expect(cronMaxDuration).toBe(60);
  });
});
