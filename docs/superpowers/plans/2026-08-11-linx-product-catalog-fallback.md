# Linx Product Catalog Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compute every valid Linx sale item even when `LinxProdutos` omits its product, preferring known local metadata, tracking unresolved products, and recovering the omitted product `1314` items from 2026-08-05 and 2026-08-06.

**Architecture:** Add explicit `KNOWN`/`PENDING` catalog state to `Product` and carry that state through canonical sale items so the existing atomic sales transaction persists product resolution together with sales and cursors. Incremental and reconciliation catalog loading will reuse `KNOWN` local products, retry `PENDING` products through Linx, and create code-specific fallback entries only for successful empty responses. The administrative status endpoint will expose pending codes, and reconciliation preview will accept an optional validated period so the production recovery is restricted to the two diagnosed dates.

**Tech Stack:** TypeScript, Next.js 16 App Router, Prisma 6/PostgreSQL, Vitest 4, Zod, Linx XML API.

## Global Constraints

- Preserve the exact external product code, quantity, unit price, total value, Linx item order, and Linx timestamp from authoritative movements.
- Use `Produto não identificado — código <code>` / `Não informado` / `Não informado` only after a successful exact-code `LinxProdutos` lookup returns zero rows.
- Authentication, permission, timeout, transport, XML parsing, mismatched-code, and conflicting-row failures remain fatal.
- Existing products, including product `1314`, migrate to `KNOWN` and keep their current metadata.
- Missing customers and sellers remain fatal; no fallback party records are introduced.
- Product writes, sale writes, all five cursor writes, and successful-run state remain in one existing Prisma transaction.
- Administrative pending-product output contains product code, fallback description, and last successful check time only.
- Remove the hard-coded product `1314` exclusion before running reconciliation.
- Do not hard-code the diagnosed eleven items into application behavior; counts are recovery assertions only.
- The pre-existing `src/tests/unit/api/linx-cron.test.ts` expectation for the removed Google cron stays outside this scope.

## File Structure

- `prisma/schema.prisma`: define `ProductCatalogStatus` and catalog lifecycle fields on `Product`.
- `prisma/migrations/20260811193000_add_product_catalog_status/migration.sql`: forward-only bounded migration that marks existing products `KNOWN`.
- `src/services/sales-import/contracts.ts`: carry optional product catalog lifecycle metadata on canonical items.
- `src/services/sales-import/upsert-dimensions.ts`: persist Linx state and let trusted CSV data resolve only pending products.
- `src/services/linx/sync-adapter.ts`: resolve known local products, exact Linx responses, and successful empty-response fallback products.
- `src/services/linx/sync-runtime.ts`: read persisted product catalog state.
- `src/services/linx/sync.ts`: remove the temporary exclusion and emit one safe warning per pending code.
- `src/services/linx/reconciliation.ts`: validate and consume an optional explicit reconciliation period.
- `src/services/linx/admin-runtime.ts`: issue preview authorization for the selected period.
- `src/app/api/admin/linx/reconciliation/preview/route.ts`: accept the optional period from an admin request.
- `src/app/api/admin/linx/status/route.ts`: expose pending catalog entries to administrators.
- Focused tests under `src/tests/unit/linx`, `src/tests/unit/api`, `src/tests/unit/sales-import`, and `src/tests/integration` cover state transitions, API contracts, atomicity, and schema behavior.

---

### Task 1: Persist Product Catalog Lifecycle State

**Files:**
- Create: `prisma/migrations/20260811193000_add_product_catalog_status/migration.sql`
- Create: `src/tests/unit/linx/product-catalog-migration-contract.test.ts`
- Modify: `prisma/schema.prisma:101-110`
- Modify: `src/services/sales-import/contracts.ts:12-24`
- Modify: `src/services/sales-import/upsert-dimensions.ts:79-101`
- Modify: `src/tests/unit/sales-import/import-sales.test.ts:30-45,120-150,335-365`
- Modify: `src/tests/integration/prisma/linx-schema.test.ts:13-34`

**Interfaces:**
- Consumes: existing `Product.external_code` uniqueness and `CanonicalSaleItem` metadata.
- Produces: Prisma enum `ProductCatalogStatus`, optional canonical fields `catalogStatus`, `catalogLastCheckedAt`, and `catalogResolvedAt`, plus atomic product state transitions in `upsertProduct`.

- [ ] **Step 1: Write failing sales-import lifecycle tests**

Extend the product delegate in `makeTransactionDouble`:

```ts
product: {
  upsert: vi.fn(async () => {
    calls.push("product.upsert");
    return { id: "product-1" };
  }),
  updateMany: vi.fn(async () => {
    calls.push("product.updateMany");
    return { count: 1 };
  }),
},
```

Add these tests to `src/tests/unit/sales-import/import-sales.test.ts`:

