# Coordinated Linx and Media Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run Linx, Meta, Google Products, and Google Services together for the current São Paulo month, update the existing `MetaInvestment` row only after four-source success, and refresh the dashboard and public report without adding database tables.

**Architecture:** A dependency-injected coordinator starts the existing incremental Linx sync and a three-account media batch in parallel. Linx keeps its current database lease and records; the coordinated call suppresses Linx's immediate cache refresh, updates the existing monthly Meta row only after all sources succeed, and then refreshes all consumers. Google values remain live in the report and are never persisted.

**Tech Stack:** Next.js 16 App Router, TypeScript 5, Prisma 6/PostgreSQL, Vitest 4, TanStack Query 5, `google-ads-api` 23, Meta Marketing API v25.0, Vercel Cron Jobs.

## Global Constraints

- Do not add tables, Prisma models, migrations, or dependencies.
- Work in the current repository directory; do not create a worktree.
- Automate only the current civil month in `America/Sao_Paulo`.
- Preserve every existing `MetaInvestment` and all manual Meta interfaces.
- Keep Google costs live in the report; never persist a Google aggregate.
- Preserve the Linx revenue attribution filter for origins containing Google or Meta.
- Update `MetaInvestment` only after Linx, Meta, Google Products, and Google Services all succeed.
- A failed source must not update `MetaInvestment` or run the coordinated cache refresh.
- Keep existing `/api/linx/*` user routes available.
- Schedule the unified cron as `0 22 * * *`.
- Never persist, return, or log tokens, raw provider responses, credential-bearing URLs, or raw external errors.
- Rotate the disclosed Meta token before production rollout.
- Do not mutate Vercel Production or deploy without explicit rollout authorization.

## File Map

New provider and collection modules:

- `src/services/meta-ads/config.ts`: validates server-only Meta environment.
- `src/services/meta-ads/client.ts`: reads and validates account-level Meta spend.
- `src/services/marketing-spend/types.ts`: shared media range/result contracts.
- `src/services/marketing-spend/google.ts`: reads exact Google account cost.
- `src/services/marketing-spend/collect.ts`: settles Meta and both Google reads.

New coordinated-sync modules:

- `src/services/data-sync/types.ts`: safe public source/result contracts.
- `src/services/data-sync/errors.ts`: safe complete-publication error.
- `src/services/data-sync/cache.ts`: unified cache boundary.
- `src/services/data-sync/run.ts`: dependency-injected coordinator.
- `src/services/data-sync/runtime.ts`: production Prisma/provider bindings.

New routes and component:

- `src/app/api/sync/route.ts`
- `src/app/api/sync/status/route.ts`
- `src/app/api/cron/sync/route.ts`
- `src/components/data-sync-control.tsx`

Existing files changed:

- `.env.example`
- `src/services/linx/sync.ts`
- `src/services/marketing-report/get-marketing-report-aggregate.ts`
- `src/app/api/linx/_operations.ts`
- `src/components/header-dashboard.tsx`
- `src/components/app-sidebar.tsx`
- `vercel.json`

---

### Task 1: Meta account spend client

**Files:**

- Create: `src/services/meta-ads/config.ts`
- Create: `src/services/meta-ads/client.ts`
- Modify: `src/services/marketing-spend/types.ts`
- Create: `src/tests/unit/meta-ads/client.test.ts`
- Modify: `.env.example`

**Interfaces:**

- Produces: `readMetaAdsConfig(): MetaAdsConfig`.
- Produces: `createMetaAdsClient(config, deps).readAccountSpend(range): Promise<AccountSpend>`.
- Produces: `normalizeMetaAdAccountId(value): string`.
- Produces for Task 2: `MarketingSpendRange` and `AccountSpend` in `src/services/marketing-spend/types.ts`.

- [ ] **Step 1: Write the failing Meta client tests**

Create `src/tests/unit/meta-ads/client.test.ts`. The production change each test catches is an incorrect account URL, cutoff, account metadata, spend validation, or secret-bearing error. Use a fake `fetch` that returns complete response shapes:

```ts
import { describe, expect, it, vi } from "vitest";
import {
  createMetaAdsClient,
  normalizeMetaAdAccountId,
} from "@/services/meta-ads/client";

const config = {
  accountId: "306488710441939",
  accessToken: "secret-token-that-must-never-leak",
  apiVersion: "v25.0" as const,
};

describe("Meta Ads account spend", () => {
  it.each(["306488710441939", "act_306488710441939"])(
    "normalizes %s",
    (value) => expect(normalizeMetaAdAccountId(value)).toBe("306488710441939"),
  );

  it("reads account-level BRL spend for the exact inclusive range", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({
        id: "act_306488710441939",
        currency: "BRL",
        timezone_name: "America/Sao_Paulo",
      }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        data: [{
          spend: "1234.56",
          date_start: "2026-08-01",
          date_stop: "2026-08-16",
        }],
      }), { status: 200 }));
    const client = createMetaAdsClient(config, { fetch: fetchMock as typeof fetch });

    await expect(client.readAccountSpend({
      startDate: "2026-08-01",
      endDate: "2026-08-16",
    })).resolves.toEqual({ amount: "1234.56", currency: "BRL" });

    const insightsUrl = new URL(String(fetchMock.mock.calls[1][0]));
    expect(insightsUrl.pathname).toBe(
      "/v25.0/act_306488710441939/insights",
    );
    expect(insightsUrl.searchParams.get("fields")).toBe(
      "spend,date_start,date_stop",
    );
    expect(insightsUrl.searchParams.get("level")).toBe("account");
    expect(JSON.parse(insightsUrl.searchParams.get("time_range")!)).toEqual({
      since: "2026-08-01",
      until: "2026-08-16",
    });
  });
});
```

