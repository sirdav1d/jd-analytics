export type LinxParameterValue = string | number | bigint | boolean | null;

export type LinxRequest = {
  user: string;
  password: string;
  command: string;
  parameters: Record<string, LinxParameterValue>;
};

export type LinxResponseRow = Record<string, string | null>;

export type LinxResponse = {
  columns: string[];
  rows: LinxResponseRow[];
};

export type LinxCommand = {
  name: string;
  keyParameter: "chave" | "Chave";
  parameters: Record<string, LinxParameterValue>;
};

export type LinxClientConfig = {
  user: string;
  password: string;
  key: string;
  /** Per-request timeout in milliseconds. */
  timeoutMs?: number;
  /** Absolute monotonic-clock deadline in milliseconds. */
  deadlineMs?: number;
  /** Maximum accepted HTTP response size in bytes. */
  maxResponseBytes?: number;
};

export type LinxLogger = {
  error: (message: string, metadata?: Record<string, string | number | boolean>) => void;
};

export type LinxClientDependencies = {
  fetch: typeof globalThis.fetch;
  now: () => number;
  /** Wall-clock Unix time in milliseconds, used only for HTTP-date headers. */
  wallClock?: () => number;
  logger: LinxLogger;
  sleep?: (milliseconds: number, signal: AbortSignal) => Promise<void>;
  backoffMs?: (retry: number, retryAfterMs?: number) => number;
};
