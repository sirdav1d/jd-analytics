import {
  LinxAuthError,
  LinxContractError,
  LinxDataError,
  LinxDeadlineError,
  LinxError,
  LinxPermissionError,
  LinxTransientError,
} from "./errors";
import type {
  LinxClientConfig,
  LinxClientDependencies,
  LinxCommand,
  LinxResponse,
} from "./types";
import { buildLinxRequest, parseLinxResponse } from "./xml";

export const LINX_PRODUCTION_URL = "https://webapi.microvix.com.br/1.0/api/integracao";

const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_MAX_RESPONSE_BYTES = 5 * 1024 * 1024;
const MAX_RETRIES = 2;

const defaultSleep = (milliseconds: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("aborted", "AbortError"));
      },
      { once: true },
    );
  });

function retryAfterMilliseconds(value: string | null, now: number): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1_000, 30_000);
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.min(Math.max(0, date - now), 30_000);
}

async function readBoundedText(response: Response, maxBytes: number): Promise<string> {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new LinxDataError();
  }

  if (!response.body) {
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) throw new LinxDataError();
    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new LinxDataError();
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

function errorForStatus(status: number): LinxError {
  if (status === 401) return new LinxAuthError();
  if (status === 403) return new LinxPermissionError();
  if (status === 429 || status >= 500) return new LinxTransientError();
  return new LinxContractError();
}

function createRequestSignal(
  timeoutMs: number,
  deadlineMs: number | undefined,
  now: number,
  callerSignal: AbortSignal | undefined,
) {
  const remaining = deadlineMs === undefined ? timeoutMs : Math.min(timeoutMs, deadlineMs - now);
  if (remaining <= 0 || callerSignal?.aborted) throw new LinxDeadlineError();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), remaining);
  const signal = callerSignal
    ? AbortSignal.any([callerSignal, controller.signal])
    : controller.signal;

  return { signal, clear: () => clearTimeout(timer) };
}

function createRetrySignal(
  deadlineMs: number | undefined,
  now: number,
  callerSignal: AbortSignal | undefined,
) {
  if (callerSignal?.aborted) throw new LinxDeadlineError();
  const remaining = deadlineMs === undefined ? Number.POSITIVE_INFINITY : deadlineMs - now;
  if (remaining <= 0) throw new LinxDeadlineError();

  const controller = new AbortController();
  const timer = Number.isFinite(remaining)
    ? setTimeout(() => controller.abort(), remaining)
    : undefined;
  const signal = callerSignal
    ? AbortSignal.any([callerSignal, controller.signal])
    : controller.signal;

  return {
    remaining,
    signal,
    clear: () => {
      if (timer !== undefined) clearTimeout(timer);
    },
  };
}

async function waitForRetry(
  milliseconds: number,
  dependencies: LinxClientDependencies,
  deadlineMs: number | undefined,
  callerSignal: AbortSignal | undefined,
) {
  const retry = createRetrySignal(deadlineMs, dependencies.now(), callerSignal);
  const delay = Math.min(Math.max(0, milliseconds), retry.remaining);
  let removeAbortListener: () => void = () => undefined;
  const aborted = new Promise<never>((_resolve, reject) => {
    const onAbort = () => reject(new LinxDeadlineError());
    retry.signal.addEventListener("abort", onAbort, { once: true });
    removeAbortListener = () => retry.signal.removeEventListener("abort", onAbort);
  });

  try {
    await Promise.race([dependencies.sleep!(delay, retry.signal), aborted]);
    if (retry.signal.aborted || (deadlineMs !== undefined && dependencies.now() >= deadlineMs)) {
      throw new LinxDeadlineError();
    }
  } finally {
    removeAbortListener();
    retry.clear();
  }
}

export function createLinxClient(config: LinxClientConfig, dependencies: LinxClientDependencies) {
  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxResponseBytes = config.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
  const sleep = dependencies.sleep ?? defaultSleep;
  const wallClock = dependencies.wallClock ?? Date.now;
  const backoffMs = dependencies.backoffMs ?? ((retry, retryAfter) => retryAfter ?? 250 * 2 ** (retry - 1));
  const retryDependencies = { ...dependencies, sleep };

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || !Number.isFinite(maxResponseBytes) || maxResponseBytes <= 0) {
    throw new LinxDataError();
  }
  if (config.deadlineMs !== undefined && !Number.isFinite(config.deadlineMs)) {
    throw new LinxDataError();
  }

  return {
    async execute(command: LinxCommand, callerSignal?: AbortSignal): Promise<LinxResponse> {
      const body = buildLinxRequest({
        user: config.user,
        password: config.password,
        command: command.name,
        parameters: { ...command.parameters, [command.keyParameter]: config.key },
      });

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
        let retryAfter: number | undefined;
        let requestWasAborted = false;
        try {
          const request = createRequestSignal(
            timeoutMs,
            config.deadlineMs,
            dependencies.now(),
            callerSignal,
          );
          try {
            const response = await dependencies.fetch(LINX_PRODUCTION_URL, {
              method: "POST",
              headers: { "content-type": "application/xml; charset=utf-8" },
              body,
              signal: request.signal,
            });
            if (!response.ok) {
              retryAfter = retryAfterMilliseconds(response.headers.get("retry-after"), wallClock());
              throw errorForStatus(response.status);
            }
            return parseLinxResponse(await readBoundedText(response, maxResponseBytes));
          } finally {
            requestWasAborted = request.signal.aborted;
            request.clear();
          }
        } catch (error) {
          const normalized =
            error instanceof LinxError
              ? error
              : requestWasAborted || callerSignal?.aborted
                ? new LinxDeadlineError()
                : new LinxTransientError();

          if (!normalized.retryable || attempt === MAX_RETRIES) {
            dependencies.logger.error("Linx request failed", {
              category: normalized.category,
              retryable: normalized.retryable,
            });
            throw normalized;
          }

          const delay = backoffMs(attempt + 1, retryAfter);
          await waitForRetry(delay, retryDependencies, config.deadlineMs, callerSignal);
        }
      }

      throw new LinxTransientError();
    },
  };
}