Add independent cases for empty `data` returning `{ amount: "0", currency: "BRL" }`, non-BRL metadata, non-São-Paulo timezone, mismatched returned dates, multiple Insights rows, negative/malformed spend, invalid account IDs, and HTTP 500. The HTTP test must assert `String(error)` does not contain `secret-token`.

- [ ] **Step 2: Run RED**

Run:

```bash
npx vitest run src/tests/unit/meta-ads/client.test.ts
```

Expected: FAIL because `@/services/meta-ads/client` does not exist.

- [ ] **Step 3: Implement strict server configuration**

Create `src/services/meta-ads/config.ts`:

```ts
import "server-only";
import { z } from "zod";

const schema = z.object({
  META_AD_ACCOUNT_ID: z.string().regex(/^(?:act_)?\d+$/u),
  META_ACCESS_TOKEN: z.string().min(20),
});

export type MetaAdsConfig = {
  accountId: string;
  accessToken: string;
  apiVersion: "v25.0";
};

export function readMetaAdsConfig(): MetaAdsConfig {
  const env = schema.parse(process.env);
  return {
    accountId: env.META_AD_ACCOUNT_ID,
    accessToken: env.META_ACCESS_TOKEN,
    apiVersion: "v25.0",
  };
}
```

Create the initial `src/services/marketing-spend/types.ts`:

```ts
export type MarketingSpendRange = { startDate: string; endDate: string };
export type AccountSpend = { amount: string; currency: "BRL" };
```

- [ ] **Step 4: Implement metadata and Insights validation**

Create `src/services/meta-ads/client.ts`. Keep token use inside `request`; never include the URL in an error:

```ts
import "server-only";
import { z } from "zod";
import type {
  AccountSpend,
  MarketingSpendRange,
} from "@/services/marketing-spend/types";
import type { MetaAdsConfig } from "./config";

export function normalizeMetaAdAccountId(value: string) {
  const normalized = value.replace(/^act_/u, "");
  if (!/^\d+$/u.test(normalized)) throw new Error("ID da conta Meta inválido.");
  return normalized;
}

export function createMetaAdsClient(
  config: MetaAdsConfig,
  deps: { fetch: typeof fetch } = { fetch: globalThis.fetch },
) {
  const accountId = normalizeMetaAdAccountId(config.accountId);

  async function request(path: string, params: Record<string, string>) {
    const search = new URLSearchParams({ ...params, access_token: config.accessToken });
    const response = await deps.fetch(
      `https://graph.facebook.com/${config.apiVersion}/${path}?${search}`,
    );
    if (!response.ok) {
      throw new Error(`Não foi possível consultar o Meta Ads (HTTP ${response.status}).`);
    }
    return response.json() as Promise<unknown>;
  }

  return {
    async readAccountSpend(range: MarketingSpendRange): Promise<AccountSpend> {
      const [metadata, insights] = await Promise.all([
        request(`act_${accountId}`, { fields: "id,currency,timezone_name" }),
        request(`act_${accountId}/insights`, {
          fields: "spend,date_start,date_stop",
          level: "account",
          time_range: JSON.stringify({ since: range.startDate, until: range.endDate }),
        }),
      ]);
      return validateMetaSpend(metadata, insights, accountId, range);
    },
  };
}
```

Add these schemas and the private validator in the same file:

```ts
const metadataSchema = z.object({
  id: z.string(),
  currency: z.string(),
  timezone_name: z.string(),
});
const insightsSchema = z.object({
  data: z.array(z.object({
    spend: z.string().regex(/^(?:0|[1-9]\d*)(?:\.\d+)?$/u),
    date_start: z.string(),
    date_stop: z.string(),
  })).max(1),
});

