# Linx product catalog fallback design

**Date:** 2026-08-11  
**Status:** Approved in conversation; awaiting written-spec review

## Context

The incremental Linx sync receives sale items from `LinxMovimento` with a
`cod_produto`, but the movement payload does not contain the product name,
brand, or sector. Those fields are normally loaded through `LinxProdutos`.

Product `1314` demonstrates a valid catalog inconsistency: Linx movements
reference the code, while the point lookup in `LinxProdutos` returns a valid
empty response. The local database already has reliable metadata for this
code:

- description: `S.O. WINDOWS 11 PRO 32/64 BITS OEM (FQC-10529)`;
- brand: `MICROSSOFT`;
- sector: `ACESSORIOS OFFICE`;
- 278 historical item associations at the time of diagnosis.

The current incremental path does not read persisted products before doing
Linx point lookups. A missing catalog row therefore fails the `CATALOGS`
stage, rolls back the entire atomic import, and leaves every cursor behind the
offending movement. A temporary exclusion for product `1314` unblocked the
accumulated sync, but it intentionally omitted eleven item rows on 2026-08-05
and 2026-08-06 and must not be the permanent behavior.

## Goals

1. Preserve sale quantity, unit price, and total value even when Linx cannot
   currently provide product metadata.
2. Prefer trustworthy product metadata already present in the local database.
3. Keep each unknown external product code independently traceable.
4. Distinguish a valid empty product lookup from Linx authentication, timeout,
   transport, parsing, and malformed-data failures.
5. Retry unresolved Linx products and automatically replace fallback metadata
   when authoritative metadata becomes available.
6. Make unresolved products visible to administrators without exposing
   customer data.
7. Recover the product `1314` item rows omitted during the temporary recovery.

## Non-goals

- Inventing product names, brands, or sectors.
- Grouping different missing codes under one generic product.
- Creating placeholder customers or sellers.
- Suppressing Linx operational errors.
- Building a general master-data-management interface.
- Changing the existing global uniqueness rule for `Product.external_code`.

## Product resolution policy

For every distinct product code present in authoritative completed movement
rows, resolve metadata in this order:

1. **Known local product.** Read the local `Product` row. If its catalog status
   is `KNOWN`, use its stored description, brand, and sector without requiring
   a Linx point lookup.
2. **Linx product catalog.** If no known local product exists, or the local row
   is still a placeholder, query `LinxProdutos` for the exact external code.
3. **Valid empty response.** If the request succeeds and returns no valid row
   for that exact code, use an independent placeholder whose metadata is:
   - description: `Produto não identificado — código <code>`;
   - brand: `Não informado`;
   - sector: `Não informado`.
4. **Operational or data error.** Authentication failures, timeouts, transport
   errors, invalid XML, multiple conflicting rows, or a mismatched product code
   remain fatal. They must not be converted into placeholders.

The original external code, movement order, Linx timestamp, quantity, unit
price, and total value are never replaced by fallback values. An order made
only of unresolved products is still importable and contributes to reports.

## Persistence model

Add a product catalog status to `Product`:

```prisma
enum ProductCatalogStatus {
  KNOWN
  PENDING
}

model Product {
  // Existing fields remain unchanged.
  catalogStatus        ProductCatalogStatus @default(KNOWN)
  catalogLastCheckedAt DateTime?
  catalogResolvedAt    DateTime?

  @@index([catalogStatus])
}
```

Existing products migrate to `KNOWN`, including product `1314`. A newly
created fallback product is stored as `PENDING`, with
`catalogLastCheckedAt` set to the successful empty-response time and
`catalogResolvedAt` left null.

When a later lookup returns authoritative metadata, the existing product is
updated in place, its status changes to `KNOWN`, and `catalogResolvedAt` is
set. A later successful empty lookup keeps the placeholder `PENDING` and only
advances `catalogLastCheckedAt`.

This uses the existing `Product` row as the pending-work record. A separate
issue table is unnecessary while product codes remain globally unique in the
application schema.

## Synchronization data flow

1. Fetch and validate all five Linx streams exactly as today.
2. Complete affected movements authoritatively before resolving catalogs.
3. Read persisted products for the completed movement codes in both
   incremental and reconciliation modes. Existing customer and seller
   behavior remains unchanged.
4. Accept `KNOWN` local products immediately. Treat `PENDING` local products
   as retry candidates and call `LinxProdutos` again when their code occurs in
   a later sync.
