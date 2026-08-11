import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "prisma/migrations/20260811193000_add_product_catalog_status/migration.sql",
);

describe("product catalog status migration", () => {
  it("is bounded, atomic, additive, and defaults existing products to KNOWN", () => {
    const sql = readFileSync(migrationPath, "utf8");
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
    expect(sql).toContain(
      'CREATE INDEX "Product_catalogStatus_idx" ON "Product"("catalogStatus")',
    );
    expect(sql).not.toMatch(/DROP TABLE|DROP COLUMN|TRUNCATE|DELETE FROM/i);
    expect(sql.trim()).toMatch(/COMMIT;$/);
  });
});
