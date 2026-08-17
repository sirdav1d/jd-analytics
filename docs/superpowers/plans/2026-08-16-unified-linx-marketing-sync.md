# Unified Linx and Marketing Sync Implementation Plan

> **Cancelado:** este plano depende de tabelas novas e não deve ser executado. Ele foi substituído pela especificação `2026-08-16-coordinated-linx-media-sync-design.md`; um novo plano sem mudanças de schema será criado.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Synchronize Linx revenue and month-to-date spend from Meta, Google Products, and Google Services under one manual or scheduled run, then publish one consistent ROAS cutoff to the dashboard and public report.

**Architecture:** A persisted `DataSyncRun` lease coordinates one run per active Linx organization. Linx and a three-source marketing-spend batch run in parallel; only a four-source success atomically appends a `MarketingInvestmentSnapshot` and advances the report cutoff. Current-month consumers read the newest successful snapshot, while legacy manual Meta records remain available for months without an automated snapshot.

**Tech Stack:** Next.js 16 App Router, TypeScript 5, Prisma 6/PostgreSQL, Vitest 4, TanStack Query 5, `google-ads-api` 23, Meta Marketing API v25.0, Vercel Cron Jobs.

## Global Constraints

- Automate only the current month initially.
- Revenue attribution remains limited to Linx origins containing Google or Meta.
- Sources are Meta `act_306488710441939`, Google `products`, and Google `services`.
- Compute one cutoff in `America/Sao_Paulo` and reuse it for all four sources.
- Publish only when Linx and all three media reads succeed.
- Preserve all `MetaInvestment` rows and legacy fallback for months without snapshots.
- Schedule `0 22 * * *`; the current Vercel plan may invoke at any minute in the 22 UTC hour.
- Never persist, return, or log tokens, raw external responses, or credential-bearing URLs.
- Persist spend as PostgreSQL decimal, never floating point.
- Rotate the disclosed Meta token before production rollout.
- Do not mutate Vercel Production or deploy without explicit rollout authorization.

## File Map

New services:

- `src/services/data-sync/{types,errors,repository,cache,run,runtime}.ts`
- `src/services/meta-ads/{config,client}.ts`
- `src/services/marketing-spend/{types,google,collect}.ts`

New routes and UI:

- `src/app/api/sync/route.ts`
- `src/app/api/sync/status/route.ts`
- `src/app/api/cron/sync/route.ts`
- `src/components/data-sync-control.tsx`

New tests:

- `src/tests/integration/data-sync/{schema,repository}.test.ts`
- `src/tests/unit/data-sync/{repository,run}.test.ts`
- `src/tests/unit/meta-ads/client.test.ts`
- `src/tests/unit/marketing-spend/{google,collect}.test.ts`
- `src/tests/unit/api/data-sync-routes.test.ts`
- `src/tests/unit/marketing-report/aggregate.test.ts`
- `src/tests/unit/components/data-sync-control.test.ts`

Existing files changed:

- `prisma/schema.prisma`
- `prisma/migrations/20260816000000_add_unified_data_sync/migration.sql`
- `.env.example`
- `vercel.json`
- `src/services/marketing-report/get-marketing-report-aggregate.ts`
- `src/components/app-sidebar.tsx`

---