5. Return both catalog entries and their resolution status from the catalog
   adapter.
6. Map every movement, including placeholder-backed movements, to canonical
   sale items.
7. Within the existing database transaction, import sales, upsert product
   metadata/status, save all five cursors, and mark the run successful.
8. If any transactional write fails, sales, product status, cursors, and the
   successful run state all roll back together.

The hard-coded `1314` exclusion is removed only after this path is covered by
tests. Raw Linx counts and cursor semantics remain unchanged.

## Automatic and manual resolution

A `PENDING` product is retried whenever its code appears in a future sync.
When Linx starts returning it, the same product row is corrected
automatically; historical `SaleItem` relations require no rewrite because
they already reference that row.

A later trusted non-Linx import for the same external code may also supply
real metadata and set the product to `KNOWN`. This is the manual-resolution
path without requiring a new product-maintenance screen.

The existing administrative Linx status response will include unresolved
products with only:

- external product code;
- fallback description;
- last successful catalog check timestamp.

No sale identifier, customer, document number, or credential is included.

## Recovery of product 1314

After deploying the migration and tested fallback behavior:

1. Remove the temporary product `1314` exclusion.
2. Generate a reconciliation preview for 2026-08-05 through 2026-08-06.
3. Verify that the preview contains the eleven previously omitted `1314`
   item rows: eight mixed orders and three orders containing only `1314`.
4. Execute the authorized reconciliation through the production entrypoint.
5. Verify that mixed orders regain the missing item, the three absent orders
   are created, and product `1314` retains its real local metadata and `KNOWN`
   status.
6. Run a short incremental confirmation and verify that it is a no-op or
   contains only genuinely new Linx activity.

The preview is the final authority for the exact affected identifiers and
monetary totals. The implementation must not hard-code the diagnosed counts.

## Error handling and observability

- Emit one structured warning when a product enters or remains in `PENDING`,
  containing the organization ID and external product code only.
- Do not log movement payloads, customer data, credentials, or Linx responses.
- Preserve the existing public Linx error sanitization.
- Keep missing customers and sellers fatal because a sale cannot be assigned
  correctly without them.
- Keep invalid product codes, invalid item identities, and inconsistent order
  headers fatal.
- Surface pending product counts and entries through the administrative status
  response; ordinary user status responses remain unchanged.

## Testing strategy

### Unit tests

- Incremental sync uses a `KNOWN` local product and does not call the Linx
  product endpoint for that code.
- A valid empty Linx product response produces a code-specific placeholder
  while preserving movement quantity and monetary values.
- An order containing only a placeholder product maps and imports normally.
- Different missing codes produce different products.
- A `PENDING` product is retried when it appears again.
- A later Linx response replaces placeholder metadata and changes the status
  to `KNOWN`.
- A trusted non-Linx import can resolve a placeholder.
- Timeout, authentication, malformed XML, conflicting rows, and code mismatch
  still fail instead of creating placeholders.
- Product status, sales, cursors, and run success roll back together on a
  persistence failure.
- Administrative status exposes pending product metadata without sale or
  customer details.
- Product `1314` maps with its real local metadata after the temporary
  exclusion is removed.

### Repository verification

- Run the focused Linx unit suite.
- Run migration/schema integration tests.
- Run the complete test suite, lint, and production build.
- Treat the already documented cron-contract test mismatch as a separate
  pre-existing issue unless its owner explicitly brings it into scope.

### Production verification

- Preview the two-day reconciliation before writing.
- Compare affected identifiers and item totals before and after recovery.
- Confirm all five cursors remain monotonic.
- Confirm no Linx run remains `RUNNING`.
- Confirm product `1314` remains `KNOWN` and gains the eleven expected Linx
  item associations without duplicate item identities.

## Success criteria

- Product `1314` and future locally known products are computed using their
  real local metadata when Linx omits them from `LinxProdutos`.
- A truly unknown product contributes its exact Linx movement values under a
  unique, traceable placeholder code.
- Missing product metadata alone can no longer block unrelated sales or cursor
  progress.
- Operational Linx failures are never disguised as missing catalog data.
- Pending products are visible and can resolve automatically without changing
  historical sale-item relationships.
- The 2026-08-05 and 2026-08-06 omissions are recovered through an authorized,
  verified reconciliation.
