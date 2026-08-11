# Linx Product 1314 Exclusion and Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exclude Linx product `1314` from canonical sales and complete the authorized incremental recovery against the active database.

**Architecture:** Filter the completed authoritative movement snapshot in the Linx orchestrator before catalog loading and canonical mapping. Preserve all cursor watermarks and all non-ignored movements, then run the normal production synchronization entrypoint once with an extended recovery deadline and verify the persisted run and cursors.

**Tech Stack:** TypeScript, Vitest, Prisma 6, Next.js 16, Linx Microvix XML API.

## Global Constraints

- Ignore only movements whose `productCode` is exactly `1314`.
- Apply the exclusion after authoritative completion and before catalog loading or canonical mapping.
- Preserve every other item in mixed orders.
- Produce no canonical sale for an order left without importable movements.
- Do not manually edit any Linx cursor.
- Keep authentication, contract, pagination, catalog and persistence failures for every other value unchanged.
- Run the full Linx unit suite, lint and build before the real database write.
- The real recovery may use up to five minutes and must use the existing atomic persistence path.

---

### Task 1: Filter the ignored product at the orchestration boundary

**Files:**
- Modify: `src/tests/unit/linx/sync.test.ts`
- Modify: `src/services/linx/sync.ts:299-330`

**Interfaces:**
- Consumes: `ValidatedLinxRows.movements: LinxMovement[]`, `SyncDependencies.loadMissingCatalogs`, and `SyncDependencies.mapCanonicalSales`.
- Produces: completed collection data whose catalog and canonical mapping inputs omit `productCode === 1314` while cursor outputs remain unchanged.

- [ ] **Step 1: Write the failing regression test**

Add the real mapper import:

```ts
import { mapCanonicalSales as mapLinxCanonicalSales } from "@/services/linx/sync-adapter";
```

Add this test inside `describe("runLinxSync", ...)` after the payment-only materialization test. The production change that makes this test pass is filtering completed movements before the catalog call; without that change, the fake catalog boundary deliberately throws when it receives product `1314`.

```ts
it("omits product 1314 before catalogs while preserving allowed items", async () => {
  const deps = makeSyncDeps();
  const mixedIdentifier = "10000000-0000-4000-8000-000000000001";
  const ignoredOnlyIdentifier = "10000000-0000-4000-8000-000000000002";
  const movement = {
    timestamp: BigInt(44),
    documentNumber: "mixed-order",
    launchDate: "2026-08-05",
    customerCode: null,
    sellerCode: 5,
    quantity: 1,
    unitValue: 10,
    totalValue: 10,
    cancelled: false,
    excluded: false,
    operationalOriginCode: null,
    natureOperation: "[S] VENDA DE PRODUTOS",
    operationType: "S",
  };
  const completed = {
    movements: [
      {
        ...movement,
        identificador: mixedIdentifier,
        productCode: 1314,
        order: 1,
      },
      {
        ...movement,
        identificador: mixedIdentifier,
        productCode: 6,
        order: 2,
      },
      {
        ...movement,
        identificador: ignoredOnlyIdentifier,
        documentNumber: "ignored-only-order",
        productCode: 1314,
        order: 1,
      },
    ],
    paymentLabels: new Map<string, string>(),
    principals: new Map<string, number | null>(),
    routineOrigins: new Map<number, string>(),
    salesResponses: new Map<number, string>(),
    origins: new Map([
      [mixedIdentifier, { operationalOrigin: "Loja", commercialOrigin: null }],
      [ignoredOnlyIdentifier, { operationalOrigin: "Loja", commercialOrigin: null }],
    ]),
  };
  deps.validateRows.mockReturnValue({ ...completed, movements: [] });
  deps.completeRows.mockResolvedValue(completed);
  deps.loadMissingCatalogs.mockImplementation(async (_cnpj, movements) => {
    if (movements.some(({ productCode }) => productCode === 1314)) {
      throw new Error("ignored product reached catalogs");
    }
    return {
      customers: new Map(),
      sellers: new Map([[5, { externalCode: 5, name: "Ada" }]]),
      products: new Map([
        [
          6,
          {
            productCode: 6,
            description: "Allowed product",
            brand: "Brand",
            sector: "Sector",
          },
        ],
      ]),
    };
  });
  deps.mapCanonicalSales.mockImplementation(mapLinxCanonicalSales);

  const collected = await collectLinxData(input, deps);

  expect(collected.sales).toHaveLength(1);
  expect(collected.sales[0]).toMatchObject({
    linxIdentifier: mixedIdentifier,
    items: [{ productCode: 6, linxOrder: 2 }],
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/tests/unit/linx/sync.test.ts -t "omits product 1314"
```

Expected: FAIL because `loadMissingCatalogs` receives product `1314` and throws `ignored product reached catalogs`.

- [ ] **Step 3: Implement the minimal production filter**