function validateMetaSpend(
  metadataValue: unknown,
  insightsValue: unknown,
  accountId: string,
  range: MarketingSpendRange,
): AccountSpend {
  const metadata = metadataSchema.parse(metadataValue);
  const insights = insightsSchema.parse(insightsValue);
  if (metadata.id !== `act_${accountId}`) throw new Error("Conta Meta inesperada.");
  if (metadata.currency !== "BRL") throw new Error("Moeda da conta Meta inválida.");
  if (metadata.timezone_name !== "America/Sao_Paulo") {
    throw new Error("Fuso horário da conta Meta inválido.");
  }
  const row = insights.data[0];
  if (!row) return { amount: "0", currency: "BRL" };
  if (row.date_start !== range.startDate || row.date_stop !== range.endDate) {
    throw new Error("Período retornado pelo Meta é inválido.");
  }
  return { amount: row.spend, currency: "BRL" };
}
```

- [ ] **Step 5: Add environment names and run GREEN**

Append empty names only to `.env.example`:

```dotenv
META_AD_ACCOUNT_ID=
META_ACCESS_TOKEN=
```

Run:

```bash
npx vitest run src/tests/unit/meta-ads/client.test.ts
```

Expected: PASS with no token in test output.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/services/meta-ads src/services/marketing-spend/types.ts src/tests/unit/meta-ads/client.test.ts
git commit -m "feat: read Meta account spend"
```

---

### Task 2: Exact Google readers, settled media collection, and report reuse

**Files:**

- Modify: `src/services/marketing-spend/types.ts`
- Create: `src/services/marketing-spend/google.ts`
- Create: `src/services/marketing-spend/collect.ts`
- Create: `src/tests/unit/marketing-spend/google.test.ts`
- Create: `src/tests/unit/marketing-spend/collect.test.ts`
- Create: `src/tests/unit/marketing-report/aggregate.test.ts`
- Modify: `src/services/meta-ads/client.ts`
- Modify: `src/services/marketing-report/get-marketing-report-aggregate.ts`

**Interfaces:**

- Produces: `readGoogleAccountSpend(scope, range): Promise<AccountSpend>`.
- Produces: `collectCurrentMarketingSpend(range): Promise<MarketingSpendBatch>`.
- Produces: `collectMarketingSpend(range, deps): Promise<MarketingSpendBatch>` for unit tests.
- Preserves: `getMarketingReportAggregate(filters)` response shape and live Google behavior.

- [ ] **Step 1: Write failing exact-micros tests**

Create `src/tests/unit/marketing-spend/google.test.ts` with hoisted fakes for `getAuthenticatedClient`, `resolveGoogleAdsAccount`, and `GoogleAdsApi.Customer().report`. Assert this behavior with literal expected values:

```ts
mocks.report.mockResolvedValue([
  { metrics: { cost_micros: 1_234_567 } },
  { metrics: { cost_micros: "2000001" } },
]);

await expect(readGoogleAccountSpend("products", {
  startDate: "2026-08-01",
  endDate: "2026-08-16",
})).resolves.toEqual({ amount: "3.234568", currency: "BRL" });

expect(mocks.report).toHaveBeenCalledWith({
  entity: "customer",
  metrics: ["metrics.cost_micros"],
  from_date: "2026-08-01",
  to_date: "2026-08-16",
});
```

Add cases for no rows (`0.000000`), unsafe numeric integers, decimal strings, negative micros, missing metrics, and missing `JD_CENTRO_ID`.

- [ ] **Step 2: Write failing settled-batch and report tests**

Create `src/tests/unit/marketing-spend/collect.test.ts`. The failure test must prove all readers settle while values are withheld and raw errors disappear:

```ts
const result = await collectMarketingSpend(range, {
  now: () => 0,
  readMeta: vi.fn().mockRejectedValue(new Error("raw secret")),
  readGoogleProducts: vi.fn().mockResolvedValue({ amount: "2", currency: "BRL" }),
  readGoogleServices: vi.fn().mockResolvedValue({ amount: "3", currency: "BRL" }),
});

expect(result.values).toBeNull();
expect(result.results.META).toEqual({
  status: "FAILED",
  durationMs: 0,
  error: "Não foi possível consultar o investimento Meta.",
});
expect(result.results.GOOGLE_PRODUCTS.status).toBe("SUCCESS");
expect(result.results.GOOGLE_SERVICES.status).toBe("SUCCESS");
expect(JSON.stringify(result)).not.toContain("raw secret");
```

Add a success case asserting the three exact amount keys and `currency: "BRL"`.

Create `src/tests/unit/marketing-report/aggregate.test.ts` with mocks for Prisma and the new Google reader. Provide an existing Meta row from 1–16 August and assert the report asks both scopes for that exact range, uses live values 200 and 50, retains attributed revenue 1400, cost 350, and ROAS 4.

- [ ] **Step 3: Run RED**

```bash
npx vitest run src/tests/unit/marketing-spend/google.test.ts src/tests/unit/marketing-spend/collect.test.ts src/tests/unit/marketing-report/aggregate.test.ts
```

Expected: FAIL because the marketing-spend modules do not exist and the report does not consume them.

- [ ] **Step 4: Implement shared types and exact Google conversion**

Extend `src/services/marketing-spend/types.ts` below the existing range and account types:

```ts
export type MediaSource = "META" | "GOOGLE_PRODUCTS" | "GOOGLE_SERVICES";
export type MediaSourceResult =
  | { status: "SUCCESS"; durationMs: number; amount: string }
  | { status: "FAILED"; durationMs: number; error: string };
export type MarketingSpendBatch = {
  results: Record<MediaSource, MediaSourceResult>;
  values: null | {
    metaInvestment: string;
    googleProductsInvestment: string;
    googleServicesInvestment: string;
    currency: "BRL";
  };
};
```

Create `src/services/marketing-spend/google.ts`. Reuse `getAuthenticatedClient`, `resolveGoogleAdsAccount`, and `GoogleAdsApi`. Convert every valid micros value to `bigint`, sum all rows, and format exactly:

```ts
export function microsToDecimal(micros: bigint) {
  const whole = micros / 1_000_000n;
  const fraction = String(micros % 1_000_000n).padStart(6, "0");
  return `${whole}.${fraction}`;
}
```

Only accept nonnegative `bigint`, digit-only string, or nonnegative safe integer number. Query with `entity: "customer"`, `metrics: ["metrics.cost_micros"]`, `from_date`, and `to_date`. Normalize customer/manager IDs by removing non-digits.

- [ ] **Step 5: Implement settled media collection**

Create `src/services/marketing-spend/collect.ts`. Start all promises before awaiting and use `Promise.allSettled`. Use only these safe failures:

```ts
export const SAFE_MEDIA_ERRORS = {
  META: "Não foi possível consultar o investimento Meta.",
  GOOGLE_PRODUCTS: "Não foi possível consultar o investimento Google Produtos.",
  GOOGLE_SERVICES: "Não foi possível consultar o investimento Google Serviços.",
} as const;
```

Export dependency-injected `collectMarketingSpend`. Export `collectCurrentMarketingSpend` binding `readMetaAdsConfig`, `createMetaAdsClient`, and `readGoogleAccountSpend` for scopes `products` and `services`.

Use this settlement core so all three readers start before the await and rejected values stay private:

```ts
const entries = [
  ["META", deps.readMeta] as const,
  ["GOOGLE_PRODUCTS", deps.readGoogleProducts] as const,
  ["GOOGLE_SERVICES", deps.readGoogleServices] as const,
].map(([source, read]) => ({ source, startedAt: deps.now(), promise: read() }));
const settled = await Promise.allSettled(entries.map((entry) => entry.promise));
const results = Object.fromEntries(settled.map((outcome, index) => {
  const { source, startedAt } = entries[index];
  const durationMs = Math.max(0, deps.now() - startedAt);
  return outcome.status === "fulfilled"
    ? [source, { status: "SUCCESS", durationMs, amount: outcome.value.amount }]
    : [source, { status: "FAILED", durationMs, error: SAFE_MEDIA_ERRORS[source] }];
})) as MarketingSpendBatch["results"];
const complete = Object.values(results).every(
  (value) => value.status === "SUCCESS",
);
```

Return `values: null` unless `complete`; otherwise narrow all three results to `SUCCESS` and return their amounts under `metaInvestment`, `googleProductsInvestment`, and `googleServicesInvestment`.

- [ ] **Step 6: Make the report reuse the live Google reader**

In `get-marketing-report-aggregate.ts`, remove direct Google SDK/auth/account construction. Keep the existing permission mapping around thrown Google errors, but replace the generic `serializeError(error)` logging with the fixed log message `getMarketingReportAggregate failed` so provider payloads are never printed. Replace each `fetchGoogleCost` call with:

```ts
const [googleProducts, googleServices] = await Promise.all([
  readGoogleAccountSpend("products", {
    startDate: periodStart,
    endDate: periodEnd,
  }),
  readGoogleAccountSpend("services", {
    startDate: periodStart,
    endDate: periodEnd,
  }),
]);
const googleCentroProdutos = Number(googleProducts.amount);
const googleIcaraiServicos = Number(googleServices.amount);
```

Keep both reads inside `Promise.all`, preserve all public formatting, the Meta period bounds, and the Google/Meta origin filter.