```ts
it("persists a pending Linx product with its successful check time", async () => {
  const tx = makeTransactionDouble();
  const checkedAt = new Date("2026-08-11T12:00:00.000Z");

  await importSales(tx as never, [
    makeCanonicalSale({
      source: "LINX",
      linxIdentifier: crypto.randomUUID(),
      items: [makeCanonicalItem({
        linxOrder: 1,
        catalogStatus: "PENDING",
        catalogLastCheckedAt: checkedAt,
        catalogResolvedAt: null,
      })],
    }),
  ]);

  expect(tx.product.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      update: expect.objectContaining({
        catalogStatus: "PENDING",
        catalogLastCheckedAt: checkedAt,
        catalogResolvedAt: null,
      }),
      create: expect.objectContaining({ catalogStatus: "PENDING" }),
    }),
  );
});

it("lets CSV metadata resolve only a pending product", async () => {
  const tx = makeTransactionDouble();
  await importSales(tx as never, [makeCanonicalSale()]);

  expect(tx.product.updateMany).toHaveBeenCalledWith({
    where: { id: "product-1", catalogStatus: "PENDING" },
    data: expect.objectContaining({
      description: "Produto CSV",
      brand: "Marca CSV",
      sector: "Setor CSV",
      catalogStatus: "KNOWN",
      catalogResolvedAt: expect.any(Date),
    }),
  });
});
```

- [ ] **Step 2: Run the focused tests and verify the new contract fails**

Run:

```bash
npm test -- src/tests/unit/sales-import/import-sales.test.ts -t "pending Linx product|resolve only a pending product"
```

Expected: FAIL because canonical items and `upsertProduct` do not carry catalog lifecycle fields.

- [ ] **Step 3: Add the schema and a failing migration contract test**

Add the enum and these three fields/index to the existing `Product` model in `prisma/schema.prisma`:

```prisma
enum ProductCatalogStatus {
  KNOWN
  PENDING
}

catalogStatus        ProductCatalogStatus @default(KNOWN)
catalogLastCheckedAt DateTime?
catalogResolvedAt    DateTime?

@@index([catalogStatus])
```

Create `src/tests/unit/linx/product-catalog-migration-contract.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "prisma/migrations/20260811193000_add_product_catalog_status/migration.sql",
);

describe("product catalog status migration", () => {
  it("keeps additive DDL atomic and builds the index concurrently after commit", () => {
    const sql = readFileSync(migrationPath, "utf8");
    const beginIndex = sql.indexOf("BEGIN;");
    const alterTableIndex = sql.indexOf('ALTER TABLE "Product"');
    const commitIndex = sql.indexOf("COMMIT;");
    const concurrentIndex = sql.indexOf(
      'CREATE INDEX CONCURRENTLY "Product_catalogStatus_idx"',
    );

    expect(sql).toMatch(
      /^BEGIN;\n\nSET LOCAL lock_timeout = '5s';\nSET LOCAL statement_timeout = '60s';/,
    );
    expect(sql).toContain(
      `CREATE TYPE "ProductCatalogStatus" AS ENUM ('KNOWN', 'PENDING')`,
    );
    expect(sql).toContain(
      `"catalogStatus" "ProductCatalogStatus" NOT NULL DEFAULT 'KNOWN'`,
    );
    expect(sql).toContain('"catalogLastCheckedAt" TIMESTAMP(3)');
    expect(sql).toContain('"catalogResolvedAt" TIMESTAMP(3)');
    expect(sql).not.toMatch(/DROP TABLE|DROP COLUMN|TRUNCATE|DELETE FROM/i);
    expect(beginIndex).toBe(0);
    expect(commitIndex).toBeGreaterThan(alterTableIndex);
    expect(concurrentIndex).toBeGreaterThan(commitIndex);
    expect(sql.match(/\bBEGIN;/g)).toHaveLength(1);
    expect(sql.match(/\bCOMMIT;/g)).toHaveLength(1);
  });
});
```

Run this test before creating the migration and expect it to fail because the SQL file does not exist.

- [ ] **Step 4: Create the migration and generate Prisma**

Create the exact forward migration:

```sql
BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

CREATE TYPE "ProductCatalogStatus" AS ENUM ('KNOWN', 'PENDING');

ALTER TABLE "Product"
ADD COLUMN "catalogStatus" "ProductCatalogStatus" NOT NULL DEFAULT 'KNOWN',
ADD COLUMN "catalogLastCheckedAt" TIMESTAMP(3),
ADD COLUMN "catalogResolvedAt" TIMESTAMP(3);

COMMIT;

-- PostgreSQL requires concurrent index builds to run outside a transaction block.
CREATE INDEX CONCURRENTLY "Product_catalogStatus_idx"
ON "Product"("catalogStatus");
```

The enum and columns remain inside the explicit bounded transaction. Prisma does not add an implicit transaction around PostgreSQL migration files, so the statement after `COMMIT` remains non-transactional as required by `CREATE INDEX CONCURRENTLY`.

Apply this migration in a controlled deployment window with no other schema migration running. The application may remain online because the concurrent build does not block normal writes, but it can wait for existing transactions. Verify `Product_catalogStatus_idx` is valid after deployment. If the concurrent build fails, the enum and columns are already committed and PostgreSQL may leave an invalid index; do not rerun the whole migration blindly. Remove or rebuild the invalid index outside a transaction, then reconcile the Prisma migration state through the approved deployment procedure.

Run:

```bash
npx prisma validate
npx prisma generate
```

Expected: both commands exit `0`.

- [ ] **Step 5: Carry catalog state through canonical items and upserts**

Add to `CanonicalSaleItem`:

```ts
catalogStatus?: "KNOWN" | "PENDING";
catalogLastCheckedAt?: Date | null;
catalogResolvedAt?: Date | null;
```

Update `upsertProduct`:

```ts
const metadata = {
  description: item.description,
  brand: item.brand,
  sector: item.sector,
};
const catalogState = {
  ...(item.catalogStatus !== undefined
    ? { catalogStatus: item.catalogStatus }
    : {}),
  ...(item.catalogLastCheckedAt !== undefined
    ? { catalogLastCheckedAt: item.catalogLastCheckedAt }
    : {}),
  ...(item.catalogResolvedAt !== undefined
    ? { catalogResolvedAt: item.catalogResolvedAt }
    : {}),
};
const product = await tx.product.upsert({
  where: { external_code: item.productCode },
  update: source === "LINX" ? { ...metadata, ...catalogState } : {},
  create: { external_code: item.productCode, ...metadata, ...catalogState },
});
if (source === "CSV") {
  await tx.product.updateMany({
    where: { id: product.id, catalogStatus: "PENDING" },
    data: {
      ...metadata,
      catalogStatus: "KNOWN",
      catalogResolvedAt: new Date(),
    },
  });
}
return product;
```

- [ ] **Step 6: Add the integration default assertion**

Add this guarded integration test:

```ts
it("defaults existing-style products to a known catalog state", async () => {
  let productId: string | undefined;
  try {
    const product = await prisma!.product.create({
      data: {
        external_code: 2_000_000_000 + Math.floor(Math.random() * 100_000),
        description: "Produto de contrato",
        brand: "Marca",
        sector: "Setor",
      },
    });
    productId = product.id;
    expect(product.catalogStatus).toBe("KNOWN");
    expect(product.catalogLastCheckedAt).toBeNull();
    expect(product.catalogResolvedAt).toBeNull();
  } finally {
    if (productId) await prisma!.product.delete({ where: { id: productId } });
  }
});
```

Keep the existing `TEST_DATABASE_URL` guard.

- [ ] **Step 7: Verify and commit Task 1**

Run:

```bash
npm test -- src/tests/unit/linx/product-catalog-migration-contract.test.ts src/tests/unit/sales-import/import-sales.test.ts
npm run build
```

Expected: focused tests and build pass.

Commit:

```bash
git add prisma/schema.prisma prisma/migrations/20260811193000_add_product_catalog_status/migration.sql src/services/sales-import/contracts.ts src/services/sales-import/upsert-dimensions.ts src/tests/unit/linx/product-catalog-migration-contract.test.ts src/tests/unit/sales-import/import-sales.test.ts src/tests/integration/prisma/linx-schema.test.ts
git commit -m "feat: track pending product catalogs"
```

---

### Task 2: Resolve Known, Missing, and Pending Linx Products

**Files:**
- Modify: `src/services/linx/sync-adapter.ts:41-50,80-85,699-810`
- Modify: `src/services/linx/sync-runtime.ts:52-92`
- Modify: `src/tests/unit/linx/sync-adapter.test.ts:430-610`
- Modify: `src/tests/unit/linx/sync-runtime.test.ts:1-35`

**Interfaces:**
- Consumes: canonical lifecycle fields and generated Prisma product fields from Task 1.
- Produces: `loadMissingCatalogs(...) => Promise<LinxCatalogs>` whose production product entries carry explicit `KNOWN` or `PENDING` state.

- [ ] **Step 1: Add a valid movement helper and failing resolution tests**

Add this helper to `src/tests/unit/linx/sync-adapter.test.ts`:

```ts
function movementFixture(overrides: Partial<LinxMovement> = {}): LinxMovement {
  return {
    identificador: "7c0ab11c-95b6-4e14-8186-bb5292198ff1",
    timestamp: BigInt(1),
    documentNumber: "1",
    launchDate: "2026-08-11",
    customerCode: null,
    sellerCode: 5,
    productCode: 6,
    quantity: 1,
    unitValue: 10,
    totalValue: 10,
    cancelled: false,
    excluded: false,
    order: 1,
    operationalOriginCode: null,
    natureOperation: "Venda",
    operationType: "S",
    ...overrides,
  };
}
```

Import `LinxMovement` as a type. Add a test where `readProducts` returns:

```ts
{
  productCode: 1314,
  description: "S.O. WINDOWS 11 PRO 32/64 BITS OEM (FQC-10529)",
  brand: "MICROSSOFT",
  sector: "ACESSORIOS OFFICE",
  catalogStatus: "KNOWN",
  catalogLastCheckedAt: null,
  catalogResolvedAt: null,
}
```

Call incremental `loadMissingCatalogs` with `movementFixture({ productCode: 1314 })`. Make `execute` serve the required seller and throw if `LinxProdutos` is called. Assert the known local metadata is returned and `readProducts` received `[1314]`.

Add a second test where local products are empty and the seller lookup succeeds while `LinxProdutos` returns `{ columns: [], rows: [] }`. Assert:

```ts
expect(loaded.products.get(9999)).toEqual({
  productCode: 9999,
  description: "Produto não identificado — código 9999",
  brand: "Não informado",
  sector: "Não informado",
  catalogStatus: "PENDING",
  catalogLastCheckedAt: new Date("2026-08-11T12:00:00.000Z"),
  catalogResolvedAt: null,
});
```

Add a third test where local code `9999` is `PENDING` and the point lookup returns one exact row:

```ts
it("retries a PENDING local product and resolves it from Linx", async () => {
  const checkedAt = new Date("2026-08-11T12:00:00.000Z");
  const adapters = createLinxDataAdapters({
    execute: async (command) => {
      if (command.name === "LinxVendedores") {
        return {
          columns: ["cod_vendedor", "nome_vendedor"],
          rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
        };
      }
      return {
        columns: ["cod_produto", "nome", "desc_marca", "desc_setor"],
        rows: [{
          cod_produto: "9999",
          nome: "Produto resolvido",
          desc_marca: "Marca real",
          desc_setor: "Setor real",
        }],
      };
    },
    catalogReader: {
      ...emptyCatalogReader,
      readProducts: async () => [{
        productCode: 9999,
        description: "Produto não identificado — código 9999",
        brand: "Não informado",
        sector: "Não informado",
        catalogStatus: "PENDING",
        catalogLastCheckedAt: new Date("2026-08-10T12:00:00.000Z"),
        catalogResolvedAt: null,
      }],
    },
    deadline: createDeadline(() => 1_000, 10_000),
    nowDate: () => checkedAt,
  });

  const loaded = await adapters.loadMissingCatalogs(
    "11222333000144",
    [movementFixture({ productCode: 9999 })],
  );
  expect(loaded.products.get(9999)).toMatchObject({
    description: "Produto resolvido",
    catalogStatus: "KNOWN",
    catalogLastCheckedAt: checkedAt,
    catalogResolvedAt: checkedAt,
  });
});
```

- [ ] **Step 2: Run the new tests and verify failure**

Run:

```bash
npm test -- src/tests/unit/linx/sync-adapter.test.ts -t "KNOWN local product|code-specific PENDING|retries a PENDING"
```

Expected: FAIL because incremental mode does not read local products and empty product results throw `LinxDataError`.

- [ ] **Step 3: Expand the catalog type and runtime reader**

Extend `ProductCatalogEntry` without making lifecycle fields required for old fixtures:

```ts
type ProductCatalogEntry = Pick<
  CanonicalSaleItem,
  | "productCode"
  | "description"
  | "brand"
  | "sector"
  | "catalogStatus"
  | "catalogLastCheckedAt"
  | "catalogResolvedAt"
>;
```

Update `buildCatalogReader(...).readProducts(...)` to select:

```ts
select: {
  external_code: true,
  description: true,
  brand: true,
  sector: true,
  catalogStatus: true,
  catalogLastCheckedAt: true,
  catalogResolvedAt: true,
}
```

Return all selected lifecycle fields. Add `product.findMany` to the runtime Prisma mock and assert the exact selection and mapped result.

```ts
prismaMock.product.findMany.mockResolvedValue([{
  external_code: 1314,
  description: "Produto local",
  brand: "Marca",
  sector: "Setor",
  catalogStatus: "KNOWN",
  catalogLastCheckedAt: null,
  catalogResolvedAt: null,
}]);
const products = await buildCatalogReader("org-1").readProducts([1314]);
expect(prismaMock.product.findMany).toHaveBeenCalledWith({
  where: { external_code: { in: [1314] } },
  select: expect.objectContaining({
    catalogStatus: true,
    catalogLastCheckedAt: true,
    catalogResolvedAt: true,
  }),
});
expect(products[0]).toMatchObject({ productCode: 1314, catalogStatus: "KNOWN" });
```

- [ ] **Step 4: Load products locally in both modes**

Replace the reconciliation-only product read with:

```ts
input.deadline.assert();
const persistedProducts = await input.catalogReader.readProducts(productCodes);
let persistedCustomers: CanonicalParty[] = [];
let persistedSellers: CanonicalSeller[] = [];
if (scope.mode === "RECONCILIATION") {
  [persistedCustomers, persistedSellers] = await Promise.all([
    input.catalogReader.readCustomers(customerCodes),
    input.catalogReader.readSellers(sellerCodes),
  ]);
}
input.deadline.assert();

const products = new Map(
  persistedProducts
    .filter((product) => (product.catalogStatus ?? "KNOWN") === "KNOWN")
    .map((product) => [product.productCode, product]),
);
```

Do not change persisted customer/seller behavior.

Rename the existing incremental test from “refreshes incremental catalogs instead of trusting persisted reconciliation fallbacks” to “refreshes incremental parties while reusing a known local product”. Keep the Linx customer and seller expectations, change the product expectation to `Produto persistido`, and change the point-call count from three to two.

- [ ] **Step 5: Implement exact-code fallback and conflict detection**

In the product lookup loop, let errors from `executePoint` and `mapCatalogs` propagate. For a valid empty row array, insert the approved `PENDING` metadata with `checkedAt = input.nowDate()`.

For non-empty rows, parse each row independently:

```ts
const candidates = response.rows.map((row) => {
  const mapped = mapCatalogs({
    customers: [],
    sellers: [],
    products: [row],
  }).products;
  const candidate = mapped.get(productCode);
  if (!candidate || mapped.size !== 1) throw new LinxDataError();
  return candidate;
});
const [product, ...duplicates] = candidates;
if (
  !product ||
  duplicates.some(
    (candidate) =>
      candidate.description !== product.description ||
      candidate.brand !== product.brand ||
      candidate.sector !== product.sector,
  )
) {
  throw new LinxDataError();
}
products.set(productCode, {
  ...product,
  catalogStatus: "KNOWN",
  catalogLastCheckedAt: checkedAt,
  catalogResolvedAt: checkedAt,
});
```

Identical duplicate rows are accepted; mismatched codes or conflicting metadata are fatal.

- [ ] **Step 6: Add failure-separation tests**

Add failure-separation cases using the same valid movement fixture:

```ts
const authFailure = new LinxAuthError();
const authAdapters = createLinxDataAdapters({
  execute: async (command) => {
    if (command.name === "LinxVendedores") {
      return {
        columns: ["cod_vendedor", "nome_vendedor"],
        rows: [{ cod_vendedor: "5", nome_vendedor: "Bia" }],
      };
    }
    throw authFailure;
  },
  catalogReader: emptyCatalogReader,
  deadline: createDeadline(() => 1_000, 10_000),
  nowDate: () => new Date("2026-08-11T12:00:00.000Z"),
});
await expect(
  authAdapters.loadMissingCatalogs(
    "11222333000144",
    [movementFixture({ productCode: 9999 })],
  ),
).rejects.toBe(authFailure);
```

For the wrong-code case return `cod_produto: "9998"` for requested `9999`. For the conflict case return two `9999` rows named `Produto A` and `Produto B`. Assert both reject with `LinxDataError`; neither path catches or converts the error.

- [ ] **Step 7: Verify and commit Task 2**

Run:

```bash
npm test -- src/tests/unit/linx/sync-adapter.test.ts src/tests/unit/linx/sync-runtime.test.ts
```

Expected: both files pass.

Commit:

```bash
git add src/services/linx/sync-adapter.ts src/services/linx/sync-runtime.ts src/tests/unit/linx/sync-adapter.test.ts src/tests/unit/linx/sync-runtime.test.ts
git commit -m "feat: resolve missing Linx products safely"
```

---

### Task 3: Compute Product 1314 and Warn on Pending Catalogs

**Files:**
- Modify: `src/services/linx/sync.ts:48-55,179-190,314-339`
- Modify: `src/tests/unit/linx/sync.test.ts:275-345`

**Interfaces:**
- Consumes: catalog lifecycle metadata mapped onto canonical items by Task 2.
- Produces: complete canonical sales with no product exclusion and one safe warning per unique pending code per run.

- [ ] **Step 1: Replace the temporary-exclusion regression**

Replace `omits product 1314 before catalogs while preserving allowed items` with `computes product 1314 from known local metadata`. Keep one mixed order (`1314` and `6`) and one order containing only `1314`. Return known catalogs for both codes and use `mapLinxCanonicalSales`.

Assert:

```ts
expect(collected.sales).toHaveLength(2);
expect(collected.sales).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      linxIdentifier: mixedIdentifier,
      items: expect.arrayContaining([
        expect.objectContaining({ productCode: 1314, linxOrder: 1 }),
        expect.objectContaining({ productCode: 6, linxOrder: 2 }),
      ]),
    }),
    expect.objectContaining({
      linxIdentifier: productOnlyIdentifier,
      items: [expect.objectContaining({ productCode: 1314 })],
    }),
  ]),
);
expect(deps.loadMissingCatalogs).toHaveBeenCalledWith(
  "11222333000144",
  completed.movements,
  { mode: "INCREMENTAL" },
);
```

- [ ] **Step 2: Run the regression and verify failure**

Run:

```bash
npm test -- src/tests/unit/linx/sync.test.ts -t "computes product 1314"
```

Expected: FAIL because the current filter removes `1314`.

- [ ] **Step 3: Add a failing safe-warning test**

Have `mapCanonicalSales` return two sales containing pending code `9001` and one sale containing pending code `9002`. Assert deterministic calls:

```ts
expect(deps.logger.warn.mock.calls).toEqual([
  ["Produto Linx sem cadastro", { organizationId: "org-1", productCode: 9001 }],
  ["Produto Linx sem cadastro", { organizationId: "org-1", productCode: 9002 }],
]);
```

- [ ] **Step 4: Remove the exclusion and emit safe warnings**

Delete `IGNORED_LINX_PRODUCT_CODES`, delete the filtered `importable` object, and pass `completed.movements` / `...completed` directly to catalogs and mapping.

After mapping, add:

```ts
const pendingProductCodes = [
  ...new Set(
    sales.flatMap((sale) =>
      sale.items.flatMap((item) =>
        item.catalogStatus === "PENDING" ? [item.productCode] : [],
      ),
    ),
  ),
].sort((left, right) => left - right);
for (const productCode of pendingProductCodes) {
  deps.logger.warn("Produto Linx sem cadastro", {
    organizationId: input.organizationId,
    productCode,
  });
}
```

- [ ] **Step 5: Verify and commit Task 3**

Run:

```bash
npm test -- src/tests/unit/linx/sync.test.ts src/tests/unit/linx/sync-adapter.test.ts src/tests/unit/sales-import/import-sales.test.ts
```

Expected: all selected tests pass, including the order containing only `1314`.

Commit:

```bash
git add src/services/linx/sync.ts src/tests/unit/linx/sync.test.ts
git commit -m "fix: compute Linx products with catalog fallback"
```

---

### Task 4: Expose Pending Products to Administrators

**Files:**
- Modify: `src/app/api/admin/linx/status/route.ts:15-82`
- Modify: `src/tests/unit/api/linx-admin-routes.test.ts:10-80,215-315`
- Verify only: `src/app/api/linx/status/route.ts`
- Modify: `src/tests/unit/api/linx-user-routes.test.ts`

**Interfaces:**
- Consumes: indexed `Product.catalogStatus` from Task 1.
- Produces: admin field `pendingProducts: Array<{ externalCode: number; description: string; lastCheckedAt: string | null }>`.

- [ ] **Step 1: Write a failing admin response test**

Add `productFindMany` to the hoisted mocks, mocked Prisma root, and coordinated `tx.product.findMany`. In `beforeEach`, default it to `[]`. In the successful status test, return:

```ts
mocks.productFindMany.mockResolvedValue([
  {
    external_code: 9999,
    description: "Produto não identificado — código 9999",
    catalogLastCheckedAt: new Date("2026-08-11T12:00:00.000Z"),
  },
]);
```

