// @vitest-environment jsdom

import { createElement } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LinxSyncPanel } from "@/app/dashboard/upload/_components/linx-sync-panel";

const organizationId = "4c5e8d3c-64a2-4c42-b657-58ed175896e7";
const baselineCursors = [
  "MOVIMENTO",
  "MOVIMENTO_PLANOS",
  "MOVIMENTO_PRINCIPAL",
  "ROTINA_ORIGEM",
  "RESPOSTA_VENDA",
].map((method) => ({
  method,
  lastTimestamp: "0",
  updatedAt: "2026-07-29T12:00:00.000Z",
}));

function statusResponse(
  run:
    | {
        id: string;
        organizationId: string;
        trigger: string;
        status: "RUNNING" | "SUCCESS" | "FAILED";
        stage: string | null;
        processedOrders: number;
        processedItems: number;
        errorMessage: string | null;
        startedAt: string;
        finishedAt: string | null;
      }
    | null,
  cursors = baselineCursors,
) {
  return {
    organizations: [
      {
        id: organizationId,
        name: "Loja Centro",
        linxCnpj: "11222333000144",
        linxPortalId: 7,
        linxCompanyId: 9,
        linxSyncEnabled: true,
      },
    ],
    activeOrganizationId: organizationId,
    run,
    cursors,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("LinxSyncPanel", () => {
  it("labels the preview budget as a reading limit", async () => {
    const preview = {
      period: { from: "2026-06-30", to: "2026-07-29" },
      linx: { orders: 42, items: 79, grossValue: 0 },
      database: { orders: 0, items: 0, grossValue: 0 },
      differences: {
        missingInDatabase: 42,
        changedOrders: 0,
        databaseOnly: 0,
      },
      estimatedDurationMs: 1,
      fitsRuntimeBudget: true,
      authorizationToken: "preview-token",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async (request: RequestInfo | URL) => {
        const path = String(request);
        if (path.endsWith("/api/admin/linx/status")) {
          return jsonResponse(statusResponse(null));
        }
        if (path.endsWith("/api/admin/linx/reconciliation/preview")) {
          return jsonResponse(preview);
        }
        throw new Error(`Unexpected fetch: ${path}`);
      }),
    );

    render(createElement(LinxSyncPanel));

    const previewButton = screen.getByRole("button", {
      name: "Gerar preview",
    }) as HTMLButtonElement;
    await waitFor(() => expect(previewButton.disabled).toBe(false));
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(screen.getByText("Leitura dentro do limite")).toBeTruthy();
    });
    expect(screen.queryByText("Dentro do limite")).toBeNull();
  });

  it("requires a complete baseline before enabling incremental sync or retry", async () => {
    const failedRun = {
      id: "failed-run",
      organizationId,
      trigger: "MANUAL",
      status: "FAILED" as const,
      stage: "MOVIMENTO",
      processedOrders: 0,
      processedItems: 0,
      errorMessage: "Falha anterior",
      startedAt: "2026-07-29T10:00:00.000Z",
      finishedAt: "2026-07-29T10:00:05.000Z",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse(statusResponse(failedRun, []))),
    );

    render(createElement(LinxSyncPanel));

    const syncWithoutBaseline = screen.getByRole("button", {
      name: "Sincronizar agora",
    }) as HTMLButtonElement;
    const retryWithoutBaseline = screen.getByRole("button", {
      name: "Tentar novamente",
    }) as HTMLButtonElement;
    await waitFor(() => {
      expect(screen.getByText("Última execução falhou")).toBeTruthy();
      expect(syncWithoutBaseline.disabled).toBe(true);
      expect(retryWithoutBaseline.disabled).toBe(true);
    });
    expect(
      screen.getByText(
        "Gere o preview e confirme a conciliação inicial antes de sincronizar incrementalmente.",
      ),
    ).toBeTruthy();

    cleanup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse(statusResponse(failedRun))),
    );
    render(createElement(LinxSyncPanel));

    const syncWithBaseline = screen.getByRole("button", {
      name: "Sincronizar agora",
    }) as HTMLButtonElement;
    const retryWithBaseline = screen.getByRole("button", {
      name: "Tentar novamente",
    }) as HTMLButtonElement;
    await waitFor(() => {
      expect(syncWithBaseline.disabled).toBe(false);
      expect(retryWithBaseline.disabled).toBe(false);
    });
  });

  it("preserves a local FAILED state and enables RETRY when sync fails before a new run exists", async () => {
    const oldSuccess = statusResponse({
      id: "old-success",
      organizationId,
      trigger: "MANUAL",
      status: "SUCCESS",
      stage: "COMPLETED",
      processedOrders: 9,
      processedItems: 12,
      errorMessage: null,
      startedAt: "2026-07-29T10:00:00.000Z",
      finishedAt: "2026-07-29T10:00:05.000Z",
    });
    const syncBodies: Array<Record<string, unknown>> = [];
    let syncAttempts = 0;
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const path = String(input);
        if (path.endsWith("/api/admin/linx/status")) {
          return jsonResponse(oldSuccess);
        }
        if (path.endsWith("/api/admin/linx/sync")) {
          syncAttempts += 1;
          syncBodies.push(JSON.parse(String(init?.body)));
          return syncAttempts === 1
            ? new Response("gateway returned non-json", { status: 500 })
            : jsonResponse({
                ordersProcessed: 1,
                itemsCreated: 1,
                itemsUpdated: 0,
                itemsRemoved: 0,
              });
        }
        throw new Error(`Unexpected fetch: ${path}`);
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(LinxSyncPanel));

    const syncButton = screen.getByRole("button", {
      name: "Sincronizar agora",
    }) as HTMLButtonElement;
    await waitFor(() => expect(syncButton.disabled).toBe(false));
    fireEvent.click(syncButton);

    const retryButton = screen.getByRole("button", {
      name: "Tentar novamente",
    }) as HTMLButtonElement;
    await waitFor(() => {
      expect(
        screen.getByText("Última execução falhou"),
      ).toBeTruthy();
      expect(screen.getAllByText("Falha na integração Linx.").length).toBeGreaterThan(0);
      expect(retryButton.disabled).toBe(false);
    });

    fireEvent.click(retryButton);
    await waitFor(() => expect(syncBodies).toHaveLength(2));
    expect(syncBodies[1]).toMatchObject({
      organizationId,
      mode: "INCREMENTAL",
      trigger: "RETRY",
    });
  });

  it("polls after a 409 and exposes retry when status reconciles the lease to FAILED", async () => {
    vi.useFakeTimers();
    let statusCalls = 0;
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL) => {
        const path = String(input);
        if (path.endsWith("/api/admin/linx/status")) {
          statusCalls += 1;
          return jsonResponse(
            statusCalls === 1
              ? statusResponse(null)
              : statusResponse({
                  id: "expired-run",
                  organizationId,
                  trigger: "MANUAL",
                  status: "FAILED",
                  stage: "FAILED",
                  processedOrders: 0,
                  processedItems: 0,
                  errorMessage: "Execução encerrada: lease expirado",
                  startedAt: "2026-07-29T10:00:00.000Z",
                  finishedAt: "2026-07-29T10:00:48.000Z",
                }),
          );
        }
        if (path.endsWith("/api/admin/linx/sync")) {
          return jsonResponse(
            {
              error: "Já existe uma sincronização Linx em andamento",
              run: {
                id: "expired-run",
                organizationId,
                status: "RUNNING",
                stage: "MOVIMENTO",
                startedAt: "2026-07-29T10:00:00.000Z",
              },
            },
            409,
          );
        }
        throw new Error(`Unexpected fetch: ${path}`);
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(LinxSyncPanel));
    await act(async () => {
      await Promise.resolve();
    });
    const syncButton = screen.getByRole("button", {
      name: "Sincronizar agora",
    }) as HTMLButtonElement;
    expect(syncButton.disabled).toBe(false);

    fireEvent.click(syncButton);
    await act(async () => {
      await Promise.resolve();
    });
    expect(syncButton.disabled).toBe(true);
    expect(screen.getByText("Sincronização em andamento")).toBeTruthy();
    expect(
      screen
        .getAllByRole("button")
        .every((button) => (button as HTMLButtonElement).disabled),
    ).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3_000);
    });

    const retryButton = screen.getByRole("button", {
      name: "Tentar novamente",
    }) as HTMLButtonElement;
    expect(screen.getByText("Última execução falhou")).toBeTruthy();
    expect(retryButton.disabled).toBe(false);
  });
});
