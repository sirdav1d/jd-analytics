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
