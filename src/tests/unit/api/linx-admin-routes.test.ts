import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthorizationError } from "@/lib/authorization";
import {
  LinxConcurrentRunError,
  LinxInitialReconciliationRequiredError,
  LinxReconciliationAuthorizationUsedError,
} from "@/services/linx/sync-repository";
import {
  MAX_RECONCILIATION_AUTHORIZATION_LENGTH,
  ReconciliationAuthorizationError,
} from "@/services/linx/preview-authorization";

const mocks = vi.hoisted(() => {
  const organizationFindMany = vi.fn();
  const organizationFindUnique = vi.fn();
  const organizationFindFirst = vi.fn();
  const organizationUpdateMany = vi.fn();
  const organizationUpdate = vi.fn();
  const runFindFirst = vi.fn();
  const runUpdateMany = vi.fn();
  const cursorFindMany = vi.fn();
  const productFindMany = vi.fn();
  const pedidoCount = vi.fn();
  return {
    requireAdmin: vi.fn(),
    transaction: vi.fn(),
    organizationFindMany,
    organizationFindUnique,
    organizationFindFirst,
    organizationUpdateMany,
    organizationUpdate,
    runFindFirst,
    runUpdateMany,
    cursorFindMany,
    productFindMany,
    pedidoCount,
    queryRaw: vi.fn(),
    discoverLinxStores: vi.fn(),
    previewProductionReconciliation: vi.fn(),
    runLinxSync: vi.fn(),
    tx: {
      $queryRaw: vi.fn(),
      linxSyncRun: {
        findFirst: runFindFirst,
        updateMany: runUpdateMany,
      },
      linxSyncCursor: { findMany: cursorFindMany },
      product: { findMany: productFindMany },
      pedido: { count: pedidoCount },
    organization: {
        findMany: organizationFindMany,
        findUnique: organizationFindUnique,
        findFirst: organizationFindFirst,
        updateMany: organizationUpdateMany,
        update: organizationUpdate,
      },
    },
  };
});

vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: mocks.transaction,
    organization: {
      findMany: mocks.organizationFindMany,
      findUnique: mocks.organizationFindUnique,
      findFirst: mocks.organizationFindFirst,
      updateMany: mocks.organizationUpdateMany,
      update: mocks.organizationUpdate,
    },
    linxSyncRun: {
      findFirst: mocks.runFindFirst,
      updateMany: mocks.runUpdateMany,
    },
    linxSyncCursor: { findMany: mocks.cursorFindMany },
    product: { findMany: mocks.productFindMany },
    pedido: { count: mocks.pedidoCount },
  },
}));
vi.mock("@/services/linx/admin-runtime", () => ({
  discoverLinxStores: mocks.discoverLinxStores,
  previewProductionReconciliation: mocks.previewProductionReconciliation,
}));
vi.mock("@/services/linx/sync", () => ({
  runLinxSync: mocks.runLinxSync,
}));

import { GET as statusGet } from "@/app/api/admin/linx/status/route";
import { POST as discoverPost } from "@/app/api/admin/linx/discover/route";
import { POST as activatePost } from "@/app/api/admin/linx/activate/route";
import { POST as previewPost } from "@/app/api/admin/linx/reconciliation/preview/route";
import { POST as syncPost } from "@/app/api/admin/linx/sync/route";

const organizationId = "4c5e8d3c-64a2-4c42-b657-58ed175896e7";
const admin = {
  id: "admin-id",
  name: "Admin",
  email: "admin@example.test",
  role: "ADMIN",
  isActive: true,
};

function makeRequest(path = "/api/admin/linx/status", init?: RequestInit) {
  return new Request(`http://localhost${path}`, init);
}

