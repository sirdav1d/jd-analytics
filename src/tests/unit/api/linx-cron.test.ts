import { beforeEach, describe, expect, it, vi } from "vitest";
import vercelConfig from "../../../../vercel.json";
import { LinxInitialReconciliationRequiredError } from "@/services/linx/sync-repository";

const mocks = vi.hoisted(() => ({
  organizationFindMany: vi.fn(),
  runLinxSync: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    organization: {
      findMany: mocks.organizationFindMany,
    },
  },
}));

vi.mock("@/services/linx/sync", () => ({
  runLinxSync: mocks.runLinxSync,
}));

import { GET, maxDuration } from "@/app/api/cron/linx/route";

const enabledOrganization = { id: "linx-org-id" };

function makeCronRequest(secret?: string) {
  return new Request("http://localhost/api/cron/linx", {
    headers: secret ? { authorization: `Bearer ${secret}` } : undefined,
  });
}

beforeEach(() => {
  mocks.organizationFindMany.mockResolvedValue([enabledOrganization]);
  mocks.runLinxSync.mockResolvedValue({
    ordersProcessed: 2,
    itemsCreated: 3,
    itemsUpdated: 1,
    itemsRemoved: 0,
  });
});

describe("Linx cron", () => {
  it.each([
    ["a missing secret", undefined, undefined],
    ["an invalid secret", "test-secret", "wrong-secret"],
  ])("rejects %s before querying Prisma", async (_case, configured, actual) => {
    if (configured === undefined) {
      vi.stubEnv("CRON_SECRET", "");
    } else {
      vi.stubEnv("CRON_SECRET", configured);
    }

    const response = await GET(makeCronRequest(actual));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Não autorizado" });
    expect(mocks.organizationFindMany).not.toHaveBeenCalled();
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("starts an incremental cron sync for its single enabled organization", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");
    vi.spyOn(Date, "now").mockReturnValue(1_785_304_800_000);

    const response = await GET(makeCronRequest("test-secret"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ordersProcessed: 2,
      itemsCreated: 3,
      itemsUpdated: 1,
      itemsRemoved: 0,
    });
    expect(mocks.organizationFindMany).toHaveBeenCalledWith({
      where: { linxSyncEnabled: true },
      select: { id: true },
    });
    expect(mocks.runLinxSync).toHaveBeenCalledWith({
      organizationId: "linx-org-id",
      mode: "INCREMENTAL",
      trigger: "CRON",
      deadlineAt: 1_785_304_848_000,
      transactionTimeoutMs: 15_000,
    });
  });

  it("does not sync when no Linx organization is enabled", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");
    mocks.organizationFindMany.mockResolvedValueOnce([]);

    const response = await GET(makeCronRequest("test-secret"));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Nenhuma loja Linx ativa",
    });
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("does not choose an arbitrary organization when more than one is enabled", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");
    mocks.organizationFindMany.mockResolvedValueOnce([
      enabledOrganization,
      { id: "another-linx-org-id" },
    ]);

    const response = await GET(makeCronRequest("test-secret"));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Configuração Linx inválida",
    });
    expect(mocks.runLinxSync).not.toHaveBeenCalled();
  });

  it("returns a safe server error when synchronization fails", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");
    mocks.runLinxSync.mockRejectedValueOnce(
      new Error("Bearer test-secret must not reach the response"),
    );

    const response = await GET(makeCronRequest("test-secret"));
    const responseText = await response.clone().text();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Não foi possível concluir a sincronização Linx.",
    });
    expect(responseText).not.toContain("test-secret");
  });

  it("maps a missing baseline to its safe reconciliation response", async () => {
    vi.stubEnv("CRON_SECRET", "test-secret");
    mocks.runLinxSync.mockRejectedValueOnce(
      new LinxInitialReconciliationRequiredError(),
    );

    const response = await GET(makeCronRequest("test-secret"));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: "Faça a conciliação inicial antes da sincronização incremental.",
    });
  });

  it("schedules the Linx cron at 20:00 UTC", () => {
    expect(vercelConfig.crons).toEqual([
      { path: "/api/cron/linx", schedule: "0 20 * * *" },
    ]);
    expect(maxDuration).toBe(60);
  });
});