Add this constant near the other Linx synchronization constants in `src/services/linx/sync.ts`:

```ts
const IGNORED_LINX_PRODUCT_CODES = new Set([1314]);
```

In `collectLinxData`, immediately after `completeRows`, construct the filtered completed rows and use them for catalogs and mapping:

```ts
const importable = {
  ...completed,
  movements: completed.movements.filter(
    ({ productCode }) => !IGNORED_LINX_PRODUCT_CODES.has(productCode),
  ),
};
deps.deadline.assert();
await stage("CATALOGS");
const catalogs = await deps.loadMissingCatalogs(
  organization.linxCnpj,
  importable.movements,
  { mode: input.mode },
);
deps.deadline.assert();
await stage("MAPPING");
const sales = deps.mapCanonicalSales({
  organizationExternalCode: organization.external_code,
  ...importable,
  catalogs,
});
```

Do not filter raw API rows, cursor values, payment labels, principals, origins, or any code other than `1314`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
npm test -- src/tests/unit/linx/sync.test.ts -t "omits product 1314"
```

Expected: PASS with one canonical mixed order containing only product `6`.

- [ ] **Step 5: Run the Linx unit suite**

Run:

```bash
npm test -- src/tests/unit/linx src/tests/unit/api/linx-cron.test.ts src/tests/unit/api/linx-user-routes.test.ts src/tests/unit/api/linx-admin-routes.test.ts
```

Expected: all selected test files pass with zero failures.

- [ ] **Step 6: Commit the tested behavior**

```bash
git add src/services/linx/sync.ts src/tests/unit/linx/sync.test.ts
git commit -m "fix: ignore unavailable Linx product 1314"
```

---

### Task 2: Verify the production artifact before recovery

**Files:**
- Verify only: `src/services/linx/sync.ts`
- Verify only: `src/tests/unit/linx/sync.test.ts`

**Interfaces:**
- Consumes: repository scripts `test`, `lint`, and `build`.
- Produces: a verified Next.js production build containing the targeted exclusion.

- [ ] **Step 1: Run the complete test suite**

Run:

```bash
npm test
```

Expected: exit code `0` and zero failing tests.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code `0` with no ESLint errors.

- [ ] **Step 3: Build the production application**

Run:

```bash
npm run build
```

Expected: exit code `0`; Prisma generation and the Next.js production build both complete.

- [ ] **Step 4: Confirm the committed scope**

Run:

```bash
git diff --check HEAD~1 HEAD
git show --stat --oneline HEAD
git status --short
```

Expected: no whitespace errors; the behavior commit contains only `sync.ts` and `sync.test.ts`; the worktree is clean except for any unrelated user-owned changes discovered before implementation.

---

### Task 3: Execute and verify the authorized database recovery

**Files:**
- No repository file changes.
- External writes: active application database through `runLinxSync`.

**Interfaces:**
- Consumes: `.env` Linx credentials and database connection, `runLinxSync(input: SyncInput)`, one active `Organization`, and the existing atomic repository.
- Produces: one `LinxSyncRun` triggered as `RETRY`, updated sales excluding product `1314`, and five advanced `LinxSyncCursor` rows.

- [ ] **Step 1: Capture the pre-recovery state without exposing credentials or customer data**

Run a read-only Prisma query that prints the latest run status, the five cursor timestamps and their update times, and the count of Linx-linked items using product `1314`. Save these literal values in the execution notes for the post-recovery comparison.

```bash
node <<'NODE'
process.loadEnvFile('.env');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const organization = await prisma.organization.findFirstOrThrow({
    where: { linxSyncEnabled: true },
    select: { id: true },
  });
  const [run, cursors, ignoredItems] = await Promise.all([
    prisma.linxSyncRun.findFirst({
      where: { organizationId: organization.id },
      orderBy: { startedAt: 'desc' },
      select: { status: true, stage: true, startedAt: true, finishedAt: true },
    }),
    prisma.linxSyncCursor.findMany({
      where: { organizationId: organization.id },
      orderBy: { method: 'asc' },
      select: { method: true, lastTimestamp: true, updatedAt: true },
    }),
    prisma.saleItem.count({
      where: {
        product: { external_code: 1314 },
        sale: { organizationId: organization.id, linxIdentifier: { not: null } },
      },
    }),
  ]);
  console.log(JSON.stringify({
    run,
    cursors: cursors.map((cursor) => ({
      ...cursor,
      lastTimestamp: cursor.lastTimestamp.toString(),
    })),
    ignoredItems,
  }, null, 2));
})().finally(() => prisma.$disconnect());
NODE
```

- [ ] **Step 2: Verify the TypeScript recovery entrypoint can be loaded without writing**

Run:

```bash
NODE_OPTIONS='--conditions=react-server' npx --yes tsx -e '
import("./src/services/linx/sync.ts").then(({ runLinxSync }) => {
  console.log(JSON.stringify({ loaded: typeof runLinxSync === "function" }));
});
'
```

Expected: `{"loaded":true}`. If loading fails, stop without writing and use the existing authenticated cron route only after adding and testing an explicit recovery-budget input; do not create a test file that writes to the active database.

- [ ] **Step 3: Run the real incremental recovery once**

Run the production entrypoint with a five-minute absolute deadline. This is the authorized external write.

```bash
NODE_OPTIONS='--conditions=react-server' npx --yes tsx -e '
process.loadEnvFile(".env");
(async () => {
  const { prisma } = await import("./src/lib/prisma.ts");
  const { runLinxSync } = await import("./src/services/linx/sync.ts");
  const organizations = await prisma.organization.findMany({
    where: { linxSyncEnabled: true },
    take: 2,
    select: { id: true },
  });
  if (organizations.length !== 1) {
    throw new Error("Expected exactly one active Linx organization");
  }
  const startedAt = Date.now();
  try {
    const summary = await runLinxSync({
      organizationId: organizations[0].id,
      trigger: "RETRY",
      mode: "INCREMENTAL",
      deadlineAt: startedAt + 300_000,
      transactionTimeoutMs: 120_000,
    });
    console.log(JSON.stringify({ ok: true, summary }));
  } finally {
    await prisma.$disconnect();
  }
})();
'
```

Expected: one JSON result with `ok: true`. Do not rerun automatically if it fails; inspect the newly persisted failed run and return to systematic diagnosis.

- [ ] **Step 4: Verify the post-recovery state**

Run this read-only comparison query:

```bash
node <<'NODE'
process.loadEnvFile('.env');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const organization = await prisma.organization.findFirstOrThrow({
    where: { linxSyncEnabled: true },
    select: { id: true },
  });
  const [run, cursors, runningRuns, ignoredItems] = await Promise.all([
    prisma.linxSyncRun.findFirst({
      where: { organizationId: organization.id },
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        trigger: true,
        status: true,
        stage: true,
        failureStage: true,
        processedOrders: true,
        processedItems: true,
        errorMessage: true,
        startedAt: true,
        finishedAt: true,
      },
    }),
    prisma.linxSyncCursor.findMany({
      where: { organizationId: organization.id },
      orderBy: { method: 'asc' },
      select: { method: true, lastTimestamp: true, updatedAt: true },
    }),
    prisma.linxSyncRun.count({
      where: { organizationId: organization.id, status: 'RUNNING' },
    }),
    prisma.saleItem.count({
      where: {
        product: { external_code: 1314 },
        sale: { organizationId: organization.id, linxIdentifier: { not: null } },
      },
    }),
  ]);
  console.log(JSON.stringify({
    run,
    cursors: cursors.map((cursor) => ({
      ...cursor,
      lastTimestamp: cursor.lastTimestamp.toString(),
    })),
    runningRuns,
    ignoredItems,
  }, null, 2));
})().finally(() => prisma.$disconnect());
NODE
```

Expected:

- Latest run has `trigger: RETRY`, `status: SUCCESS`, `stage: COMPLETED`, a non-null `finishedAt`, and no error.
- All five cursors have `updatedAt` later than the pre-recovery snapshot and monotonic `lastTimestamp` values.
- No `RUNNING` Linx run remains.
- The ignored-product item count does not increase.

- [ ] **Step 5: Run a no-op incremental confirmation**

Run the production entrypoint once more with a 60-second deadline and `transactionTimeoutMs: 30_000`:

```bash
NODE_OPTIONS='--conditions=react-server' npx --yes tsx -e '
process.loadEnvFile(".env");
(async () => {
  const { prisma } = await import("./src/lib/prisma.ts");
  const { runLinxSync } = await import("./src/services/linx/sync.ts");
  const organizations = await prisma.organization.findMany({
    where: { linxSyncEnabled: true },
    take: 2,
    select: { id: true },
  });
  if (organizations.length !== 1) {
    throw new Error("Expected exactly one active Linx organization");
  }
  const startedAt = Date.now();
  try {
    const summary = await runLinxSync({
      organizationId: organizations[0].id,
      trigger: "RETRY",
      mode: "INCREMENTAL",
      deadlineAt: startedAt + 60_000,
      transactionTimeoutMs: 30_000,
    });
    console.log(JSON.stringify({ ok: true, summary }));
  } finally {
    await prisma.$disconnect();
  }
})();
'
```

Expected: success with zero or only genuinely new orders, completing well inside the normal budget. If the result is not a no-op because new Linx activity arrived, verify that its cursor values still advance monotonically and that it succeeds.

- [ ] **Step 6: Record final repository and database state**

Run:

```bash
git status --short
git log -n 3 --oneline
```

Expected: no recovery-only source files and no uncommitted implementation changes. Report the two commit IDs, recovery run ID, processed totals, cursor update timestamps, ignored-item count before/after, and verification command results.