- [ ] **Step 7: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/marketing-spend/google.test.ts src/tests/unit/marketing-spend/collect.test.ts src/tests/unit/marketing-report/aggregate.test.ts src/tests/unit/api/goals-current-route.test.ts
git add src/services/meta-ads/client.ts src/services/marketing-spend src/services/marketing-report/get-marketing-report-aggregate.ts src/tests/unit/marketing-spend src/tests/unit/marketing-report/aggregate.test.ts
git commit -m "feat: collect live Meta and Google spend"
```

Expected: all tests pass and the report still reads Google live.

---

### Task 3: Coordinated four-source execution using existing tables

**Files:**

- Create: `src/services/data-sync/types.ts`
- Create: `src/services/data-sync/errors.ts`
- Create: `src/services/data-sync/cache.ts`
- Create: `src/services/data-sync/run.ts`
- Create: `src/services/data-sync/runtime.ts`
- Create: `src/tests/unit/data-sync/run.test.ts`
- Modify: `src/services/linx/sync.ts`
- Modify: `src/tests/unit/linx/sync.test.ts`

**Interfaces:**

- Produces: `runDataSyncWithDependencies(input, deps): Promise<DataSyncSuccess>`.
- Produces: `runDataSync(input): Promise<DataSyncSuccess>`.
- Produces: `DataSyncPublicationError` with the safe message `Não foi possível concluir a sincronização de dados.`.
- Extends existing `SyncInput` with optional `revalidateSales?: boolean`, defaulting to current behavior.

- [ ] **Step 1: Write a failing Linx cache-suppression test**

In `src/tests/unit/linx/sync.test.ts`, add one test around the existing dependency-injected successful sync. Pass `revalidateSales: false` and assert the persisted summary succeeds while `deps.revalidateSales` is not called. Add a paired assertion to an existing success test that omission still calls it once.

- [ ] **Step 2: Run the Linx RED test**

```bash
npx vitest run src/tests/unit/linx/sync.test.ts
```

Expected: FAIL because `SyncInput` has no cache-suppression behavior.

- [ ] **Step 3: Add the minimal opt-out**

Extend `SyncInput` in `src/services/linx/sync.ts`:

```ts
revalidateSales?: boolean;
```

At the existing successful cache boundary, replace the unconditional call with:

```ts
if (input.revalidateSales !== false) deps.revalidateSales();
```

Run the Linx test again and require PASS.

- [ ] **Step 4: Write failing coordinator tests**

Create `src/tests/unit/data-sync/run.test.ts`. Use a fixed start of `2026-08-17T02:30:00.000Z`, whose São Paulo civil date is 16 August. The success test must assert:

```ts
expect(deps.collectSpend).toHaveBeenCalledWith({
  startDate: "2026-08-01",
  endDate: "2026-08-16",
});
expect(deps.runLinx).toHaveBeenCalledWith(expect.objectContaining({
  organizationId: "org-1",
  mode: "INCREMENTAL",
  revalidateSales: false,
}));
expect(deps.upsertMeta).toHaveBeenCalledWith({
  periodStart: new Date("2026-08-01T00:00:00.000Z"),
  periodEnd: new Date("2026-08-16T00:00:00.000Z"),
  totalInvestment: 1,
  lastSyncAt: new Date("2026-08-17T02:30:08.000Z"),
});
expect(deps.revalidate).toHaveBeenCalledTimes(1);
```

Use deferred promises to prove Linx and media start before either resolves. Table-test `META`, `GOOGLE_PRODUCTS`, and `GOOGLE_SERVICES` failures; each must leave `upsertMeta` and `revalidate` untouched. Add a Linx failure with raw text `password=secret` and assert neither serialized result nor thrown public error contains it. Add a failure where media finishes successfully after Linx rejects to prove the coordinator settles both branches before returning.

- [ ] **Step 5: Run coordinator RED**

```bash
npx vitest run src/tests/unit/data-sync/run.test.ts
```

Expected: FAIL because the data-sync modules do not exist.

- [ ] **Step 6: Implement safe types, error, and cache boundary**

Create `src/services/data-sync/types.ts`:

```ts
import type { MediaSourceResult } from "@/services/marketing-spend/types";

export type DataSyncInput = {
  organizationId: string;
  requestedById?: string | null;
  trigger: "CRON" | "MANUAL";
  deadlineAt: number;
  transactionTimeoutMs: number;
};

export type LinxSourceResult =
  | { status: "SUCCESS"; durationMs: number; summary: {
      ordersProcessed: number;
      itemsCreated: number;
      itemsUpdated: number;
      itemsRemoved: number;
    } }
  | { status: "FAILED"; durationMs: number; error: string };

export type DataSyncSources = {
  LINX: LinxSourceResult;
  META: MediaSourceResult;
  GOOGLE_PRODUCTS: MediaSourceResult;
  GOOGLE_SERVICES: MediaSourceResult;
};

export type DataSyncSuccess = {
  cutoffDate: string;
  lastSuccessfulSyncAt: string;
  sources: DataSyncSources;
};
```

Create `errors.ts` with a fixed message. It accepts only the already-sanitized source object, never a raw error:

```ts
import type { DataSyncSources } from "./types";

