// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataSyncControl } from "@/components/data-sync-control";

const refresh = vi.hoisted(() => vi.fn());
const toast = vi.hoisted(() => ({
  success: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("sonner", () => ({ toast }));

function renderControls() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    createElement(
      QueryClientProvider,
      { client },
      createElement(
        "div",
        null,
        createElement(DataSyncControl, { variant: "desktop" }),
        createElement(DataSyncControl, { variant: "mobile" }),
      ),
    ),
  );
}

function successPayload() {
  return {
    cutoffDate: "2026-08-16",
    lastSuccessfulSyncAt: "2026-08-16T22:00:08.000Z",
    sources: {
      LINX: {
        status: "SUCCESS",
        durationMs: 8000,
        summary: {
          ordersProcessed: 2,
          itemsCreated: 3,
          itemsUpdated: 1,
          itemsRemoved: 0,
        },
      },
      META: { status: "SUCCESS", durationMs: 100, amount: "123.45" },
      GOOGLE_PRODUCTS: {
        status: "SUCCESS",
        durationMs: 200,
        amount: "456.780000",
      },
      GOOGLE_SERVICES: {
        status: "SUCCESS",
        durationMs: 300,
        amount: "9.100000",
      },
    },
  };
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("DataSyncControl", () => {
  it("deduplicates status and shows Linx and Meta timestamps separately", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      running: false,
      lastLinxSuccessfulSyncAt: "2026-08-16T21:59:58.000Z",
      lastMetaSyncAt: "2026-08-16T22:00:08.000Z",
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    renderControls();

    await waitFor(() => {
      expect(screen.getAllByText(
        "Último Linx: 16/08/2026 às 18:59",
      )).toHaveLength(2);
      expect(screen.getAllByText(
        "Último Meta: 16/08/2026 às 19:00",
      )).toHaveLength(2);
    });
    expect(screen.getAllByRole("button", {
      name: "Sincronizar dados",
    })).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/sync/status");
  });

  it("renders the never-synchronized state", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      running: false,
      lastLinxSuccessfulSyncAt: null,
      lastMetaSyncAt: null,
    }), { status: 200 })));

    renderControls();

    await waitFor(() => {
      expect(screen.getAllByText("Linx ainda não sincronizado")).toHaveLength(2);
      expect(screen.getAllByText("Meta ainda não sincronizado")).toHaveLength(2);
    });
  });

  it("keeps manual retry available when status cannot be read", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(
      JSON.stringify({ error: "Status indisponível" }),
      { status: 500 },
    )));

    renderControls();

    await waitFor(() => {
      expect(screen.getAllByText(
        "Status da sincronização indisponível",
      )).toHaveLength(2);
    });
    for (const button of screen.getAllByRole("button", {
      name: "Sincronizar dados",
    })) {
      expect((button as HTMLButtonElement).disabled).toBe(false);
    }
  });

  it("disables both controls while the server reports a running sync", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      running: true,
      lastLinxSuccessfulSyncAt: null,
      lastMetaSyncAt: null,
    }), { status: 200 })));

    renderControls();

    await waitFor(() => {
      for (const button of screen.getAllByRole("button", {
        name: "Sincronizar dados",
      })) {
        expect((button as HTMLButtonElement).disabled).toBe(true);
      }
    });
  });

  it("shares loading and refreshes after complete success", async () => {
    let resolveSync!: (response: Response) => void;
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      if (String(input) === "/api/sync/status") {
        return Promise.resolve(new Response(JSON.stringify({
          running: false,
          lastLinxSuccessfulSyncAt: null,
          lastMetaSyncAt: null,
        }), { status: 200 }));
      }
      return new Promise<Response>((resolve) => {
        resolveSync = resolve;
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    renderControls();

    const buttons = await screen.findAllByRole("button", {
      name: "Sincronizar dados",
    });
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      for (const button of screen.getAllByRole("button", {
        name: "Sincronizar dados",
      })) {
        expect((button as HTMLButtonElement).disabled).toBe(true);
      }
    });

    resolveSync(new Response(JSON.stringify(successPayload()), { status: 200 }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Dados atualizados até 16/08/2026: Linx, Meta e duas contas Google.",
      );
      expect(refresh).toHaveBeenCalledTimes(1);
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/sync", { method: "POST" });
  });

  it("keeps timestamps and shows information when another run is active", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => Promise.resolve(
      String(input) === "/api/sync/status"
        ? new Response(JSON.stringify({
            running: false,
            lastLinxSuccessfulSyncAt: "2026-08-16T21:59:58.000Z",
            lastMetaSyncAt: "2026-08-16T22:00:08.000Z",
          }), { status: 200 })
        : new Response(JSON.stringify({
            error: "Já existe uma sincronização Linx em andamento",
          }), { status: 409 }),
    ));
    vi.stubGlobal("fetch", fetchMock);
    renderControls();

    fireEvent.click((await screen.findAllByRole("button", {
      name: "Sincronizar dados",
    }))[0]);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        "Já existe uma sincronização Linx em andamento",
      );
    });
    expect(refresh).not.toHaveBeenCalled();
  });

  it("recovers both controls after a safe server failure", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => Promise.resolve(
      String(input) === "/api/sync/status"
        ? new Response(JSON.stringify({
            running: false,
            lastLinxSuccessfulSyncAt: null,
            lastMetaSyncAt: null,
          }), { status: 200 })
        : new Response(JSON.stringify({
            error: "Não foi possível concluir a sincronização de dados.",
          }), { status: 500 }),
    ));
    vi.stubGlobal("fetch", fetchMock);
    renderControls();

    fireEvent.click((await screen.findAllByRole("button", {
      name: "Sincronizar dados",
    }))[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível concluir a sincronização de dados.",
      );
      expect(screen.getAllByRole("button", {
        name: "Sincronizar dados",
      })).toHaveLength(2);
    });
    expect(refresh).not.toHaveBeenCalled();
  });
});
