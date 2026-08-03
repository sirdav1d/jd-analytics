import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  LINX_PRODUCTION_URL,
  createLinxClient,
} from "@/services/linx/client";
import { LinxAuthError, LinxDeadlineError } from "@/services/linx/errors";
import type { LinxClientConfig, LinxCommand } from "@/services/linx/types";

const successXml = readFileSync("src/tests/fixtures/linx/success.xml", "utf8");
const config: LinxClientConfig = {
  user: "linx_export",
  password: "senha-de-teste",
  key: "chave-secreta-de-teste",
  timeoutMs: 1_000,
  deadlineMs: 5_000,
};
const command: LinxCommand = {
  name: "LinxMovimento",
  keyParameter: "chave",
  parameters: { timestamp: BigInt(0) },
};

describe("Linx client", () => {
  it("posts only to the fixed production endpoint and retries a transient response", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(new Response(successXml, { status: 200 }));
    const sleep = vi.fn().mockResolvedValue(undefined);
    const logger = { error: vi.fn() };
    const client = createLinxClient(config, {
      fetch: fetch as typeof globalThis.fetch,
      now: () => 0,
      sleep,
      logger,
    });

    await expect(client.execute(command)).resolves.toMatchObject({
      rows: [expect.objectContaining({ documento: "000123" })],
    });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith(
      LINX_PRODUCTION_URL,
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/xml; charset=utf-8" },
      }),
    );
    expect(sleep).toHaveBeenCalledWith(250, expect.any(AbortSignal));
    expect(logger.error).not.toHaveBeenCalledWith(
      expect.stringContaining(config.key),
    );
  });

  it("does not retry authentication responses or log request material", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("forbidden", { status: 401 }));
    const logger = { error: vi.fn() };
    const client = createLinxClient(config, {
      fetch: fetch as typeof globalThis.fetch,
      now: () => 0,
      logger,
    });

    await expect(client.execute(command)).rejects.toBeInstanceOf(LinxAuthError);
    expect(fetch).toHaveBeenCalledOnce();
    expect(JSON.stringify(logger.error.mock.calls)).not.toContain(config.key);
    expect(JSON.stringify(logger.error.mock.calls)).not.toContain("forbidden");
  });

  it("cancels a pending retry delay as soon as the caller aborts", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("", { status: 503 }));
    const sleep = vi.fn(() => new Promise<void>(() => undefined));
    const controller = new AbortController();
    const client = createLinxClient(config, {
      fetch: fetch as typeof globalThis.fetch,
      now: () => 0,
      sleep,
      logger: { error: vi.fn() },
    });

    let rejection: unknown;
    const execution = client.execute(command, controller.signal);
    void execution.catch((error: unknown) => {
      rejection = error;
    });
    await Promise.resolve();
    await Promise.resolve();
    expect(sleep).toHaveBeenCalledOnce();

    controller.abort();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(rejection).toBeInstanceOf(LinxDeadlineError);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("stops a pending retry delay at the absolute deadline", async () => {
    vi.useFakeTimers();
    try {
      const fetch = vi.fn().mockResolvedValue(new Response("", { status: 503 }));
      const sleep = vi.fn(() => new Promise<void>(() => undefined));
      const client = createLinxClient({ ...config, deadlineMs: 10 }, {
        fetch: fetch as typeof globalThis.fetch,
        now: () => 0,
        sleep,
        logger: { error: vi.fn() },
      });

      let rejection: unknown;
      const execution = client.execute(command);
      void execution.catch((error: unknown) => {
        rejection = error;
      });
      await Promise.resolve();
      await Promise.resolve();
      expect(sleep).toHaveBeenCalledOnce();

      await vi.advanceTimersByTimeAsync(10);

      expect(rejection).toBeInstanceOf(LinxDeadlineError);
      expect(fetch).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it("uses the injected wall clock for an HTTP-date Retry-After value", async () => {
    const wallClock = 1_700_000_000_000;
    const retryAfter = new Date(wallClock + 12_000).toUTCString();
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 429, headers: { "retry-after": retryAfter } }))
      .mockResolvedValueOnce(new Response(successXml, { status: 200 }));
    const backoffMs = vi.fn(() => 0);
    const client = createLinxClient(config, {
      fetch: fetch as typeof globalThis.fetch,
      now: () => 0,
      wallClock: () => wallClock,
      backoffMs,
      sleep: vi.fn().mockResolvedValue(undefined),
      logger: { error: vi.fn() },
    });

    await client.execute(command);

    expect(backoffMs).toHaveBeenCalledWith(1, 12_000);
  });

  it("honors an already aborted caller signal without issuing a request", async () => {
    const fetch = vi.fn();
    const controller = new AbortController();
    controller.abort();
    const client = createLinxClient(config, {
      fetch: fetch as typeof globalThis.fetch,
      now: () => 0,
      logger: { error: vi.fn() },
    });

    await expect(client.execute(command, controller.signal)).rejects.toBeInstanceOf(
      LinxDeadlineError,
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("maps an in-flight timeout to a deadline error without retrying it", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
        }),
    );
    const client = createLinxClient({ ...config, timeoutMs: 10 }, {
      fetch: fetch as typeof globalThis.fetch,
      now: () => 0,
      logger: { error: vi.fn() },
    });

    const execution = client.execute(command);
    const rejection = expect(execution).rejects.toBeInstanceOf(LinxDeadlineError);
    await vi.advanceTimersByTimeAsync(10);

    await rejection;
    expect(fetch).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it("fails before a request when the configured deadline has elapsed", async () => {
    const fetch = vi.fn();
    const client = createLinxClient({ ...config, deadlineMs: 10 }, {
      fetch: fetch as typeof globalThis.fetch,
      now: () => 11,
      logger: { error: vi.fn() },
    });

    await expect(client.execute(command)).rejects.toBeInstanceOf(LinxDeadlineError);
    expect(fetch).not.toHaveBeenCalled();
  });
});