function jsonRequest(path: string, body: unknown) {
  return makeRequest(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mocks.requireAdmin.mockResolvedValue(admin);
  mocks.organizationFindMany.mockResolvedValue([]);
  mocks.organizationFindUnique.mockResolvedValue({
    id: organizationId,
    linxSyncEnabled: true,
    linxCnpj: "11222333000144",
  });
  mocks.runFindFirst.mockResolvedValue(null);
  mocks.runUpdateMany.mockResolvedValue({ count: 0 });
  mocks.cursorFindMany.mockResolvedValue([]);
  mocks.productFindMany.mockResolvedValue([]);
  mocks.discoverLinxStores.mockResolvedValue([
    {
      cnpj: "11222333000144",
      name: "Loja Centro",
      portalId: 7,
      companyId: 9,
    },
  ]);
  mocks.organizationFindFirst.mockResolvedValue(null);
  mocks.pedidoCount.mockResolvedValue(0);
  mocks.previewProductionReconciliation.mockResolvedValue({
    period: { from: "2026-06-30", to: "2026-07-29" },
    linx: { orders: 0, items: 0, grossValue: 0 },
    database: { orders: 0, items: 0, grossValue: 0 },
    differences: {
      missingInDatabase: 0,
      changedOrders: 0,
      databaseOnly: 0,
    },
    estimatedDurationMs: 1,
    fitsRuntimeBudget: true,
  });
  mocks.runLinxSync.mockResolvedValue({
    ordersProcessed: 2,
    itemsCreated: 3,
    itemsUpdated: 1,
    itemsRemoved: 0,
  });
  mocks.transaction.mockImplementation(
    async (callback: (tx: typeof mocks.tx) => Promise<unknown>) =>
      callback(mocks.tx),
  );
  mocks.tx.$queryRaw.mockResolvedValue([]);
  mocks.organizationUpdateMany.mockResolvedValue({ count: 1 });
  mocks.organizationUpdate.mockResolvedValue({ id: organizationId });
});