Expect:

```ts
pendingProducts: [
  {
    externalCode: 9999,
    description: "Produto não identificado — código 9999",
    lastCheckedAt: "2026-08-11T12:00:00.000Z",
  },
],
```

Assert the query uses `where: { catalogStatus: "PENDING" }`, ascending external code, and selects only the approved three database fields.

- [ ] **Step 2: Run the admin test and verify failure**

Run:

```bash
npm test -- src/tests/unit/api/linx-admin-routes.test.ts -t "serializes cursor BigInts"
```

Expected: FAIL because the response lacks `pendingProducts`.

- [ ] **Step 3: Query and serialize pending products inside coordination**

Add this query to the existing `Promise.all` when an active organization exists:

```ts
tx.product.findMany({
  where: { catalogStatus: "PENDING" },
  orderBy: { external_code: "asc" },
  select: {
    external_code: true,
    description: true,
    catalogLastCheckedAt: true,
  },
})
```

Use `Promise.resolve([])` when there is no active organization. Serialize:

```ts
pendingProducts: pendingProducts.flatMap((product) =>
  product.external_code === null
    ? []
    : [{
        externalCode: product.external_code,
        description: product.description,
        lastCheckedAt: product.catalogLastCheckedAt?.toISOString() ?? null,
      }],
),
```

- [ ] **Step 4: Prove ordinary user status remains private**

Add an assertion to the successful user status test:

```ts
expect(await response.clone().json()).not.toHaveProperty("pendingProducts");
```

If the existing test already consumes the body, save the parsed JSON once and assert both its current shape and the absent property.

Run:

```bash
npm test -- src/tests/unit/api/linx-admin-routes.test.ts src/tests/unit/api/linx-user-routes.test.ts
```

Expected: both files pass.

- [ ] **Step 5: Commit Task 4**

```bash
git add src/app/api/admin/linx/status/route.ts src/tests/unit/api/linx-admin-routes.test.ts src/tests/unit/api/linx-user-routes.test.ts
git commit -m "feat: expose pending Linx products to admins"
```

---

### Task 5: Authorize a Two-Day Reconciliation Period

**Files:**
- Modify: `src/services/linx/reconciliation.ts:1-25,160-190,289-305`
- Modify: `src/services/linx/admin-runtime.ts:171-230`
- Modify: `src/app/api/admin/linx/reconciliation/preview/route.ts:15-55`
- Modify: `src/tests/unit/linx/reconciliation.test.ts:397-460`
- Modify: `src/tests/unit/linx/admin-runtime.test.ts:170-225`
- Modify: `src/tests/unit/api/linx-admin-routes.test.ts`

**Interfaces:**
- Consumes: `ReconciliationPeriod`, preview snapshot hash, and one-use authorization token.
- Produces: `validateReconciliationPeriod(period)`, optional `period` input in preview services, and an optional admin request period.

- [ ] **Step 1: Write failing explicit-period tests**

Add to `src/tests/unit/linx/reconciliation.test.ts`:

```ts
it("uses an explicit validated reconciliation period", async () => {
  const dependencies = makeDependencies(10);
  const period = { from: "2026-08-05", to: "2026-08-06" };
  const preview = await previewReconciliation(
    { runtimeBudgetMs: 1_000, period },
    dependencies,
  );

  expect(preview.period).toEqual(period);
  expect(dependencies.readLinxOrders).toHaveBeenCalledWith(period);
  expect(dependencies.readDatabaseOrders).toHaveBeenCalledWith(period);
});

it.each([
  [{ from: "2026-02-30", to: "2026-03-01" }],
  [{ from: "2026-08-06", to: "2026-08-05" }],
  [{ from: "2026-07-01", to: "2026-08-01" }],
])("rejects invalid explicit period %#", async (period) => {
  await expect(
    previewReconciliation(
      { runtimeBudgetMs: 1_000, period },
      makeDependencies(10),
    ),
  ).rejects.toThrow("Período de conciliação inválido");
});
```

The maximum inclusive period remains 30 calendar days.

- [ ] **Step 2: Run period tests and verify failure**

Run:

```bash
npm test -- src/tests/unit/linx/reconciliation.test.ts -t "explicit.*period"
```

Expected: FAIL because preview input does not accept or validate `period`.

- [ ] **Step 3: Implement service-level period validation**

Add:

```ts
const ISO_CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateReconciliationPeriod(
  period: ReconciliationPeriod,
): ReconciliationPeriod {
  const parse = (value: string) => {
    if (!ISO_CALENDAR_DATE.test(value)) {
      throw new Error("Período de conciliação inválido");
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || isoCalendarDate(date) !== value) {
      throw new Error("Período de conciliação inválido");
    }
    return date;
  };
  const from = parse(period.from);
  const to = parse(period.to);
  const elapsedDays = (to.getTime() - from.getTime()) / 86_400_000;
  if (elapsedDays < 0 || elapsedDays > 29) {
    throw new Error("Período de conciliação inválido");
  }
  return { from: isoCalendarDate(from), to: isoCalendarDate(to) };
}
```

Change the preview input signature to:

```ts
input: { runtimeBudgetMs: number; period?: ReconciliationPeriod }
```

Resolve the period with:

```ts
const period = input.period
  ? validateReconciliationPeriod(input.period)
  : reconciliationPeriodFor(dependencies.nowDate());
```

- [ ] **Step 4: Thread the selected period into production preview and authorization**

