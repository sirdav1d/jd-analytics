import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthorizationError } from "@/lib/authorization";
import {
  LinxConcurrentRunError,
  LinxInitialReconciliationRequiredError,
} from "@/services/linx/sync-repository";

const mocks = vi.hoisted(() => ({
  requireActiveUser: vi.fn(),
  organizationFindMany: vi.fn(),
  runFindFirst: vi.fn(),
  inspectLinxOrganization: vi.fn(),
  runLinxSync: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireActiveUser: mocks.requireActiveUser,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    organization: { findMany: mocks.organizationFindMany },
    linxSyncRun: { findFirst: mocks.runFindFirst },
  },
}));
vi.mock("@/services/linx/admin-coordination", () => ({
  inspectLinxOrganization: mocks.inspectLinxOrganization,
}));
vi.mock("@/services/linx/sync", () => ({
  runLinxSync: mocks.runLinxSync,
}));

import { GET as statusGet } from "@/app/api/linx/status/route";
import {
  maxDuration,
  POST as syncPost,
} from "@/app/api/linx/sync/route";

const organizationId = "4c5e8d3c-64a2-4c42-b657-58ed175896e7";
const activeUser = {
  id: "manager-id",
  name: "Manager",
  email: "manager@example.test",
  role: "MANAGER",
  isActive: true,
};