export class DataSyncPublicationError extends Error {
  constructor(readonly sources: DataSyncSources) {
    super("Não foi possível concluir a sincronização de dados.");
    this.name = "DataSyncPublicationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

Create `cache.ts`:

```ts
import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateSalesCaches } from "@/services/linx/sync-runtime";

export function revalidatePublishedDataSync() {
  revalidateSalesCaches();
  revalidateTag("marketing-goals-google-ads-current", { expire: 0 });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals-marketing");
  revalidatePath("/dashboard/meta-investments");
  revalidatePath("/marketing-report/current");
}
```

- [ ] **Step 7: Implement the dependency-injected coordinator**

In `run.ts`, define dependencies with `nowDate(): Date`, `nowMs(): number`, `runLinx`, `collectSpend`, `upsertMeta`, and `revalidate`. Capture `startedAt` once and call `resolveBusinessMonthToDate(startedAt)`. Start `runLinx` and `collectSpend` before awaiting either. Always convert unexpected failures to fixed per-source messages. Only after both settle and all four statuses are successful, call `upsertMeta`, then `revalidate`.

Use this control-flow core:

```ts
const startedAt = deps.nowDate();
const range = resolveBusinessMonthToDate(startedAt);
const linxStartedAt = deps.nowMs();
const linxPromise = deps.runLinx({
  organizationId: input.organizationId,
  requestedById: input.requestedById,
  trigger: input.trigger,
  mode: "INCREMENTAL",
  deadlineAt: input.deadlineAt,
  transactionTimeoutMs: input.transactionTimeoutMs,
  revalidateSales: false,
});
const mediaPromise = deps.collectSpend(range);
const [linx, media] = await Promise.allSettled([linxPromise, mediaPromise]);

const linxResult = linx.status === "fulfilled"
  ? {
      status: "SUCCESS" as const,
      durationMs: Math.max(0, deps.nowMs() - linxStartedAt),
      summary: linx.value,
    }
  : {
      status: "FAILED" as const,
      durationMs: Math.max(0, deps.nowMs() - linxStartedAt),
      error: "Não foi possível concluir a sincronização Linx.",
    };
const mediaBatch = media.status === "fulfilled"
  ? media.value
  : failedMarketingBatch();
const sources = { LINX: linxResult, ...mediaBatch.results };

if (linx.status === "rejected" || mediaBatch.values === null) {
  if (linx.status === "rejected" && isKnownLinxCoordinationError(linx.reason)) {
    throw linx.reason;
  }
  throw new DataSyncPublicationError(sources);
}
```

After the failure branch, reject a non-finite Meta conversion and write the existing row. Convert an upsert failure to `DataSyncPublicationError`, then refresh and serialize success:

```ts
const totalInvestment = Number(mediaBatch.values.metaInvestment);
if (!Number.isFinite(totalInvestment) || totalInvestment < 0) {
  throw new DataSyncPublicationError(sources);
}
const lastSyncAt = deps.nowDate();
try {
  await deps.upsertMeta({
    periodStart: new Date(`${range.startDate}T00:00:00.000Z`),
    periodEnd: new Date(`${range.endDate}T00:00:00.000Z`),
    totalInvestment,
    lastSyncAt,
  });
} catch {
  throw new DataSyncPublicationError(sources);
}
deps.revalidate();
return {
  cutoffDate: range.endDate,
  lastSuccessfulSyncAt: lastSyncAt.toISOString(),
  sources,
};
```

The UTC date strings above are deliberate; do not parse them in the runtime timezone. Preserve recognized `LinxConcurrentRunError`, `LinxInitialReconciliationRequiredError`, and `LinxInactiveOrganizationError` after media settles so routes can keep their 409 responses; map unknown Linx errors to `DataSyncPublicationError`.

- [ ] **Step 8: Bind production dependencies**

Create `runtime.ts` binding:

```ts
export const runDataSync = (input: DataSyncInput) =>
  runDataSyncWithDependencies(input, {
    nowDate: () => new Date(),
    nowMs: () => Date.now(),
    runLinx: runLinxSync,
    collectSpend: collectCurrentMarketingSpend,
    upsertMeta: (value) => prisma.metaInvestment.upsert({
      where: { periodStart: value.periodStart },
      update: {
        periodEnd: value.periodEnd,
        totalInvestment: value.totalInvestment,
        lastSyncAt: value.lastSyncAt,
      },
      create: value,
    }),
    revalidate: revalidatePublishedDataSync,
  });
```

- [ ] **Step 9: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/linx/sync.test.ts src/tests/unit/data-sync/run.test.ts
git add src/services/linx/sync.ts src/services/data-sync src/tests/unit/linx/sync.test.ts src/tests/unit/data-sync/run.test.ts
git commit -m "feat: coordinate Linx and media synchronization"
```

---

### Task 4: Manual/status APIs and the 22 UTC cron

**Files:**

- Create: `src/app/api/sync/route.ts`
- Create: `src/app/api/sync/status/route.ts`
- Create: `src/app/api/cron/sync/route.ts`
- Create: `src/tests/unit/api/data-sync-routes.test.ts`
- Modify: `src/app/api/linx/_operations.ts`
- Modify: `vercel.json`
- Delete: `src/app/api/cron/linx/route.ts`
- Delete: `src/tests/unit/api/linx-cron.test.ts`

**Interfaces:**

- Produces: `POST /api/sync` for authenticated users.
- Produces: `GET /api/sync/status` with `{ running, lastLinxSuccessfulSyncAt, lastMetaSyncAt }`.
- Produces: protected `GET /api/cron/sync`.
- Preserves: authenticated `/api/linx/sync` and `/api/linx/status`.

- [ ] **Step 1: Write failing route tests**

Create `src/tests/unit/api/data-sync-routes.test.ts` with hoisted mocks for auth, active organization lookup, Linx inspection, latest Linx success, current Meta lookup, and `runDataSync`.

Prove these observable contracts:

- manual POST rejects 401/403 before body or Prisma access;
- only an absent body or `{}` is accepted;
- ADMIN, MANAGER, and SELLER call `runDataSync` with `MANUAL`, deadline `Date.now() + 48_000`, transaction timeout `30_000`;
- status returns `running` from the existing Linx gate, a Linx ISO timestamp, and current-month Meta `lastSyncAt`;
- concurrency and initial reconciliation errors map to 409;
- incomplete media publication maps to safe 500 and includes no raw provider error;
- cron rejects absent/invalid `CRON_SECRET` before Prisma;
- cron calls the coordinator with `CRON`, deadline `+48_000`, timeout `15_000`;
- `maxDuration` remains 60;
- imported `vercel.json` equals `[{ path: "/api/cron/sync", schedule: "0 22 * * *" }]`.

Use this successful response fixture:

```ts
{
  cutoffDate: "2026-08-16",
  lastSuccessfulSyncAt: "2026-08-16T22:00:08.000Z",
  sources: {
    LINX: { status: "SUCCESS", durationMs: 8000, summary: {
      ordersProcessed: 2,
      itemsCreated: 3,
      itemsUpdated: 1,
      itemsRemoved: 0,
    } },
    META: { status: "SUCCESS", durationMs: 100, amount: "123.45" },
    GOOGLE_PRODUCTS: { status: "SUCCESS", durationMs: 200, amount: "456.780000" },
    GOOGLE_SERVICES: { status: "SUCCESS", durationMs: 300, amount: "9.100000" },
  },
}
```

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/api/data-sync-routes.test.ts
```

Expected: FAIL because the unified routes do not exist.

- [ ] **Step 3: Extend existing read operations without schema changes**

Add to `src/app/api/linx/_operations.ts`:

```ts
export async function readCurrentMetaLastSyncAt(date: Date = new Date()) {
  const { startDate } = resolveBusinessMonthToDate(date);
  const investment = await prisma.metaInvestment.findUnique({
    where: { periodStart: new Date(`${startDate}T00:00:00.000Z`) },
    select: { lastSyncAt: true },
  });
  return investment?.lastSyncAt.toISOString() ?? null;
}
```

Use `inspectLinxOrganization` in the status route to determine `running`; do not invent in-memory server state.

- [ ] **Step 4: Implement authenticated manual and status routes**

Manual POST must call `requireActiveUser()` before reading the body, reject nonempty shapes, resolve the single active organization, inspect the current Linx gate, and return the existing safe running response before starting provider calls. On READY, call `runDataSync` with fixed incremental settings.

Status GET must authenticate first, resolve the organization, then return:

```ts
{
  running: gate.kind === "RUNNING",
  lastLinxSuccessfulSyncAt: await readLastSuccessfulSyncAt(organization.id),
  lastMetaSyncAt: await readCurrentMetaLastSyncAt(),
}
```

Map only known configuration/coordination errors to their existing messages. Unknown errors return `Não foi possível concluir a sincronização de dados.`.

- [ ] **Step 5: Implement protected unified cron**

Create `src/app/api/cron/sync/route.ts` by retaining the current timing-safe `CRON_SECRET` comparison and exports:

```ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;
```

After authorization, resolve the unique active organization and call `runDataSync` with `trigger: "CRON"`, deadline `startedAt + 48_000`, and `transactionTimeoutMs: 15_000`.

- [ ] **Step 6: Switch the schedule and remove only the old cron route**

Replace `vercel.json` with:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "0 22 * * *"
    }
  ]
}
```

Delete `src/app/api/cron/linx/route.ts` and its dedicated `src/tests/unit/api/linx-cron.test.ts`; the new route suite owns authorization, schedule, duration, configuration, and error contracts. Do not delete `/api/linx/sync` or `/api/linx/status`.

- [ ] **Step 7: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/api/data-sync-routes.test.ts src/tests/unit/api/linx-user-routes.test.ts
git add vercel.json src/app/api/sync src/app/api/cron/sync src/app/api/linx/_operations.ts src/tests/unit/api/data-sync-routes.test.ts
git rm src/app/api/cron/linx/route.ts src/tests/unit/api/linx-cron.test.ts
git commit -m "feat: schedule coordinated data synchronization"
```

