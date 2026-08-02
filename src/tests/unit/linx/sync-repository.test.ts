import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  $transaction: vi.fn(),
  organization: {
    findUnique: vi.fn(),
  },
  linxSyncRun: {
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  linxSyncCursor: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import {
  acquireSyncRun,
  getCursors,
  hasCursorBaseline,
  LinxConcurrentRunError,
  LinxReconciliationAuthorizationUsedError,
  markRunFailed,
  markRunSuccess,
  saveCursors,
  updateRunStage,
} from "@/services/linx/sync-repository";
import {
  LinxAuthError,
  LinxContractError,
  LinxDeadlineError,
  LinxError,
} from "@/services/linx/errors";

const now = new Date("2026-07-29T12:00:00.000Z");
const input = {
  organizationId: "org-1",
  requestedById: "user-1",
  trigger: "MANUAL" as const,
  now,
  leaseExpiresAt: new Date("2026-07-29T12:05:00.000Z"),
};

beforeEach(() => {
  prismaMock.$queryRaw.mockReset().mockResolvedValue([]);
  prismaMock.$transaction
    .mockReset()
    .mockImplementation(
      async (callback: (tx: typeof prismaMock) => Promise<unknown>) =>
        callback(prismaMock),
    );
  prismaMock.organization.findUnique.mockReset().mockResolvedValue({
    linxSyncEnabled: true,
    linxCnpj: "11222333000144",
  });
  prismaMock.linxSyncRun.create.mockReset();
  prismaMock.linxSyncRun.findFirst.mockReset();
  prismaMock.linxSyncRun.update.mockReset();
  prismaMock.linxSyncRun.updateMany.mockReset().mockResolvedValue({ count: 0 });
  prismaMock.linxSyncCursor.findMany.mockReset();
});

describe("sync lease", () => {
  it("rejects a second active run", async () => {
    prismaMock.linxSyncRun.findFirst.mockResolvedValue({
      id: "run-1",
      leaseExpiresAt: new Date("2026-07-29T12:01:00.000Z"),
    });

    await expect(acquireSyncRun(input)).rejects.toThrow(LinxConcurrentRunError);
    expect(prismaMock.linxSyncRun.create).not.toHaveBeenCalled();
  });

  it("marks an expired run failed before acquiring a new run", async () => {
    prismaMock.linxSyncRun.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.linxSyncRun.findFirst.mockResolvedValue(null);
    prismaMock.linxSyncRun.create.mockResolvedValue({ id: "run-new" });

    await expect(acquireSyncRun(input)).resolves.toEqual({ id: "run-new" });

    expect(prismaMock.linxSyncRun.updateMany).toHaveBeenCalledWith({
      where: {
        status: "RUNNING",
        OR: [
          { leaseExpiresAt: null },
          { leaseExpiresAt: { lte: now } },
        ],
      },
      data: {
        status: "FAILED",
        failureStage: "LEASE_EXPIRED",
        finishedAt: now,
        leaseExpiresAt: null,
        errorMessage: "Execução encerrada: lease expirado",
      },
    });
    expect(prismaMock.linxSyncRun.create).toHaveBeenCalledWith({
      data: {
        organizationId: "org-1",
        requestedById: "user-1",
        trigger: "MANUAL",
        mode: "INCREMENTAL",
        status: "RUNNING",
        stage: "ACQUIRED",
        leaseExpiresAt: input.leaseExpiresAt,
        reconciliationAuthorizationHash: undefined,
      },
    });
  });

  it("maps a unique-constraint race to a concurrent-run error", async () => {
    prismaMock.linxSyncRun.findFirst.mockResolvedValue(null);
    prismaMock.linxSyncRun.create.mockRejectedValue({
      code: "P2002",
      meta: { target: ["LinxSyncRun_one_running_per_org"] },
    });

    await expect(acquireSyncRun(input)).rejects.toThrow(LinxConcurrentRunError);
  });

  it("does not hide an unrelated unique-constraint error", async () => {
    const uniqueError = { code: "P2002", meta: { target: ["id"] } };
    prismaMock.linxSyncRun.findFirst.mockResolvedValue(null);
    prismaMock.linxSyncRun.create.mockRejectedValue(uniqueError);

    await expect(acquireSyncRun(input)).rejects.toBe(uniqueError);
  });

  it("rejects reuse of a consumed reconciliation preview hash", async () => {
    prismaMock.linxSyncRun.findFirst.mockResolvedValue(null);
    prismaMock.linxSyncRun.create.mockRejectedValue({
      code: "P2002",
      meta: { target: ["reconciliationAuthorizationHash"] },
    });
    await expect(
      acquireSyncRun({
        ...input,
        mode: "RECONCILIATION",
        reconciliationAuthorizationHash: "consumed-hash",
      }),
    ).rejects.toBeInstanceOf(
      LinxReconciliationAuthorizationUsedError,
    );
  });
});

describe("sync cursors", () => {
  it("requires a persisted cursor for every Linx method before reporting a baseline", async () => {
    prismaMock.linxSyncCursor.findMany.mockResolvedValueOnce([
      { method: "MOVIMENTO" },
      { method: "MOVIMENTO_PLANOS" },
      { method: "MOVIMENTO_PRINCIPAL" },
      { method: "ROTINA_ORIGEM" },
    ]);

    await expect(hasCursorBaseline("org-1")).resolves.toBe(false);

    prismaMock.linxSyncCursor.findMany.mockResolvedValueOnce([
      { method: "MOVIMENTO" },
      { method: "MOVIMENTO_PLANOS" },
      { method: "MOVIMENTO_PRINCIPAL" },
      { method: "ROTINA_ORIGEM" },
      { method: "RESPOSTA_VENDA" },
    ]);

    await expect(hasCursorBaseline("org-1")).resolves.toBe(true);
  });

  it("returns zero for methods without a persisted cursor", async () => {
    prismaMock.linxSyncCursor.findMany.mockResolvedValue([
      { method: "MOVIMENTO", lastTimestamp: BigInt(42) },
    ]);

    await expect(getCursors("org-1")).resolves.toEqual({
      MOVIMENTO: BigInt(42),
      MOVIMENTO_PLANOS: BigInt(0),
      MOVIMENTO_PRINCIPAL: BigInt(0),
      ROTINA_ORIGEM: BigInt(0),
      RESPOSTA_VENDA: BigInt(0),
    });
  });

  it("writes monotonic cursor SQL through the supplied transaction in stable method order", async () => {
    const tx = { $executeRaw: vi.fn().mockResolvedValue(1) };

    await saveCursors(tx as never, "org-1", {
      RESPOSTA_VENDA: BigInt(9),
      MOVIMENTO: BigInt(3),
    });

    expect(tx.$executeRaw).toHaveBeenCalledTimes(2);
    const first = tx.$executeRaw.mock.calls[0]?.[0];
    const second = tx.$executeRaw.mock.calls[1]?.[0];
    expect(first.strings.join("")).toContain("GREATEST");
    expect(first.values).toEqual([
      expect.any(String),
      "org-1",
      "MOVIMENTO",
      BigInt(3),
    ]);
    expect(second.values).toEqual([
      expect.any(String),
      "org-1",
      "RESPOSTA_VENDA",
      BigInt(9),
    ]);
  });
});

describe("sync run finalization", () => {
  async function expectCredentialToBeRemoved(message: string, secret: string) {
    prismaMock.linxSyncRun.update.mockResolvedValue({});

    await markRunFailed("run-1", message, now);

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data.errorMessage).toBe(
      "Não foi possível concluir a sincronização Linx.",
    );
    expect(data.errorMessage).not.toContain(secret);
  }

  it("finishes a successful run through the supplied transaction", async () => {
    const tx = { linxSyncRun: { update: vi.fn().mockResolvedValue({}) } };
    const finishedAt = new Date("2026-07-29T12:10:00.000Z");

    await markRunSuccess(tx as never, "run-1", { processedOrders: 4, processedItems: 7 }, finishedAt);

    expect(tx.linxSyncRun.update).toHaveBeenCalledWith({
      where: { id: "run-1" },
      data: {
        status: "SUCCESS",
        stage: "COMPLETED",
        processedOrders: 4,
        processedItems: 7,
        finishedAt,
        leaseExpiresAt: null,
        errorMessage: null,
      },
    });
  });

  it("records only a sanitized and bounded failure message", async () => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});
    const unsafe = `<Microvix><senha>super-secret</senha></Microvix> Authorization: Bearer secret ${"x".repeat(2_100)}`;

    await markRunFailed("run-1", unsafe, now);

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data).toMatchObject({ status: "FAILED", finishedAt: now, leaseExpiresAt: null });
    expect(data.errorMessage).not.toMatch(/Microvix|super-secret|Bearer|Authorization|<|>/i);
    expect(data.errorMessage.length).toBeLessThanOrEqual(2_000);
  });

  it("stores the public timeout message instead of a closed Prisma transaction", async () => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});
    const prismaFailure = new Error(
      "Invalid tx.customer.upsert() invocation in /home/app/.next/server/chunks/db.js: Transaction API error: Transaction not found",
    );

    await markRunFailed("run-1", prismaFailure, now);

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data.errorMessage).toBe(
      "A gravação excedeu o tempo disponível. Gere um novo preview e tente novamente.",
    );
    expect(data.errorMessage).not.toMatch(/tx\.|\/home|\.next|Prisma|Transaction API/i);
  });

  it("replaces local paths and other internal diagnostics with the public fallback", async () => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});

    await markRunFailed(
      "run-1",
      "Error: /home/app/.next/server/chunks/linx.js stack trace",
      now,
    );

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data.errorMessage).toBe(
      "Não foi possível concluir a sincronização Linx.",
    );
  });

  it("preserves a known safe Linx domain error", async () => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});

    await markRunFailed("run-1", new LinxAuthError(), now);

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data.errorMessage).toBe("Falha de autenticação na Linx");
  });

  it.each([
    [
      "a base LinxError",
      new LinxError(
        "LinxCustomError",
        "contract",
        false,
        "internal-detail-4e50b5a7-7d19-4f4c-9e2d-333e0a74416b",
      ),
    ],
    [
      "a LinxContractError with a custom message",
      new LinxContractError("internal-detail-3d0e0f9c-5651-4220-94ef-0872c1dbab40"),
    ],
    [
      "a LinxDeadlineError with a custom message",
      new LinxDeadlineError("internal-detail-4207f408-e004-4e23-8497-374708c98e4e"),
    ],
  ])("does not persist arbitrary text from %s", async (_kind, error) => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});

    await markRunFailed("run-1", error, now);

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data.errorMessage).toBe(
      "Não foi possível concluir a sincronização Linx.",
    );
  });

  it.each([
    [new LinxContractError(), "Resposta XML inválida da Linx"],
    [
      new LinxContractError("A paginação não avançou o timestamp"),
      "A paginação não avançou o timestamp",
    ],
    [new LinxDeadlineError(), "A execução Linx excedeu o prazo ou foi cancelada"],
  ])("preserves the explicitly public message from a domain error", async (error, message) => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});

    await markRunFailed("run-1", error, now);

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data.errorMessage).toBe(message);
  });

  it("does not persist arbitrary diagnostics that are not public domain errors", async () => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});

    await markRunFailed("run-1", "diagnóstico ".repeat(300), now);

    const data = prismaMock.linxSyncRun.update.mock.calls[0]?.[0].data;
    expect(data.errorMessage).toBe(
      "Não foi possível concluir a sincronização Linx.",
    );
  });

  it("does not persist a password separated by whitespace", async () => {
    await expectCredentialToBeRemoved("password supersecret", "supersecret");
  });

  it("does not persist a senha separated by whitespace", async () => {
    await expectCredentialToBeRemoved("senha valor-secreto", "valor-secreto");
  });

  it("does not persist a chave separated by whitespace", async () => {
    await expectCredentialToBeRemoved("chave valor-privado", "valor-privado");
  });

  it("does not persist an X-Api-Key header separated by whitespace", async () => {
    await expectCredentialToBeRemoved("X-Api-Key live-secret", "live-secret");
  });

  it("does not persist an Authorization header separated by whitespace", async () => {
    await expectCredentialToBeRemoved("Authorization token123", "token123");
  });

  it("does not persist a Bearer credential", async () => {
    await expectCredentialToBeRemoved("Bearer token123", "token123");
  });

  it("updates a stage outside the business transaction", async () => {
    prismaMock.linxSyncRun.update.mockResolvedValue({});

    await updateRunStage("run-1", "IMPORTING");

    expect(prismaMock.linxSyncRun.update).toHaveBeenCalledWith({
      where: { id: "run-1" },
      data: { stage: "IMPORTING" },
    });
  });
});