Change the production signature:

```ts
export async function previewProductionReconciliation(
  organizationId: string,
  issuedById: string,
  period?: ReconciliationPeriod,
)
```

Pass `period` to `previewReconciliation({ runtimeBudgetMs, period }, ...)`. Keep using `preview.period` in `issueReconciliationAuthorization`; this binds execution to exactly the previewed dates.

Add an admin-runtime test passing `{ from: "2026-08-05", to: "2026-08-06" }`. Assert both `collectLinxData` and `issueReconciliationAuthorization` receive that exact period.

- [ ] **Step 5: Accept and validate the optional route period**

Extend `previewSchema`:

```ts
period: z
  .object({ from: z.string(), to: z.string() })
  .strict()
  .optional(),
```

After shape parsing, call `validateReconciliationPeriod` in a try/catch and return `invalidBodyResponse()` for invalid input. Pass the validated value as the third production-preview argument.

Add API tests for:

```ts
{
  organizationId,
  period: { from: "2026-08-05", to: "2026-08-06" },
}
```

and invalid calendar, reversed, and over-30-day ranges. Invalid bodies return `400` before `previewProductionReconciliation` runs.

```ts
const response = await previewPost(jsonRequest(
  "/api/admin/linx/reconciliation/preview",
  {
    organizationId,
    period: { from: "2026-08-05", to: "2026-08-06" },
  },
));
expect(response.status).toBe(200);
expect(mocks.previewProductionReconciliation).toHaveBeenCalledWith(
  organizationId,
  admin.id,
  { from: "2026-08-05", to: "2026-08-06" },
);

for (const period of [
  { from: "2026-02-30", to: "2026-03-01" },
  { from: "2026-08-06", to: "2026-08-05" },
  { from: "2026-07-01", to: "2026-08-01" },
]) {
  const invalid = await previewPost(jsonRequest(
    "/api/admin/linx/reconciliation/preview",
    { organizationId, period },
  ));
  expect(invalid.status).toBe(400);
}
```

- [ ] **Step 6: Verify and commit Task 5**

Run:

```bash
npm test -- src/tests/unit/linx/reconciliation.test.ts src/tests/unit/linx/admin-runtime.test.ts src/tests/unit/api/linx-admin-routes.test.ts
```

Expected: all selected files pass.

Commit:

```bash
git add src/services/linx/reconciliation.ts src/services/linx/admin-runtime.ts src/app/api/admin/linx/reconciliation/preview/route.ts src/tests/unit/linx/reconciliation.test.ts src/tests/unit/linx/admin-runtime.test.ts src/tests/unit/api/linx-admin-routes.test.ts
git commit -m "feat: bound Linx reconciliation previews"
```

---

### Task 6: Verify the Repository Artifact

**Files:**
- Verify only: every file changed by Tasks 1-5.

**Interfaces:**
- Consumes: the complete fallback implementation.
- Produces: a generated Prisma client, verified migration, and production build suitable for database recovery.

- [ ] **Step 1: Validate schema and migration formatting**

Run:

```bash
npx prisma format
npx prisma validate
npx prisma generate
git diff --check
```

Expected: every command exits `0`; inspect any mechanical `prisma format` change before staging it.

- [ ] **Step 2: Run focused product, Linx, API, and integration-contract tests**

Run:

```bash
npm test -- src/tests/unit/linx src/tests/unit/sales-import src/tests/unit/api/linx-admin-routes.test.ts src/tests/unit/api/linx-user-routes.test.ts src/tests/integration/prisma/linx-schema.test.ts src/tests/integration/sales-import/idempotency.test.ts
```

Expected: all runnable focused tests pass; database-backed tests may be skipped only when `TEST_DATABASE_URL` is absent.

- [ ] **Step 3: Run lint and production build**

Run:

```bash
npm run lint
npm run build
```

Expected: lint has zero errors (the two existing React Compiler/TanStack warnings may remain) and the build exits `0`.

- [ ] **Step 4: Run the complete suite and compare the known baseline**

Run:

```bash
npm test
```

Expected baseline: every new and Linx-related test passes. The only allowed failure is `src/tests/unit/api/linx-cron.test.ts` expecting the already removed `/api/cron` Google schedule. Any other failure blocks database recovery.

- [ ] **Step 5: Confirm commit scope and clean state**

Run:

```bash
git status --short
git log -n 8 --oneline
git diff --stat c4d61eb..HEAD
```

Expected: no uncommitted implementation changes and only the planned migration, services, routes, and tests appear after the approved design commit.

---

### Task 7: Apply the Migration and Recover Product 1314

**Files:**
- No repository source changes.
- External writes: configured application database through Prisma migration and the production Linx reconciliation entrypoint.

**Interfaces:**
- Consumes: `.env`, the active Linx organization, one active admin ID, `previewProductionReconciliation`, `runLinxSync`, and period `2026-08-05` through `2026-08-06`.
- Produces: migrated product fields, eleven recovered `1314` item rows, corrected mixed orders, three recovered single-product orders, and a successful one-use reconciliation run.

- [ ] **Step 1: Capture a read-only pre-recovery snapshot**

Use Prisma to record, without names or credentials:

- active organization ID;
- latest Linx run and running-run count;
- all five cursor values and update times;
- product `1314` metadata and catalog state if the migration is already applied;
- Linx-linked `1314` items dated 2026-08-05 through 2026-08-06;
- total Linx-linked `1314` items.