Expected: all route tests pass; old user Linx endpoints remain green.

---

### Task 5: Unified dashboard control

**Files:**

- Create: `src/components/data-sync-control.tsx`
- Create: `src/tests/unit/components/data-sync-control.test.ts`
- Modify: `src/components/header-dashboard.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Delete: `src/components/linx-sync-control.tsx`
- Delete: `src/tests/unit/components/linx-sync-control.test.ts`

**Interfaces:**

- Consumes: `GET /api/sync/status` and `POST /api/sync`.
- Produces: `DataSyncControl({ variant: "desktop" | "mobile" })`.

- [ ] **Step 1: Write failing component tests**

Create `src/tests/unit/components/data-sync-control.test.ts` using the existing real `QueryClientProvider` harness. Prove one deduplicated `/api/sync/status` request across desktop/mobile and exactly two buttons named `Sincronizar dados`.

For success, resolve POST with the Task 4 fixture and assert:

```ts
expect(fetchMock).toHaveBeenLastCalledWith("/api/sync", { method: "POST" });
expect(toast.success).toHaveBeenCalledWith(
  "Dados atualizados até 16/08/2026: Linx, Meta e duas contas Google.",
);
expect(refresh).toHaveBeenCalledTimes(1);
```

Also retain concrete behavior tests for shared mutation loading, unavailable status with the button enabled, server `running` state, 409 info toast, safe 500 error, and no refresh after failure. Display separate status copy for the last Linx success and last Meta update; do not call either one a guaranteed atomic snapshot.

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/components/data-sync-control.test.ts
```

