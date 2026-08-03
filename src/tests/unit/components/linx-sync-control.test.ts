// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LinxSyncControl } from "@/components/linx-sync-control";

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
    createElement(QueryClientProvider, { client },
      createElement("div", null,
        createElement(LinxSyncControl, { variant: "desktop" }),
        createElement(LinxSyncControl, { variant: "mobile" }),
      ),
    ),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("LinxSyncControl", () => {
  it("deduplicates status and formats the last success in São Paulo", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      lastSuccessfulSyncAt: "2026-08-03T23:15:00.000Z",
    }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    renderControls();

    await waitFor(() => {
      const labels = screen.getAllByText(
        "Última sincronização: 03/08/2026 às 20:15",
      );
      expect(labels).toHaveLength(2);
      for (const label of labels) {
        expect(label.textContent).toBe(
          "Última sincronização:\n03/08/2026 às 20:15",
        );
      }
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/linx/status");
  });

  it("renders the never-synchronized state", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      lastSuccessfulSyncAt: null,
    }), { status: 200 })));
    renderControls();
    await waitFor(() => {
      expect(screen.getAllByText("Ainda não sincronizado")).toHaveLength(2);
    });
  });

  it("keeps retry available when status cannot be read", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(
      JSON.stringify({ error: "Status indisponível" }),
      { status: 500 },
    )));
    renderControls();
    await waitFor(() => {
      expect(screen.getAllByText(
        "Última sincronização indisponível",
      )).toHaveLength(2);
    });
    for (const button of screen.getAllByRole("button", {
      name: "Sincronizar Linx",
    })) {
      expect((button as HTMLButtonElement).disabled).toBe(false);
    }
  });

  it("shares mutation loading and updates both timestamps after success", async () => {
    let resolveSync!: (response: Response) => void;
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      if (String(input) === "/api/linx/status") {
        return Promise.resolve(new Response(JSON.stringify({
          lastSuccessfulSyncAt: null,
        }), { status: 200 }));
      }
      return new Promise<Response>((resolve) => { resolveSync = resolve; });
    });
    vi.stubGlobal("fetch", fetchMock);
    renderControls();

    const buttons = await screen.findAllByRole("button", {
      name: "Sincronizar Linx",
    });
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      const pendingButtons = screen.getAllByRole("button", {
        name: "Sincronizar Linx",
      });
      expect(pendingButtons).toHaveLength(2);
      for (const button of pendingButtons) {
        expect((button as HTMLButtonElement).disabled).toBe(true);
      }
    });

    resolveSync(new Response(JSON.stringify({
      summary: {
        ordersProcessed: 2,
        itemsCreated: 3,
        itemsUpdated: 1,
        itemsRemoved: 0,
      },
      lastSuccessfulSyncAt: "2026-08-03T23:15:00.000Z",
    }), { status: 200 }));

    await waitFor(() => {
      expect(screen.getAllByText(
        "Última sincronização: 03/08/2026 às 20:15",
      )).toHaveLength(2);
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalled();
    });
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/linx/sync",
      { method: "POST" },
    );
  });

  it("keeps the old timestamp when another run is active", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => Promise.resolve(
      String(input) === "/api/linx/status"
        ? new Response(JSON.stringify({
            lastSuccessfulSyncAt: "2026-08-03T22:00:00.000Z",
          }), { status: 200 })
        : new Response(JSON.stringify({
            error: "Já existe uma sincronização Linx em andamento",
          }), { status: 409 }),
    ));
    vi.stubGlobal("fetch", fetchMock);
    renderControls();

    const buttons = await screen.findAllByRole("button", {
      name: "Sincronizar Linx",
    });
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith(
        "Já existe uma sincronização Linx em andamento",
      );
    });
    expect(screen.getAllByText(
      "Última sincronização: 03/08/2026 às 19:00",
    )).toHaveLength(2);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("restores the button after a server failure", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => Promise.resolve(
      String(input) === "/api/linx/status"
        ? new Response(JSON.stringify({ lastSuccessfulSyncAt: null }), {
            status: 200,
          })
        : new Response(JSON.stringify({
            error: "Não foi possível concluir a sincronização Linx.",
          }), { status: 500 }),
    ));
    vi.stubGlobal("fetch", fetchMock);
    renderControls();

    const buttons = await screen.findAllByRole("button", {
      name: "Sincronizar Linx",
    });
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível concluir a sincronização Linx.",
      );
      expect(screen.getAllByRole("button", {
        name: "Sincronizar Linx",
      })).toHaveLength(2);
    });
    expect(screen.getAllByText("Ainda não sincronizado")).toHaveLength(2);
    expect(refresh).not.toHaveBeenCalled();
  });
});