Expected before reconciliation: zero `1314` item rows in the two-day period and one earlier Linx-linked `1314` item overall. If values differ, stop and re-diagnose scope before writing.

Because the generated client already knows the new columns while the database may not, read the pre-migration product with raw SQL limited to old columns:

```ts
const [productBefore] = await prisma.$queryRaw<Array<{
  external_code: number;
  description: string;
  brand: string;
  sector: string;
}>>`
  SELECT external_code, description, brand, sector
  FROM "Product"
  WHERE external_code = 1314
`;
if (!productBefore || productBefore.external_code !== 1314) {
  throw new Error("Produto 1314 ausente antes da migração");
}
```

Use explicit `select` clauses for the other pre-migration queries so Prisma does not request the not-yet-applied columns.

- [ ] **Step 2: Apply the additive migration once**

Run:

```bash
npx prisma migrate deploy
```

Expected: `20260811193000_add_product_catalog_status` applies successfully. Query product `1314` immediately and verify `catalogStatus = KNOWN`, its exact metadata remains unchanged, and no sale/item count changed during migration.

- [ ] **Step 3: Generate the two-day preview without printing its token**

Run a `tsx` script with the local CLI guard:

```ts
process.loadEnvFile(".env");
const Module = require("node:module");
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "server-only") return {};
  return originalLoad.call(this, request, parent, isMain);
};

const [{ prisma }, { previewProductionReconciliation }] = await Promise.all([
  import("./src/lib/prisma.ts"),
  import("./src/services/linx/admin-runtime.ts"),
]);
const organization = await prisma.organization.findFirstOrThrow({
  where: { linxSyncEnabled: true, linxCnpj: { not: null } },
  select: { id: true },
});
const admin = await prisma.user.findFirstOrThrow({
  where: { role: "ADMIN", isActive: true },
  orderBy: { id: "asc" },
  select: { id: true },
});
const preview = await previewProductionReconciliation(
  organization.id,
  admin.id,
  { from: "2026-08-05", to: "2026-08-06" },
);
const { authorizationToken, ...publicPreview } = preview;
console.log(JSON.stringify(publicPreview, null, 2));
if (!authorizationToken || !preview.fitsRuntimeBudget) {
  throw new Error("Preview sem autorização executável");
}
if (
  preview.differences.missingInDatabase !== 3 ||
  preview.differences.changedOrders !== 8
) {
  throw new Error("Escopo do preview divergiu do diagnóstico 3/8");
}
```

Expected: the period is exactly the two approved dates, with 3 missing and 8 changed orders. Keep `authorizationToken` in process memory and never print it.

- [ ] **Step 4: Execute one authorized reconciliation in the same process**

Continue the script:

```ts
const { runLinxSync } = await import("./src/services/linx/sync.ts");
const startedAt = Date.now();
const summary = await runLinxSync({
  organizationId: organization.id,
  requestedById: admin.id,
  trigger: "RECONCILIATION",
  mode: "RECONCILIATION",
  deadlineAt: startedAt + 300_000,
  transactionTimeoutMs: 120_000,
  reconciliationAuthorization: authorizationToken,
});
console.log(JSON.stringify({ elapsedMs: Date.now() - startedAt, summary }));
```

Disconnect Prisma in `finally`. If preview or execution fails, do not retry automatically: inspect the latest `LinxSyncRun`, identify the failure stage, and generate a new preview/token only after the cause is understood.

- [ ] **Step 5: Verify database recovery invariants**

Query product `1314` and all its Linx-linked period items. Use runnable guards:

```ts
if (
  !product ||
  product.external_code !== 1314 ||
  product.description !== "S.O. WINDOWS 11 PRO 32/64 BITS OEM (FQC-10529)" ||
  product.brand !== "MICROSSOFT" ||
  product.sector !== "ACESSORIOS OFFICE" ||
  product.catalogStatus !== "KNOWN"
) {
  throw new Error("Cadastro final do produto 1314 divergiu");
}
const orderCount = new Set(periodItems.map((item) => item.sale.id)).size;
const productOnlyOrders = periodItems.filter(
  (item) => item.sale.items.length === 1,
).length;
const mixedOrders = periodItems.filter(
  (item) => item.sale.items.length > 1,
).length;
if (
  periodItems.length !== 11 ||
  orderCount !== 11 ||
  productOnlyOrders !== 3 ||
  mixedOrders !== 8
) {
  throw new Error("Recuperação do produto 1314 divergiu de 11/3/8");
}
```

Also verify:

- latest run has `trigger = RECONCILIATION`, `status = SUCCESS`, `stage = COMPLETED`, and no error;
- no `RUNNING` run remains;
- all five cursors are greater than or equal to pre-recovery values;
- `(saleId, linxOrder)` identities remain unique;
- total Linx-linked `1314` item count increased from 1 to 12.

- [ ] **Step 6: Run one short incremental confirmation**

Run `runLinxSync` once with `trigger: "RETRY"`, `mode: "INCREMENTAL"`, a 60-second deadline, and `transactionTimeoutMs: 30_000`.

Expected: success with zero changes or only genuinely new activity. Cursor values remain monotonic and code `1314` is not `PENDING`.

- [ ] **Step 7: Record final repository and database state**

Run:

```bash
git status --short
git log -n 8 --oneline
```

Report implementation commit IDs, migration name, preview counts, reconciliation run ID and summary, confirmation summary, final cursor values, product `1314` state, and verification results.

Do not push, merge, create a pull request, or alter the known cron test unless separately authorized.