Expected: FAIL because `DataSyncControl` does not exist.

- [ ] **Step 3: Implement the unified control**

Adapt the current control with:

```ts
const STATUS_QUERY_KEY = ["data-sync-status"] as const;
const SYNC_MUTATION_KEY = ["data-sync"] as const;
```

Use `/api/sync/status`, POST `/api/sync`, label `Sincronizar dados`, São Paulo date formatting, 409 through `toast.info`, and other safe errors through `toast.error`. Disable both variants when the shared mutation is active or `status.data.running` is true. After success, set `running: false` and `lastMetaSyncAt: data.lastSuccessfulSyncAt`, preserve the prior Linx timestamp temporarily, invalidate `STATUS_QUERY_KEY` so the server supplies the exact Linx completion time, and call `router.refresh()` once. Never render amounts or raw source errors in the sidebar/header.

- [ ] **Step 4: Replace both component usages and remove old files**

Import `DataSyncControl` in `header-dashboard.tsx` and `app-sidebar.tsx`, replacing the desktop and mobile `LinxSyncControl` usages. Delete the old component and test only after the new suite passes.

- [ ] **Step 5: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/components/data-sync-control.test.ts src/tests/unit/auth/admin-sidebar.test.ts
git add src/components/data-sync-control.tsx src/components/header-dashboard.tsx src/components/app-sidebar.tsx src/tests/unit/components/data-sync-control.test.ts
git rm src/components/linx-sync-control.tsx src/tests/unit/components/linx-sync-control.test.ts
git commit -m "feat: expose coordinated data sync control"
```

---

### Task 6: Full local verification and guarded rollout handoff

**Files:**

- Verify all files changed in Tasks 1–5.
- Commit no production credential.

**Interfaces:**

- Produces fresh unit, static, build, Meta preflight, and configuration evidence.
- Stops before any production mutation.

- [ ] **Step 1: Run full unit verification**

```bash
npm test
```

Expected: exit 0, zero failures, and no token text.

- [ ] **Step 2: Run static verification**

```bash
npx prisma validate
npm run lint
npm run build
git diff --check
```

Expected: every command exits 0. No integration database suite is required because the approved implementation has no schema, migration, new transaction, or new persisted lock.

- [ ] **Step 3: Run a read-only Meta preflight**

Use `node --env-file=.env` to request account metadata and current-month Insights. Print only account ID, currency, timezone, requested dates, and numeric spend. Never print the token, request URL, response headers, or raw error body.

Expected: account `act_306488710441939`, currency `BRL`, timezone `America/Sao_Paulo`, exact requested dates, and nonnegative spend.

- [ ] **Step 4: Verify configuration without exposing secrets**

Confirm `.env` is ignored, `.env.example` contains empty Meta names, `vercel.json` contains only `/api/cron/sync` at `0 22 * * *`, and `git diff --cached`/`git status` contain no credential file.

- [ ] **Step 5: Stop before Production**

Report local evidence and the documented no-snapshot limitation: Google is read again when the report renders. Request a rotated Meta system-user token and explicit rollout authorization. Do not reuse the token disclosed in the conversation.

- [ ] **Step 6: Execute rollout only after later authorization**

After the user supplies a rotated token and explicitly authorizes Production, verify the linked Vercel project, set only `META_AD_ACCOUNT_ID` and `META_ACCESS_TOKEN` in Production without echoing values, deploy through the repository's approved workflow, trigger one authenticated manual run, compare dashboard/public report, and verify the next cron invocation in the 22 UTC hour.

---

## References

- Approved design: `docs/superpowers/specs/2026-08-16-coordinated-linx-media-sync-design.md`
- Superseded plan: `docs/superpowers/plans/2026-08-16-unified-linx-marketing-sync.md` (must not be executed)
- Meta Insights: `https://developers.facebook.com/docs/marketing-api/reference/ad-account/insights/`
- Google Ads Node client: `https://github.com/Opteo/google-ads-api`
- Vercel Cron Jobs: `https://vercel.com/docs/cron-jobs`