### Task 1: Persisted run and immutable snapshot schema

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260816000000_add_unified_data_sync/migration.sql`
- Test: `src/tests/integration/data-sync/schema.test.ts`

**Interfaces:**
- Produces `DataSyncRun`, `MarketingInvestmentSnapshot`, `DataSyncTrigger`, and `DataSyncStatus`.
- Produces partial unique index `DataSyncRun_one_running_per_org` for Task 2.

- [ ] **Step 1: Write the failing schema integration test**

Create `src/tests/integration/data-sync/schema.test.ts`:

```ts
import { Prisma, PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { requireTestDatabaseUrl } from "@/tests/setup-integration";

const url = process.env.TEST_DATABASE_URL ? requireTestDatabaseUrl() : undefined;
const prisma = url ? new PrismaClient({ datasourceUrl: url }) : undefined;
const describeWithDatabase = url ? describe : describe.skip;

afterAll(async () => prisma?.$disconnect());

describeWithDatabase("unified data sync schema", () => {
  it("persists exact media values on one successful run", async () => {
    const suffix = crypto.randomUUID();
    const organization = await prisma!.organization.create({
      data: { name: `sync-schema-${suffix}` },
    });
    try {
      const run = await prisma!.dataSyncRun.create({
        data: {
          organizationId: organization.id,
          trigger: "MANUAL",
          status: "SUCCESS",
          cutoffDate: new Date("2026-08-16T00:00:00.000Z"),
          sourceResults: { LINX: { status: "SUCCESS", durationMs: 8 } },
          finishedAt: new Date("2026-08-16T22:00:08.000Z"),
        },
      });
      const snapshot = await prisma!.marketingInvestmentSnapshot.create({
        data: {
          dataSyncRunId: run.id,
          periodStart: new Date("2026-08-01T00:00:00.000Z"),
          periodEnd: new Date("2026-08-16T00:00:00.000Z"),
          metaInvestment: new Prisma.Decimal("1234.560000"),
          googleProductsInvestment: new Prisma.Decimal("9876.543210"),
          googleServicesInvestment: new Prisma.Decimal("345.670000"),
          currency: "BRL",
        },
      });
      expect(snapshot.metaInvestment.toFixed(6)).toBe("1234.560000");
      expect(snapshot.googleProductsInvestment.toFixed(6)).toBe("9876.543210");
      expect(snapshot.googleServicesInvestment.toFixed(6)).toBe("345.670000");
    } finally {
      await prisma!.marketingInvestmentSnapshot.deleteMany({
        where: { run: { organizationId: organization.id } },
      });
      await prisma!.dataSyncRun.deleteMany({ where: { organizationId: organization.id } });
      await prisma!.organization.delete({ where: { id: organization.id } });
    }
  });
});
```

- [ ] **Step 2: Run RED**

```bash
npx vitest run --config vitest.integration.config.ts src/tests/integration/data-sync/schema.test.ts
```

Expected: FAIL because the models are absent. If skipped, configure an explicitly named `TEST_DATABASE_URL`; skipped is not RED.

- [ ] **Step 3: Add Prisma relations, enums, and models**

Add `dataSyncRuns DataSyncRun[]` to `Organization`, `requestedDataSyncRuns DataSyncRun[] @relation("DataSyncRequestedBy")` to `User`, and `dataSyncRun DataSyncRun?` to `LinxSyncRun`. Add:

```prisma
enum DataSyncTrigger {
  CRON
  MANUAL
}

enum DataSyncStatus {
  RUNNING
  SUCCESS
  FAILED
}

model DataSyncRun {
  id             String         @id @default(uuid())
  organizationId String
  requestedById  String?
  linxSyncRunId  String?        @unique
  trigger        DataSyncTrigger
  status         DataSyncStatus
  cutoffDate     DateTime       @db.Date
  sourceResults  Json?
  errorMessage   String?
  startedAt      DateTime       @default(now())
  finishedAt     DateTime?
  leaseExpiresAt DateTime?
  organization   Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  requestedBy    User?          @relation("DataSyncRequestedBy", fields: [requestedById], references: [id], onDelete: SetNull)
  linxSyncRun    LinxSyncRun?   @relation(fields: [linxSyncRunId], references: [id], onDelete: SetNull)
  snapshot       MarketingInvestmentSnapshot?

  @@index([organizationId, startedAt])
  @@index([status, finishedAt])
}

model MarketingInvestmentSnapshot {
  id                       String      @id @default(uuid())
  dataSyncRunId            String      @unique
  periodStart              DateTime    @db.Date
  periodEnd                DateTime    @db.Date
  metaInvestment           Decimal     @db.Decimal(18, 6)
  googleProductsInvestment Decimal     @db.Decimal(18, 6)
  googleServicesInvestment Decimal     @db.Decimal(18, 6)
  currency                 String      @db.VarChar(3)
  createdAt                DateTime    @default(now())
  run                      DataSyncRun @relation(fields: [dataSyncRunId], references: [id], onDelete: Cascade)

  @@index([periodStart, periodEnd, createdAt])
}
```

- [ ] **Step 4: Create the SQL migration**

Create the migration with this exact structure:

```sql
BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

CREATE TYPE "DataSyncTrigger" AS ENUM ('CRON', 'MANUAL');
CREATE TYPE "DataSyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

CREATE TABLE "DataSyncRun" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "requestedById" TEXT,
  "linxSyncRunId" TEXT,
  "trigger" "DataSyncTrigger" NOT NULL,
  "status" "DataSyncStatus" NOT NULL,
  "cutoffDate" DATE NOT NULL,
  "sourceResults" JSONB,
  "errorMessage" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  "leaseExpiresAt" TIMESTAMP(3),
  CONSTRAINT "DataSyncRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MarketingInvestmentSnapshot" (
  "id" TEXT NOT NULL,
  "dataSyncRunId" TEXT NOT NULL,
  "periodStart" DATE NOT NULL,
  "periodEnd" DATE NOT NULL,
  "metaInvestment" DECIMAL(18,6) NOT NULL,
  "googleProductsInvestment" DECIMAL(18,6) NOT NULL,
  "googleServicesInvestment" DECIMAL(18,6) NOT NULL,
  "currency" VARCHAR(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MarketingInvestmentSnapshot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MarketingInvestmentSnapshot_period_check"
    CHECK ("periodStart" <= "periodEnd"),
  CONSTRAINT "MarketingInvestmentSnapshot_currency_check"
    CHECK ("currency" = 'BRL'),
  CONSTRAINT "MarketingInvestmentSnapshot_nonnegative_check"
    CHECK (
      "metaInvestment" >= 0 AND
      "googleProductsInvestment" >= 0 AND
      "googleServicesInvestment" >= 0
    )
);

ALTER TABLE "DataSyncRun" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MarketingInvestmentSnapshot" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX "DataSyncRun_linxSyncRunId_key"
ON "DataSyncRun"("linxSyncRunId");

CREATE INDEX "DataSyncRun_organizationId_startedAt_idx"
ON "DataSyncRun"("organizationId", "startedAt");

CREATE INDEX "DataSyncRun_status_finishedAt_idx"
ON "DataSyncRun"("status", "finishedAt");

CREATE UNIQUE INDEX "DataSyncRun_one_running_per_org"
ON "DataSyncRun"("organizationId")
WHERE "status" = 'RUNNING';

CREATE UNIQUE INDEX "MarketingInvestmentSnapshot_dataSyncRunId_key"
ON "MarketingInvestmentSnapshot"("dataSyncRunId");

CREATE INDEX "MarketingInvestmentSnapshot_periodStart_periodEnd_createdAt_idx"
ON "MarketingInvestmentSnapshot"("periodStart", "periodEnd", "createdAt");

ALTER TABLE "DataSyncRun"
ADD CONSTRAINT "DataSyncRun_organizationId_fkey"
FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DataSyncRun"
ADD CONSTRAINT "DataSyncRun_requestedById_fkey"
FOREIGN KEY ("requestedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DataSyncRun"
ADD CONSTRAINT "DataSyncRun_linxSyncRunId_fkey"
FOREIGN KEY ("linxSyncRunId") REFERENCES "LinxSyncRun"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MarketingInvestmentSnapshot"
ADD CONSTRAINT "MarketingInvestmentSnapshot_dataSyncRunId_fkey"
FOREIGN KEY ("dataSyncRunId") REFERENCES "DataSyncRun"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
```

- [ ] **Step 5: Generate, migrate the test database, and run GREEN**

```bash
npx prisma format
npx prisma generate
DATABASE_URL="$TEST_DATABASE_URL" DIRECT_URL="$TEST_DATABASE_URL" npx prisma migrate deploy
npx vitest run --config vitest.integration.config.ts src/tests/integration/data-sync/schema.test.ts
```

Expected: all commands exit 0 and the test passes.

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/20260816000000_add_unified_data_sync/migration.sql src/tests/integration/data-sync/schema.test.ts
git commit -m "feat: add unified sync persistence schema"
```

---

### Task 2: Coordination repository and atomic publication

**Files:**
- Create: `src/services/data-sync/types.ts`
- Create: `src/services/data-sync/errors.ts`
- Create: `src/services/data-sync/repository.ts`
- Test: `src/tests/unit/data-sync/repository.test.ts`
- Test: `src/tests/integration/data-sync/repository.test.ts`

**Interfaces:**
- Produces `createDataSyncRepository(db)` with `acquireRun`, `markFailed`, `publish`, and `readStatus`.
- Produces `DataSyncConcurrentRunError` and `DataSyncPublicationError`.

- [ ] **Step 1: Write failing repository tests**

The unit test must prove three behaviors with transaction-preserving fakes:

```ts
it("expires an abandoned run before acquiring the next lease", async () => {
  const updateMany = vi.fn().mockResolvedValue({ count: 1 });
  const create = vi.fn().mockResolvedValue({ id: "run-new" });
  const db = {
    $transaction: vi.fn(async (callback) => callback({
      dataSyncRun: { updateMany, create },
    })),
  };
  const repo = createDataSyncRepository(db as never);
  const now = new Date("2026-08-16T22:00:00.000Z");
  await repo.acquireRun({
    organizationId: "org-1",
    requestedById: "user-1",
    trigger: "MANUAL",
    cutoffDate: new Date("2026-08-16T00:00:00.000Z"),
    now,
    leaseExpiresAt: new Date("2026-08-16T22:00:55.000Z"),
  });
  expect(updateMany).toHaveBeenCalledWith({
    where: {
      organizationId: "org-1",
      status: "RUNNING",
      leaseExpiresAt: { lte: now },
    },
    data: {
      status: "FAILED",
      finishedAt: now,
      leaseExpiresAt: null,
      errorMessage: "Execução expirada antes da conclusão.",
    },
  });
});
```

Add one test that maps Prisma `P2002` target `DataSyncRun_one_running_per_org` to `DataSyncConcurrentRunError`, and one test that proves snapshot creation plus success update happen inside the same `$transaction` callback.

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/data-sync/repository.test.ts
```

Expected: FAIL because the module is absent.

- [ ] **Step 3: Define exact shared types and errors**

```ts
export type DataSyncSource =
  | "LINX" | "META" | "GOOGLE_PRODUCTS" | "GOOGLE_SERVICES";
export type DataSyncSourceResult =
  | { status: "SUCCESS"; durationMs: number; amount?: string; summary?: Record<string, number> }
  | { status: "FAILED"; durationMs: number; error: string };
export type DataSyncSourceResults = Record<DataSyncSource, DataSyncSourceResult>;

export type AcquireDataSyncRunInput = {
  organizationId: string;
  requestedById?: string | null;
  trigger: "CRON" | "MANUAL";
  cutoffDate: Date;
  now: Date;
  leaseExpiresAt: Date;
};

export type PublishDataSyncInput = {
  runId: string;
  linxSyncRunId?: string | null;
  periodStart: Date;
  periodEnd: Date;
  metaInvestment: string;
  googleProductsInvestment: string;
  googleServicesInvestment: string;
  sourceResults: DataSyncSourceResults;
  finishedAt: Date;
};
```

`DataSyncConcurrentRunError` message is `Já existe uma sincronização de dados em andamento.`. `DataSyncPublicationError` message is `Não foi possível publicar um novo corte completo.`.

Use this constraint mapper in `repository.ts`:

```ts
function isRunningConstraint(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== "P2002") return false;
  const target = error.meta?.target;
  return target === "DataSyncRun_one_running_per_org" ||
    (Array.isArray(target) && target.includes("organizationId"));
}
```

- [ ] **Step 4: Implement repository methods**

`acquireRun` runs this Prisma transaction, catching only the partial-index `P2002` as concurrency:

```ts
async acquireRun(input: AcquireDataSyncRunInput) {
  return db.$transaction(async (tx) => {
    await tx.dataSyncRun.updateMany({
      where: {
        organizationId: input.organizationId,
        status: "RUNNING",
        leaseExpiresAt: { lte: input.now },
      },
      data: {
        status: "FAILED",
        finishedAt: input.now,
        leaseExpiresAt: null,
        errorMessage: "Execução expirada antes da conclusão.",
      },
    });
    try {
      return await tx.dataSyncRun.create({
        data: {
          organizationId: input.organizationId,
          requestedById: input.requestedById,
          trigger: input.trigger,
          status: "RUNNING",
          cutoffDate: input.cutoffDate,
          leaseExpiresAt: input.leaseExpiresAt,
        },
        select: { id: true, startedAt: true },
      });
    } catch (error) {
      if (isRunningConstraint(error)) throw new DataSyncConcurrentRunError();
      throw error;
    }
  });
}
```

`markFailed(runId, sourceResults, finishedAt, safeMessage)` writes `FAILED`, clears the lease, and stores only sanitized JSON.

`publish(input)` uses one Prisma transaction:

```ts
const snapshot = await tx.marketingInvestmentSnapshot.create({
  data: {
    dataSyncRunId: input.runId,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    metaInvestment: new Prisma.Decimal(input.metaInvestment),
    googleProductsInvestment: new Prisma.Decimal(input.googleProductsInvestment),
    googleServicesInvestment: new Prisma.Decimal(input.googleServicesInvestment),
    currency: "BRL",
  },
});
const run = await tx.dataSyncRun.update({
  where: { id: input.runId },
  data: {
    status: "SUCCESS",
    linxSyncRunId: input.linxSyncRunId,
    sourceResults: input.sourceResults as unknown as Prisma.InputJsonValue,
    errorMessage: null,
    finishedAt: input.finishedAt,
    leaseExpiresAt: null,
  },
});
return { snapshot, run };
```

`readStatus(organizationId)` reads latest `SUCCESS` ordered by `finishedAt desc` and current `RUNNING`, returning only dates, source results, and run ID.

- [ ] **Step 5: Run unit GREEN and add integration coverage**

```bash
npx vitest run src/tests/unit/data-sync/repository.test.ts
```

Then create `src/tests/integration/data-sync/repository.test.ts` proving:

- two simultaneous acquisitions yield one success and one concurrency error;
- an expired lease becomes `FAILED` before reacquisition;
- publication creates exactly one snapshot and marks the same run `SUCCESS`;
- a forced snapshot constraint failure does not mark the run successful.

Run:

```bash
npx vitest run --config vitest.integration.config.ts src/tests/integration/data-sync/repository.test.ts
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add src/services/data-sync src/tests/unit/data-sync/repository.test.ts src/tests/integration/data-sync/repository.test.ts
git commit -m "feat: coordinate unified data sync runs"
```

---

### Task 3: Meta Marketing API client

**Files:**
- Create: `src/services/meta-ads/config.ts`
- Create: `src/services/meta-ads/client.ts`
- Test: `src/tests/unit/meta-ads/client.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces `readMetaAdsConfig()` and `createMetaAdsClient(config, deps)`.
- `readAccountSpend(range)` returns `{ amount: string; currency: "BRL" }`.

- [ ] **Step 1: Write failing Meta tests**

Test ID normalization for numeric and `act_` inputs. With a fake fetch, return account metadata followed by one Insights row and assert:

```ts
await expect(client.readAccountSpend({
  startDate: "2026-08-01",
  endDate: "2026-08-16",
})).resolves.toEqual({ amount: "1234.56", currency: "BRL" });

const url = new URL(String(fetch.mock.calls[1][0]));
expect(url.pathname).toBe("/v25.0/act_306488710441939/insights");
expect(url.searchParams.get("fields")).toBe("spend,date_start,date_stop");
expect(url.searchParams.get("level")).toBe("account");
expect(JSON.parse(url.searchParams.get("time_range")!)).toEqual({
  since: "2026-08-01",
  until: "2026-08-16",
});
```

Also test empty data returns zero, currency other than BRL fails, timezone other than `America/Sao_Paulo` fails, mismatched dates fail, and an HTTP error never exposes `secret-token`.

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/meta-ads/client.test.ts
```

Expected: FAIL because the client is absent.

- [ ] **Step 3: Implement strict server configuration**

```ts
import "server-only";
import { z } from "zod";

const schema = z.object({
  META_AD_ACCOUNT_ID: z.string().regex(/^(?:act_)?\d+$/u),
  META_ACCESS_TOKEN: z.string().min(20),
});

export function readMetaAdsConfig() {
  const env = schema.parse(process.env);
  return {
    accountId: env.META_AD_ACCOUNT_ID,
    accessToken: env.META_ACCESS_TOKEN,
    apiVersion: "v25.0" as const,
  };
}
```

- [ ] **Step 4: Implement account metadata plus Insights reads**

Normalize the account ID by removing one leading `act_` and requiring digits. Start metadata and Insights requests together. Send `fields=id,currency,timezone_name` to the account and `fields=spend,date_start,date_stop`, `level=account`, and JSON `time_range` to Insights. Accept exactly zero or one row; validate account ID, BRL, São Paulo timezone, both returned dates, and a nonnegative decimal string. Convert every external failure to a safe message containing HTTP status only.

Do not log the constructed URL. Keep the token only in request construction.

Use this public shape and request core:

```ts
export function normalizeMetaAdAccountId(value: string) {
  const normalized = value.replace(/^act_/u, "");
  if (!/^\d+$/u.test(normalized)) throw new Error("ID da conta Meta inválido.");
  return normalized;
}

export function createMetaAdsClient(
  config: ReturnType<typeof readMetaAdsConfig>,
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
    async readAccountSpend(range: { startDate: string; endDate: string }) {
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

`validateMetaSpend` is private and implements every literal validation covered by Step 1; it returns `{ amount: "0", currency: "BRL" }` for an empty data array.

- [ ] **Step 5: Add empty environment names and run GREEN**

Append only:

```dotenv
META_AD_ACCOUNT_ID=
META_ACCESS_TOKEN=
```

Run:

```bash
npx vitest run src/tests/unit/meta-ads/client.test.ts
```

Expected: PASS and no token in output.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/services/meta-ads src/tests/unit/meta-ads/client.test.ts
git commit -m "feat: read Meta account spend"
```

---

### Task 4: Exact Google spend and settled three-source collection

**Files:**
- Create: `src/services/marketing-spend/types.ts`
- Create: `src/services/marketing-spend/google.ts`
- Create: `src/services/marketing-spend/collect.ts`
- Test: `src/tests/unit/marketing-spend/google.test.ts`
- Test: `src/tests/unit/marketing-spend/collect.test.ts`

**Interfaces:**
- Produces `readGoogleAccountSpend(scope, range)` with exact decimal output.
- Produces `collectMarketingSpend(range, deps)` that settles all media sources and withholds `values` after any failure.

- [ ] **Step 1: Write the failing exact-micros test**

Mock the Google SDK customer boundary, existing authentication, and account resolver. Keep conversion real:

```ts
mocks.report.mockResolvedValue([
  { metrics: { cost_micros: 1_234_567 } },
  { metrics: { cost_micros: 2_000_001 } },
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

Add cases for no rows (`0.000000`), malformed micros, negative micros, and missing `JD_CENTRO_ID`.

- [ ] **Step 2: Write the failing settled-batch tests**

Use literal readers and assert:

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

Add a success case asserting exact keys `metaInvestment`, `googleProductsInvestment`, `googleServicesInvestment`, and `currency: "BRL"`.

- [ ] **Step 3: Run RED**

```bash
npx vitest run src/tests/unit/marketing-spend/google.test.ts src/tests/unit/marketing-spend/collect.test.ts
```

Expected: FAIL because the modules are absent.

- [ ] **Step 4: Implement exact Google conversion**

In `google.ts`, reuse `getAuthenticatedClient`, `resolveGoogleAdsAccount`, and `GoogleAdsApi`. Normalize account IDs by removing non-digits. Sum `cost_micros` as `bigint`, reject invalid values, and format:

```ts
export function microsToDecimal(micros: bigint) {
  const whole = micros / 1_000_000n;
  const fraction = String(micros % 1_000_000n).padStart(6, "0");
  return `${whole}.${fraction}`;
}
```

Return `{ amount: microsToDecimal(total), currency: "BRL" }`.

- [ ] **Step 5: Implement media types and collection**

Create:

```ts
export type MarketingSpendRange = { startDate: string; endDate: string };
export type AccountSpend = { amount: string; currency: "BRL" };
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

Start all three reads before awaiting. Use `Promise.allSettled`. Map errors to:

```ts
const SAFE_ERRORS = {
  META: "Não foi possível consultar o investimento Meta.",
  GOOGLE_PRODUCTS: "Não foi possível consultar o investimento Google Produtos.",
  GOOGLE_SERVICES: "Não foi possível consultar o investimento Google Serviços.",
} as const;
```

Export `collectCurrentMarketingSpend(range)` binding `readMetaAdsConfig`, `createMetaAdsClient`, and the two Google scopes.

- [ ] **Step 6: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/marketing-spend/google.test.ts src/tests/unit/marketing-spend/collect.test.ts
git add src/services/marketing-spend src/tests/unit/marketing-spend
git commit -m "feat: collect Google and Meta spend"
```

Expected: tests pass before the commit.

---

### Task 5: Four-source orchestrator and publication cache boundary

**Files:**
- Create: `src/services/data-sync/cache.ts`
- Create: `src/services/data-sync/run.ts`
- Create: `src/services/data-sync/runtime.ts`
- Test: `src/tests/unit/data-sync/run.test.ts`

**Interfaces:**
- Produces `runDataSyncWithDependencies(input, deps)` for tests.
- Produces `runDataSync(input)` for Task 6 routes.
- Returns `{ cutoffDate, lastSuccessfulSyncAt, sources }`.

- [ ] **Step 1: Write failing orchestrator tests**

Use start `2026-08-17T02:30:00.000Z`; São Paulo is on `2026-08-16`. Assert success publishes:

```ts
expect(deps.collectSpend).toHaveBeenCalledWith({
  startDate: "2026-08-01",
  endDate: "2026-08-16",
});
expect(deps.repo.publish).toHaveBeenCalledWith(expect.objectContaining({
  runId: "data-run-1",
  periodStart: new Date("2026-08-01T00:00:00.000Z"),
  periodEnd: new Date("2026-08-16T00:00:00.000Z"),
  metaInvestment: "1.000000",
  googleProductsInvestment: "2.000000",
  googleServicesInvestment: "3.000000",
}));
expect(deps.revalidate).toHaveBeenCalledTimes(1);
```

Table-test `META`, `GOOGLE_PRODUCTS`, and `GOOGLE_SERVICES` failures: `publish` and cache invalidation are not called, `markFailed` is called once, and error is `Não foi possível publicar um novo corte completo.`. Add a Linx-failure test proving media settles and raw Linx errors are not stored. Add a deferred-promise test proving Linx and media start before either finishes.

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/data-sync/run.test.ts
```

Expected: FAIL because the orchestrator is absent.

- [ ] **Step 3: Implement cache invalidation**

```ts
import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

export function revalidatePublishedDataSync() {
  revalidateTag("goals-current", { expire: 0 });
  revalidateTag("marketing-goals-google-ads-current", { expire: 0 });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals-marketing");
  revalidatePath("/dashboard/meta-investments");
  revalidatePath("/marketing-report/current");
}
```

- [ ] **Step 4: Implement dependency-injected orchestration**

`runDataSyncWithDependencies` must capture one `startedAt` for the immutable cutoff, resolve `resolveBusinessMonthToDate(startedAt)`, acquire the lease, start Linx and spend collection together, build four sanitized results, mark failure without publishing after any source failure, or publish then invalidate on complete success. Later `nowDate()` calls may record completion time but must never recalculate the cutoff.

Use this control flow:

```ts
const startedAt = deps.nowDate();
const range = resolveBusinessMonthToDate(startedAt);
const run = await deps.repo.acquireRun({
  organizationId: input.organizationId,
  requestedById: input.requestedById,
  trigger: input.trigger,
  cutoffDate: new Date(`${range.endDate}T00:00:00.000Z`),
  now: startedAt,
  leaseExpiresAt: new Date(input.deadlineAt + 5_000),
});

const linxInput = {
  organizationId: input.organizationId,
  requestedById: input.requestedById,
  trigger: input.trigger,
  mode: "INCREMENTAL" as const,
  deadlineAt: input.deadlineAt,
  transactionTimeoutMs: input.transactionTimeoutMs,
};

const [linx, media] = await Promise.all([
  deps.runLinx(linxInput).then(
    (value) => ({ status: "fulfilled" as const, value }),
    () => ({ status: "rejected" as const }),
  ),
  deps.collectSpend(range).catch(() => failedMarketingBatch()),
]);

const sourceResults = buildSafeSourceResults(linx, media);
if (linx.status === "rejected" || media.values === null) {
  await deps.repo.markFailed(
    run.id,
    sourceResults,
    deps.nowDate(),
    "Não foi possível publicar um novo corte completo.",
  );
  throw new DataSyncPublicationError();
}

const published = await deps.repo.publish(buildPublicationInput(
  run.id,
  range,
  linx.value,
  media.values,
  sourceResults,
  deps.nowDate(),
));
deps.revalidate();
return serializeDataSyncSuccess(published.run, range.endDate, sourceResults);
```

`failedMarketingBatch()` returns `values: null` and three `FAILED` results using the safe source-specific messages from Task 4. It must not inspect or serialize the unexpected error.

Create UTC database dates with `${civilDate}T00:00:00.000Z`; do not use runtime timezone parsing.

- [ ] **Step 5: Bind production runtime dependencies**

`runtime.ts` binds `dataSyncRepository`, existing `runLinxSync`, `collectCurrentMarketingSpend`, `revalidatePublishedDataSync`, and `new Date()`. Keep `runDataSyncWithDependencies` free of module mocks.

- [ ] **Step 6: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/data-sync/run.test.ts
git add src/services/data-sync src/tests/unit/data-sync/run.test.ts
git commit -m "feat: orchestrate Linx and marketing sync"
```

Expected: success, partial failures, safe errors, and parallel start pass.

---

### Task 6: Manual/status APIs and the 22 UTC unified cron

**Files:**
- Create: `src/app/api/sync/route.ts`
- Create: `src/app/api/sync/status/route.ts`
- Create: `src/app/api/cron/sync/route.ts`
- Test: `src/tests/unit/api/data-sync-routes.test.ts`
- Modify: `vercel.json`
- Modify: `src/tests/unit/api/linx-cron.test.ts`
- Delete: `src/app/api/cron/linx/route.ts`

**Interfaces:**
- Produces `POST /api/sync`, `GET /api/sync/status`, and `GET /api/cron/sync`.
- Task 8 consumes the manual/status JSON.

- [ ] **Step 1: Write failing route tests**

With hoisted mocks for auth, active-organization lookup, status, and `runDataSync`, assert:

- manual POST rejects 401/403 before organization/body access;
- only an absent body or `{}` is accepted;
- active ADMIN, MANAGER, and SELLER use `MANUAL`, deadline `Date.now() + 48_000`, timeout `30_000`;
- status returns ISO `lastSuccessfulSyncAt`, `cutoffDate`, and `running`;
- concurrency maps to 409;
- cron rejects missing/invalid `CRON_SECRET` before Prisma;
- cron uses `CRON`, deadline `+48_000`, timeout `15_000`;
- failed publication returns safe non-2xx;
- `maxDuration` is 60;
- config is `[{ path: "/api/cron/sync", schedule: "0 22 * * *" }]`.

Use this success payload:

```ts
{
  cutoffDate: "2026-08-16",
  lastSuccessfulSyncAt: "2026-08-16T22:00:08.000Z",
  sources: {
    LINX: { status: "SUCCESS", durationMs: 8000, summary: {
      ordersProcessed: 2, itemsCreated: 3, itemsUpdated: 1, itemsRemoved: 0,
    } },
    META: { status: "SUCCESS", durationMs: 100, amount: "123.450000" },
    GOOGLE_PRODUCTS: { status: "SUCCESS", durationMs: 200, amount: "456.780000" },
    GOOGLE_SERVICES: { status: "SUCCESS", durationMs: 300, amount: "9.100000" },
  },
}
```

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/api/data-sync-routes.test.ts
```

Expected: FAIL because the routes are absent.

- [ ] **Step 3: Implement manual and status routes**

Manual POST calls `requireActiveUser()` first, rejects non-empty bodies, resolves `readUniqueActiveLinxOrganization()`, then calls `runDataSync`. Reuse existing safe authorization/configuration response patterns. Map `DataSyncConcurrentRunError` to 409 and `DataSyncPublicationError` to 500.

Status GET calls `requireActiveUser()`, resolves the same organization, calls `dataSyncRepository.readStatus`, and serializes only safe fields and ISO dates.

The manual route core is:

```ts
export async function POST(request: Request) {
  let user;
  try {
    user = await requireActiveUser();
  } catch (error) {
    return operationalAuthorizationResponse(error);
  }
  if (await hasInvalidBody(request)) {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
  }
  try {
    const organization = await readUniqueActiveLinxOrganization();
    const startedAt = Date.now();
    return Response.json(await runDataSync({
      organizationId: organization.id,
      requestedById: user.id,
      trigger: "MANUAL",
      deadlineAt: startedAt + 48_000,
      transactionTimeoutMs: 30_000,
    }));
  } catch (error) {
    return dataSyncErrorResponse(error);
  }
}
```

`dataSyncErrorResponse` returns 409 for active configuration/concurrency failures and 500 `{ error: "Não foi possível publicar um novo corte completo." }` for a publication failure.

- [ ] **Step 4: Implement the protected cron route**

Retain timing-safe `CRON_SECRET` comparison and export:

```ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;
```

After authorization, use the same active-organization lookup and unified service.

```ts
const startedAt = Date.now();
const result = await runDataSync({
  organizationId: organization.id,
  trigger: "CRON",
  deadlineAt: startedAt + 48_000,
  transactionTimeoutMs: 15_000,
});
return Response.json(result);
```

- [ ] **Step 5: Switch schedule and retire the Linx-only cron**

Replace `vercel.json`:

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

Delete `src/app/api/cron/linx/route.ts`. Remove its route import and schedule assertions from `linx-cron.test.ts`; the new route suite owns the cron contract. Keep authenticated `/api/linx/*` routes unchanged.

- [ ] **Step 6: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/api/data-sync-routes.test.ts src/tests/unit/api/linx-user-routes.test.ts
git add vercel.json src/app/api/sync src/app/api/cron src/tests/unit/api/data-sync-routes.test.ts src/tests/unit/api/linx-cron.test.ts
git commit -m "feat: schedule unified data synchronization"
```

Expected: both test files pass before commit.

---

### Task 7: Snapshot-backed ROAS and public report refresh

**Files:**
- Modify: `src/services/marketing-report/get-marketing-report-aggregate.ts`
- Test: `src/tests/unit/marketing-report/aggregate.test.ts`
- Modify: `src/tests/unit/api/goals-current-route.test.ts`

**Interfaces:**
- Keeps public `getMarketingReportAggregate(filters)` response shape.
- Produces an exported dependency-injected helper for tests.
- Automated current-month snapshots avoid external ad calls; legacy months retain existing fallback.

- [ ] **Step 1: Write failing snapshot precedence tests**

Create `aggregate.test.ts` and pass literal dependencies. For a snapshot containing Meta 100, Google Products 200, Google Services 50, and attributed revenue 1400, assert:

```ts
expect(result).toMatchObject({
  ok: true,
  data: {
    periodStart: "2026-08-01",
    periodEnd: "2026-08-16",
    investments: {
      meta: 100,
      googleCentroProdutos: 200,
      googleIcaraiServicos: 50,
    },
    custoTotal: 350,
    faturamentoTotal: 1400,
    roasGeral: 4,
  },
});
expect(deps.findLegacyMeta).not.toHaveBeenCalled();
expect(deps.fetchGoogleCost).not.toHaveBeenCalled();
expect(deps.aggregateRevenue).toHaveBeenCalledWith(
  new Date("2026-08-01T00:00:00.000Z"),
  new Date("2026-08-16T00:00:00.000Z"),
);
```

Add a legacy July test: no snapshot, Meta 80, Google 120 and 20, revenue 880, total cost 220, ROAS 4. Add an intraday test where the query must order by `run.finishedAt desc` and choose the later complete snapshot.

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/marketing-report/aggregate.test.ts
```

Expected: FAIL because snapshot selection and the injected helper are absent.

- [ ] **Step 3: Extract concrete dependencies**

Define:

```ts
type AutomatedSnapshot = {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  metaInvestment: Prisma.Decimal;
  googleProductsInvestment: Prisma.Decimal;
  googleServicesInvestment: Prisma.Decimal;
  createdAt: Date;
  run: { finishedAt: Date | null };
};

type LegacyMetaInvestment = {
  id: string;
  periodStart: Date;
  periodEnd: Date;
  totalInvestment: number;
  lastSyncAt: Date;
};

type MarketingReportDependencies = {
  findSnapshot(monthStart: Date | null): Promise<AutomatedSnapshot | null>;
  findLegacyMeta(monthStart: Date | null): Promise<LegacyMetaInvestment | null>;
  fetchGoogleCost(
    scope: GoogleAdsScope,
    startDate: string,
    endDate: string,
  ): Promise<number>;
  aggregateRevenue(periodStart: Date, periodEnd: Date): Promise<number>;
};
```

The production snapshot query requires `run.status: "SUCCESS"`, filters `periodStart` for a requested month, and orders by `run.finishedAt desc`, then `createdAt desc`. The revenue query preserves the existing Google/Meta origin filter and `gte/lte` date bounds.

- [ ] **Step 4: Implement automated-first selection**

Export `getMarketingReportAggregateWithDependencies(filters, deps)`. It resolves the target month, tries the newest snapshot, uses all three persisted values if found, otherwise follows the current manual-Meta plus two-live-Google path. Keep BRL formatting, public text, permission error mapping, and zero-cost ROAS behavior unchanged.

Keep `getMarketingReportAggregate(filters)` as the production wrapper used by current routes and server components.

- [ ] **Step 5: Verify the dashboard consumer**

Extend `goals-current-route.test.ts` to assert a successful aggregate ROAS is returned as `currentRoas`, while an aggregate error leaves it at zero. Assert consumer-visible JSON, not mock call existence alone.

- [ ] **Step 6: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/marketing-report/aggregate.test.ts src/tests/unit/api/goals-current-route.test.ts src/tests/unit/api/meta-investments-cache.test.ts
git add src/services/marketing-report/get-marketing-report-aggregate.ts src/tests/unit/marketing-report/aggregate.test.ts src/tests/unit/api/goals-current-route.test.ts
git commit -m "feat: publish ROAS from synchronized snapshots"
```

Expected: automated rendering makes no ad API call, and legacy/manual behavior still passes.

---

### Task 8: Unified sidebar control

**Files:**
- Create: `src/components/data-sync-control.tsx`
- Modify: `src/components/app-sidebar.tsx`
- Test: `src/tests/unit/components/data-sync-control.test.ts`
- Delete: `src/components/linx-sync-control.tsx`
- Delete: `src/tests/unit/components/linx-sync-control.test.ts`

**Interfaces:**
- Consumes `GET /api/sync/status` and `POST /api/sync`.
- Produces `DataSyncControl({ variant: "desktop" | "mobile" })`.

- [ ] **Step 1: Write failing unified-control tests**

Reuse the existing real QueryClient harness. Assert:

```ts
expect(fetchMock).toHaveBeenCalledWith("/api/sync/status");
expect(screen.getAllByRole("button", {
  name: "Sincronizar dados",
})).toHaveLength(2);
```

Resolve POST with the Task 6 payload and assert:

```ts
expect(fetchMock).toHaveBeenLastCalledWith(
  "/api/sync",
  { method: "POST" },
);
expect(toast.success).toHaveBeenCalledWith(
  "Dados atualizados até 16/08/2026: Linx, Meta e duas contas Google.",
);
expect(refresh).toHaveBeenCalledTimes(1);
```

Retain concrete tests for one deduplicated status fetch across desktop/mobile, shared mutation loading, never-synchronized text, unavailable status, 409 info toast, and server-failure recovery. Replace every Linx-only label with unified-data copy.

- [ ] **Step 2: Run RED**

```bash
npx vitest run src/tests/unit/components/data-sync-control.test.ts
```

Expected: FAIL because `DataSyncControl` is absent.

- [ ] **Step 3: Implement the component**

Adapt the existing component structure with:

```ts
const STATUS_QUERY_KEY = ["data-sync-status"] as const;
const SYNC_MUTATION_KEY = ["data-sync"] as const;
```

Use `/api/sync/status`, POST `/api/sync`, button label `Sincronizar dados`, the last complete unified timestamp, 409 through `toast.info`, other safe messages through `toast.error`, and `router.refresh()` only after success. Do not render raw source errors or amounts in the sidebar.

- [ ] **Step 4: Replace both sidebar instances and remove old files**

Replace the import with:

```ts
import { DataSyncControl } from '@/components/data-sync-control';
```

Use `DataSyncControl` for desktop and mobile. Delete the Linx-only component and test only after the new test is green.

- [ ] **Step 5: Run GREEN and commit**

```bash
npx vitest run src/tests/unit/components/data-sync-control.test.ts src/tests/unit/auth/admin-sidebar.test.ts
git add src/components/app-sidebar.tsx src/components/data-sync-control.tsx src/tests/unit/components/data-sync-control.test.ts
git rm src/components/linx-sync-control.tsx src/tests/unit/components/linx-sync-control.test.ts
git commit -m "feat: expose unified data sync control"
```

Expected: both controls share request state and update only after complete publication.

---

### Task 9: Full verification and guarded production rollout

**Files:**
- Verify all files changed in Tasks 1–8.
- Commit no production credential.

**Interfaces:**
- Produces fresh unit, integration, lint, build, live-account, report, and cron evidence.

- [ ] **Step 1: Run full unit verification**

```bash
npm test
```

Expected: exit 0, zero failures, and no token text.

- [ ] **Step 2: Run full integration verification**

```bash
npm run test:integration
```

Expected: exit 0 with schema, concurrency, and atomic publication tests executed, not skipped.

- [ ] **Step 3: Run static verification**

```bash
npx prisma validate
npm run lint
npm run build
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 4: Run a read-only Meta preflight**

Using `node --env-file=.env`, request account metadata and current-month Insights. Print only account ID, currency, timezone, requested period, and numeric spend. Never print the token or full URL.

Expected: `act_306488710441939`, BRL, `America/Sao_Paulo`, matching dates, and nonnegative spend.

- [ ] **Step 5: Run one local manual unified sync**

Start the app, authenticate as an active user, and POST an empty body to `/api/sync`. Verify four `SUCCESS` sources and cutoff equal to the current São Paulo civil date. Query the database read-only and verify one successful `DataSyncRun` references one snapshot with the same cutoff and values.

- [ ] **Step 6: Verify dashboard and public report equality**

Open `/dashboard` and `/marketing-report/current`. Compare Meta, both Google amounts, total cost, attributed Linx revenue through `periodEnd`, and `revenue / cost`. Confirm opening the public report performs no Meta or Google request.

- [ ] **Step 7: Stop before Production**

Report local evidence. Request a rotated Meta system-user token and explicit authorization to update Vercel Production and deploy. Do not reuse the disclosed token.

- [ ] **Step 8: After authorization, configure and deploy**

Verify account/project and set only the two Production variables without echoing values:

```bash
npx vercel whoami
npx vercel env ls production
npx vercel env add META_AD_ACCOUNT_ID production
npx vercel env add META_ACCESS_TOKEN production
```

Deploy through the repository's approved Git/Vercel workflow. Confirm production contains `/api/cron/sync` with `0 22 * * *`.

- [ ] **Step 9: Verify production manual and scheduled runs**

Trigger one authenticated manual run, verify its persisted successful snapshot, and compare the public report with all three platforms. After the next 22 UTC hour, verify a successful `CRON` run and inspect Vercel runtime logs for `/api/cron/sync`, confirming no token or raw response appears.

---

## Implementation References

- Approved design: `docs/superpowers/specs/2026-08-16-unified-linx-marketing-sync-design.md`
- Meta Insights: `https://developers.facebook.com/docs/marketing-api/reference/ad-account/insights/`
- Google Ads Node client: `https://github.com/Opteo/google-ads-api`
- Vercel Cron Jobs: `https://vercel.com/docs/cron-jobs`