function request(body?: unknown) {
  return new Request("http://localhost/api/linx/sync", {
    method: "POST",
    headers:
      body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

beforeEach(() => {
  mocks.requireActiveUser.mockResolvedValue(activeUser);
  mocks.organizationFindMany.mockResolvedValue([
    { id: organizationId, linxCnpj: "29472089000170" },
  ]);
  mocks.runFindFirst.mockResolvedValue({
    finishedAt: new Date("2026-08-03T23:15:00.000Z"),
  });
  mocks.inspectLinxOrganization.mockResolvedValue({ kind: "READY" });
  mocks.runLinxSync.mockResolvedValue({
    ordersProcessed: 2,
    itemsCreated: 3,
    itemsUpdated: 1,
    itemsRemoved: 0,
  });
});

describe("Linx authenticated operational routes", () => {
  it.each([
    [new AuthorizationError(401, "Não autenticado"), 401],
    [new AuthorizationError(403, "Usuário inativo"), 403],
  ])("rejects status before Prisma access", async (error, status) => {
    mocks.requireActiveUser.mockRejectedValueOnce(error);
    const response = await statusGet();
    expect(response.status).toBe(status);
    expect(mocks.organizationFindMany).not.toHaveBeenCalled();
  });

  it.each([
    [new AuthorizationError(401, "Não autenticado"), 401],
    [new AuthorizationError(403, "Usuário inativo"), 403],
  ])("rejects sync before reading its body or Prisma", async (error, status) => {
    mocks.requireActiveUser.mockRejectedValueOnce(error);
    const response = await syncPost(request({ mode: "RECONCILIATION" }));
    expect(response.status).toBe(status);
    expect(mocks.organizationFindMany).not.toHaveBeenCalled();
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("returns only the latest successful completion timestamp", async () => {
    const response = await statusGet();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      lastSuccessfulSyncAt: "2026-08-03T23:15:00.000Z",
    });
    expect(mocks.runFindFirst).toHaveBeenCalledWith({
      where: {
        organizationId,
        status: "SUCCESS",
        finishedAt: { not: null },
      },
      orderBy: { finishedAt: "desc" },
      select: { finishedAt: true },
    });
  });

  it("returns null when no successful synchronization exists", async () => {
    mocks.runFindFirst.mockResolvedValueOnce(null);
    const response = await statusGet();
    await expect(response.json()).resolves.toEqual({
      lastSuccessfulSyncAt: null,
    });
  });

  it.each(["ADMIN", "MANAGER", "SELLER"] as const)(
    "allows an active %s to run the fixed incremental sync",
    async (role) => {
      mocks.requireActiveUser.mockResolvedValueOnce({ ...activeUser, role });
      vi.spyOn(Date, "now").mockReturnValue(
        Date.parse("2026-08-03T23:00:00.000Z"),
      );

      const response = await syncPost(request());

      expect(response.status).toBe(200);
      expect(mocks.runLinxSync).toHaveBeenCalledWith({
        organizationId,
        requestedById: "manager-id",
        trigger: "MANUAL",
        mode: "INCREMENTAL",
        deadlineAt: Date.parse("2026-08-03T23:00:48.000Z"),
        transactionTimeoutMs: 30_000,
      });
      await expect(response.json()).resolves.toEqual({
        summary: {
          ordersProcessed: 2,
          itemsCreated: 3,
          itemsUpdated: 1,
          itemsRemoved: 0,
        },
        lastSuccessfulSyncAt: "2026-08-03T23:15:00.000Z",
      });
    },
  );

  it("rejects browser-selected organization, mode or authorization", async () => {
    const response = await syncPost(
      request({
        organizationId: "00000000-0000-0000-0000-000000000000",
        mode: "RECONCILIATION",
        trigger: "RETRY",
        reconciliationAuthorization: "client-token",
      }),
    );
    expect(response.status).toBe(400);
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it.each([null, [], "invalid", 1])(
    "rejects a non-empty-object body: %j",
    async (body) => {
      const response = await syncPost(request(body));
      expect(response.status).toBe(400);
      expect(mocks.runLinxSync).not.toHaveBeenCalled();
    },
  );

  it("accepts an explicitly empty object body", async () => {
    const response = await syncPost(request({}));
    expect(response.status).toBe(200);
    expect(mocks.runLinxSync).toHaveBeenCalledTimes(1);
  });

  it("keeps the Vercel function budget at 60 seconds", () => {
    expect(maxDuration).toBe(60);
  });

  it.each([
    [[], "Nenhuma loja Linx ativa foi encontrada."],
    [
      [
        { id: organizationId, linxCnpj: "29472089000170" },
        { id: "second", linxCnpj: "00000000000000" },
      ],
      "A configuração Linx ativa é inválida.",
    ],
    [
      [{ id: organizationId, linxCnpj: null }],
      "A configuração Linx ativa é inválida.",
    ],
  ])(
    "returns 409 for an unusable active-store configuration",
    async (organizations, error) => {
      mocks.organizationFindMany.mockResolvedValueOnce(organizations);
      const response = await syncPost(request());
      expect(response.status).toBe(409);
      await expect(response.json()).resolves.toEqual({ error });
      expect(mocks.runLinxSync).not.toHaveBeenCalled();
    },
  );

  it("does not start a second run when coordination reports RUNNING", async () => {
    mocks.inspectLinxOrganization.mockResolvedValueOnce({
      kind: "RUNNING",
      run: {
        id: "run-active",
        organizationId,
        status: "RUNNING",
        mode: "INCREMENTAL",
        stage: "MOVIMENTO",
        startedAt: new Date("2026-08-03T23:00:00.000Z"),
      },
    });
    const response = await syncPost(request());
    expect(response.status).toBe(409);
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("maps a missing baseline to a safe 409", async () => {
    mocks.runLinxSync.mockRejectedValueOnce(
      new LinxInitialReconciliationRequiredError(),
    );
    const response = await syncPost(request());
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Faça a conciliação inicial antes da sincronização incremental.",
    });
  });

  it("re-inspects a concurrent acquisition and returns its active run", async () => {
    mocks.runLinxSync.mockRejectedValueOnce(
      new LinxConcurrentRunError("run-active"),
    );
    mocks.inspectLinxOrganization
      .mockResolvedValueOnce({ kind: "READY" })
      .mockResolvedValueOnce({
        kind: "RUNNING",
        run: {
          id: "run-active",
          organizationId,
          status: "RUNNING",
          mode: "INCREMENTAL",
          stage: "MOVIMENTO_PLANOS",
          startedAt: new Date("2026-08-03T23:00:00.000Z"),
        },
      });

    const response = await syncPost(request());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      run: { id: "run-active", stage: "MOVIMENTO_PLANOS" },
    });
    expect(mocks.runLinxSync).toHaveBeenCalledTimes(1);
  });

  it("does not leak an unknown operational failure", async () => {
    mocks.runLinxSync.mockRejectedValueOnce(
      new Error("password=secret /home/app/.next/server/chunk.js"),
    );
    const response = await syncPost(request());
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toMatch(
      /password|secret|\/home|\.next/i,
    );
  });
});