describe("Linx admin routes", () => {
  it.each([
    ["status", () => statusGet()],
    [
      "discover",
      () => discoverPost(makeRequest("/api/admin/linx/discover", { method: "POST" })),
    ],
    [
      "activate",
      () => activatePost(makeRequest("/api/admin/linx/activate", { method: "POST" })),
    ],
    [
      "preview",
      () =>
        previewPost(
          makeRequest("/api/admin/linx/reconciliation/preview", {
            method: "POST",
          }),
        ),
    ],
    [
      "sync",
      () => syncPost(makeRequest("/api/admin/linx/sync", { method: "POST" })),
    ],
  ])("rejects a non-admin before reading the %s request", async (_name, invoke) => {
    mocks.requireAdmin.mockRejectedValueOnce(
      new AuthorizationError(403, "Acesso negado"),
    );

    const response = await invoke();

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Acesso negado" });
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.tx.$queryRaw).not.toHaveBeenCalled();
    expect(mocks.discoverLinxStores).not.toHaveBeenCalled();
    expect(mocks.previewProductionReconciliation).not.toHaveBeenCalled();
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("does not accept a browser-provided API URL or key", async () => {
    const response = await activatePost(
      jsonRequest("/api/admin/linx/activate", {
        organizationId,
        cnpj: "00000000000000",
        portalId: null,
        companyId: null,
        apiKey: "must-not-be-accepted",
        url: "https://example.test",
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("serializes cursor BigInts and returns the active organization and latest run", async () => {
    mocks.organizationFindMany.mockResolvedValue([
      {
        id: organizationId,
        name: "Loja Centro",
        linxCnpj: "11222333000144",
        linxPortalId: 7,
        linxCompanyId: 9,
        linxSyncEnabled: true,
      },
      {
        id: "ac8bd433-5955-4e6d-8266-afd636393f62",
        name: "Loja Norte",
        linxCnpj: null,
        linxPortalId: null,
        linxCompanyId: null,
        linxSyncEnabled: false,
      },
    ]);
    mocks.runFindFirst.mockResolvedValue({
      id: "run-1",
      organizationId,
      trigger: "MANUAL",
      status: "RUNNING",
      mode: "INCREMENTAL",
      stage: "MOVIMENTO",
      failureStage: null,
      processedOrders: 0,
      processedItems: 0,
      errorMessage: null,
      startedAt: new Date("2026-07-29T12:00:00.000Z"),
      finishedAt: null,
    });
    mocks.cursorFindMany.mockResolvedValue([
      {
        method: "MOVIMENTO",
        lastTimestamp: BigInt("9007199254740993"),
        updatedAt: new Date("2026-07-29T11:59:00.000Z"),
      },
    ]);
    mocks.productFindMany.mockResolvedValue([
      {
        external_code: 9999,
        description: "Produto não identificado — código 9999",
        catalogLastCheckedAt: new Date("2026-08-11T12:00:00.000Z"),
      },
    ]);

    const response = await statusGet();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      organizations: [
        {
          id: organizationId,
          name: "Loja Centro",
          linxCnpj: "11222333000144",
          linxPortalId: 7,
          linxCompanyId: 9,
          linxSyncEnabled: true,
        },
        {
          id: "ac8bd433-5955-4e6d-8266-afd636393f62",
          name: "Loja Norte",
          linxCnpj: null,
          linxPortalId: null,
          linxCompanyId: null,
          linxSyncEnabled: false,
        },
      ],
      activeOrganizationId: organizationId,
      run: {
        id: "run-1",
        organizationId,
        trigger: "MANUAL",
        status: "RUNNING",
        mode: "INCREMENTAL",
        stage: "MOVIMENTO",
        failureStage: null,
        processedOrders: 0,
        processedItems: 0,
        errorMessage: null,
        startedAt: "2026-07-29T12:00:00.000Z",
        finishedAt: null,
      },
      cursors: [
        {
          method: "MOVIMENTO",
          lastTimestamp: "9007199254740993",
          updatedAt: "2026-07-29T11:59:00.000Z",
        },
      ],
      pendingProducts: [
        {
          externalCode: 9999,
          description: "Produto não identificado — código 9999",
          lastCheckedAt: "2026-08-11T12:00:00.000Z",
        },
      ],
    });
    expect(mocks.productFindMany).toHaveBeenCalledWith({
      where: { catalogStatus: "PENDING" },
      orderBy: { external_code: "asc" },
      select: {
        external_code: true,
        description: true,
        catalogLastCheckedAt: true,
      },
    });
  });

  it("discovers stores through the server-only production composition", async () => {
    const stores = [
      {
        cnpj: "11222333000144",
        name: "Loja Centro",
        portalId: 7,
        companyId: 9,
      },
    ];
    mocks.discoverLinxStores.mockResolvedValue(stores);

    const response = await discoverPost(
      jsonRequest("/api/admin/linx/discover", {}),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ stores });
    expect(mocks.discoverLinxStores).toHaveBeenCalledWith();
  });

  it("returns 400 for syntactically malformed discovery JSON without starting discovery", async () => {
    const response = await discoverPost(
      makeRequest("/api/admin/linx/discover", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Dados inválidos.",
    });
    expect(mocks.discoverLinxStores).not.toHaveBeenCalled();
  });

  it.each([
    [
      "discovery service",
      () => {
        mocks.discoverLinxStores.mockRejectedValueOnce(
          new Error("apiKey should never escape"),
        );
        return discoverPost(
          jsonRequest("/api/admin/linx/discover", {}),
        );
      },
      "Não foi possível validar a conexão com a Linx.",
    ],
    [
      "preview service",
      () => {
        mocks.previewProductionReconciliation.mockRejectedValueOnce(
          new Error("password should never escape"),
        );
        return previewPost(
          jsonRequest("/api/admin/linx/reconciliation/preview", {
            organizationId,
          }),
        );
      },
      "Não foi possível gerar o preview da conciliação.",
    ],
  ])("maps an internal %s failure to safe JSON 500", async (_name, invoke, message) => {
    const response = await invoke();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: message });
  });

  it("activates exactly one organization inside one transaction", async () => {
    const response = await activatePost(
      jsonRequest("/api/admin/linx/activate", {
        organizationId,
        cnpj: "11222333000144",
        portalId: 7,
        companyId: 9,
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.tx.organization.updateMany).toHaveBeenCalledWith({
      data: { linxSyncEnabled: false },
    });
    expect(mocks.tx.organization.update).toHaveBeenCalledWith({
      where: { id: organizationId },
      data: {
        linxCnpj: "11222333000144",
        linxPortalId: 7,
        linxCompanyId: 9,
        linxSyncEnabled: true,
      },
    });
    expect(
      mocks.tx.organization.updateMany.mock.invocationCallOrder[0],
    ).toBeLessThan(
      mocks.tx.organization.update.mock.invocationCallOrder[0],
    );
  });

  it("rejects a syntactically valid store tuple that is absent from the fresh server discovery", async () => {
    mocks.discoverLinxStores.mockResolvedValueOnce([
      {
        cnpj: "11222333000144",
        name: "Loja Centro",
        portalId: 7,
        companyId: 9,
      },
    ]);
    const response = await activatePost(
      jsonRequest("/api/admin/linx/activate", {
        organizationId,
        cnpj: "11222333000144",
        portalId: 7,
        companyId: 10,
      }),
    );
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "A loja selecionada não corresponde à descoberta atual.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("refuses activation while any synchronization is running", async () => {
    mocks.runFindFirst.mockResolvedValueOnce({
      id: "run-active",
      organizationId,
      status: "RUNNING",
      mode: "INCREMENTAL",
      stage: "MOVIMENTO",
      startedAt: new Date("2026-07-29T12:00:00.000Z"),
    });

    const response = await activatePost(
      jsonRequest("/api/admin/linx/activate", {
        organizationId,
        cnpj: "11222333000144",
        portalId: 7,
        companyId: 9,
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      error: "Já existe uma sincronização Linx em andamento",
      run: {
        id: "run-active",
        status: "RUNNING",
        stage: "MOVIMENTO",
        startedAt: "2026-07-29T12:00:00.000Z",
      },
    });
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(mocks.runUpdateMany.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.runFindFirst.mock.invocationCallOrder[0],
    );
    expect(mocks.organizationUpdateMany).not.toHaveBeenCalled();
  });

  it("reconciles expired leases before status reads the latest run", async () => {
    mocks.organizationFindMany.mockResolvedValue([
      {
        id: organizationId,
        name: "Loja Centro",
        linxCnpj: "11222333000144",
        linxPortalId: 7,
        linxCompanyId: 9,
        linxSyncEnabled: true,
      },
    ]);
    mocks.runFindFirst.mockResolvedValue({
      id: "expired-run",
      organizationId,
      trigger: "MANUAL",
      status: "FAILED",
      mode: "INCREMENTAL",
      stage: "MOVIMENTO",
      failureStage: "LEASE_EXPIRED",
      processedOrders: 0,
      processedItems: 0,
      errorMessage: "Execução encerrada: lease expirado",
      startedAt: new Date("2026-07-29T11:00:00.000Z"),
      finishedAt: new Date("2026-07-29T12:00:00.000Z"),
    });

    const response = await statusGet();

    expect(response.status).toBe(200);
    expect(mocks.runUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "RUNNING" }),
        data: expect.objectContaining({
          status: "FAILED",
          failureStage: "LEASE_EXPIRED",
          leaseExpiresAt: null,
        }),
      }),
    );
    expect(mocks.runUpdateMany.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.runFindFirst.mock.invocationCallOrder[0],
    );
    await expect(response.json()).resolves.toMatchObject({
      run: {
        id: "expired-run",
        status: "FAILED",
        failureStage: "LEASE_EXPIRED",
      },
    });
  });

  it("sanitizes an old persisted Prisma transaction failure in the status response", async () => {
    mocks.organizationFindMany.mockResolvedValue([
      {
        id: organizationId,
        name: "Loja Centro",
        linxCnpj: "11222333000144",
        linxPortalId: 7,
        linxCompanyId: 9,
        linxSyncEnabled: true,
      },
    ]);
    mocks.runFindFirst.mockResolvedValue({
      id: "old-failure",
      organizationId,
      trigger: "MANUAL",
      status: "FAILED",
      mode: "RECONCILIATION",
      stage: "PERSISTING",
      failureStage: "PERSISTING",
      processedOrders: 0,
      processedItems: 0,
      errorMessage:
        "Invalid tx.customer.upsert() invocation in /home/app/.next/server/chunks/db.js: Transaction API error: Transaction not found",
      startedAt: new Date("2026-07-29T11:00:00.000Z"),
      finishedAt: new Date("2026-07-29T12:00:00.000Z"),
    });

    const response = await statusGet();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.run.errorMessage).toBe(
      "A gravação excedeu o tempo disponível. Gere um novo preview e tente novamente.",
    );
    expect(JSON.stringify(body)).not.toMatch(/tx\.|\/home|\.next|Prisma|Transaction API/i);
  });

  it("previews reconciliation through read-only production dependencies", async () => {
    const response = await previewPost(
      jsonRequest("/api/admin/linx/reconciliation/preview", {
        organizationId,
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.previewProductionReconciliation).toHaveBeenCalledWith(
      organizationId,
      "admin-id",
    );
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
  });

  it.each([
    [
      "preview",
      () =>
        previewPost(
          jsonRequest("/api/admin/linx/reconciliation/preview", {
            organizationId,
          }),
        ),
    ],
    [
      "sync",
      () =>
        syncPost(
          jsonRequest("/api/admin/linx/sync", {
            organizationId,
            mode: "INCREMENTAL",
          }),
        ),
    ],
  ])("does not allow %s for an inactive organization", async (_name, invoke) => {
    mocks.organizationFindUnique.mockResolvedValueOnce({
      id: organizationId,
      linxSyncEnabled: false,
      linxCnpj: "11222333000144",
    });

    const response = await invoke();

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "A organização selecionada não é a loja Linx ativa.",
    });
    expect(mocks.previewProductionReconciliation).not.toHaveBeenCalled();
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("runs the one-argument sync entrypoint with the authenticated requester", async () => {
    vi.spyOn(Date, "now").mockReturnValue(
      Date.parse("2026-07-29T12:00:00.000Z"),
    );

    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "INCREMENTAL",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ordersProcessed: 2,
      itemsCreated: 3,
      itemsUpdated: 1,
      itemsRemoved: 0,
    });
    expect(mocks.runLinxSync).toHaveBeenCalledWith({
      organizationId,
      requestedById: "admin-id",
      trigger: "MANUAL",
      mode: "INCREMENTAL",
      deadlineAt: Date.parse("2026-07-29T12:00:48.000Z"),
      transactionTimeoutMs: 30_000,
      reconciliationAuthorization: undefined,
    });
  });

  it("only confirms reconciliation when the admin explicitly requests that mode", async () => {
    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "RECONCILIATION",
        trigger: "RETRY",
        reconciliationAuthorization: "preview-token",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.runLinxSync).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId,
        requestedById: "admin-id",
        mode: "RECONCILIATION",
        trigger: "RETRY",
        reconciliationAuthorization: "preview-token",
      }),
    );
  });

  it("rejects a direct reconciliation request without a preview authorization", async () => {
    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "RECONCILIATION",
        trigger: "MANUAL",
      }),
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Dados inválidos.",
    });
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("rejects a reconciliation authorization larger than the transport envelope", async () => {
    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "RECONCILIATION",
        trigger: "MANUAL",
        reconciliationAuthorization: "x".repeat(
          MAX_RECONCILIATION_AUTHORIZATION_LENGTH + 1,
        ),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Dados inválidos.",
    });
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("maps a missing incremental baseline to its public 409 response", async () => {
    mocks.runLinxSync.mockRejectedValueOnce(
      new LinxInitialReconciliationRequiredError(),
    );

    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "INCREMENTAL",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Faça a conciliação inicial antes da sincronização incremental.",
    });
  });

  it.each([
    ["invalid preview authorization", new ReconciliationAuthorizationError()],
    ["already-used preview authorization", new LinxReconciliationAuthorizationUsedError()],
  ])("maps a %s reconciliation failure to 409", async (_label, error) => {
    mocks.runLinxSync.mockRejectedValueOnce(error);

    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "RECONCILIATION",
        reconciliationAuthorization: "preview-token",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: error.message });
  });

  it("maps a concurrent sync to 409 with the active run", async () => {
    mocks.runLinxSync.mockRejectedValueOnce(
      new LinxConcurrentRunError("run-active"),
    );
    mocks.runFindFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "run-active",
        organizationId,
        status: "RUNNING",
        stage: "MOVIMENTO_PLANOS",
        startedAt: new Date("2026-07-29T12:00:00.000Z"),
      });

    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "INCREMENTAL",
      }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      run: {
        id: "run-active",
        status: "RUNNING",
        stage: "MOVIMENTO_PLANOS",
      },
    });
  });

  it("contains a Prisma failure while resolving a concurrent sync as safe JSON 500", async () => {
    mocks.runLinxSync.mockRejectedValueOnce(
      new LinxConcurrentRunError("run-active"),
    );
    mocks.transaction
      .mockImplementationOnce(
        async (callback: (tx: typeof mocks.tx) => Promise<unknown>) =>
          callback(mocks.tx),
      )
      .mockRejectedValueOnce(new Error("DATABASE_URL=secret"));

    const response = await syncPost(
      jsonRequest("/api/admin/linx/sync", {
        organizationId,
        mode: "INCREMENTAL",
      }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Não foi possível concluir a sincronização Linx.",
    });
  });

  it.each([
    [
      "status Prisma transaction",
      () => {
        mocks.transaction.mockRejectedValueOnce(
          new Error("DATABASE_URL=secret"),
        );
        return statusGet();
      },
      "Não foi possível consultar o status Linx.",
    ],
    [
      "activation Prisma transaction",
      () => {
        mocks.transaction.mockRejectedValueOnce(new Error("password secret"));
        return activatePost(
          jsonRequest("/api/admin/linx/activate", {
            organizationId,
            cnpj: "11222333000144",
            portalId: 7,
            companyId: 9,
          }),
        );
      },
      "Não foi possível ativar a loja Linx.",
    ],
    [
      "preview Prisma transaction",
      () => {
        mocks.transaction.mockRejectedValueOnce(new Error("token secret"));
        return previewPost(
          jsonRequest("/api/admin/linx/reconciliation/preview", {
            organizationId,
          }),
        );
      },
      "Não foi possível gerar o preview da conciliação.",
    ],
    [
      "sync service",
      () => {
        mocks.runLinxSync.mockRejectedValueOnce(
          new Error("apiKey secret"),
        );
        return syncPost(
          jsonRequest("/api/admin/linx/sync", {
            organizationId,
            mode: "INCREMENTAL",
          }),
        );
      },
      "Não foi possível concluir a sincronização Linx.",
    ],
  ])("contains a %s failure as safe JSON 500", async (_name, invoke, message) => {
    const response = await invoke();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: message });
  });

  it("uses an explicit 60 second function budget for sync and preview", async () => {
    const [syncRoute, previewRoute] = await Promise.all([
      import("@/app/api/admin/linx/sync/route"),
      import("@/app/api/admin/linx/reconciliation/preview/route"),
    ]);

    expect(syncRoute.maxDuration).toBe(60);
    expect(previewRoute.maxDuration).toBe(60);
  });
});
