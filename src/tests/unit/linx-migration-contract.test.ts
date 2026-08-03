import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "prisma/migrations/20260729000000_add_linx_integration/migration.sql",
);

describe("Linx migration transaction contract", () => {
  it("wraps all DDL in a bounded PostgreSQL transaction", () => {
    const migrationSql = readFileSync(migrationPath, "utf8");

    expect(migrationSql).toMatch(
      /^BEGIN;\n\nSET LOCAL lock_timeout = '5s';\nSET LOCAL statement_timeout = '60s';/,
    );
    expect(migrationSql.trim()).toMatch(/COMMIT;$/);
    expect(migrationSql).not.toMatch(/\bCONCURRENTLY\b/);
  });

  it("enables RLS on new public operational tables before commit", () => {
    const migrationSql = readFileSync(migrationPath, "utf8");
    const commitIndex = migrationSql.lastIndexOf("COMMIT;");
    const cursorTableIndex = migrationSql.indexOf(
      'CREATE TABLE "LinxSyncCursor"',
    );
    const runTableIndex = migrationSql.indexOf('CREATE TABLE "LinxSyncRun"');
    const cursorRlsIndex = migrationSql.indexOf(
      'ALTER TABLE "LinxSyncCursor" ENABLE ROW LEVEL SECURITY;',
    );
    const runRlsIndex = migrationSql.indexOf(
      'ALTER TABLE "LinxSyncRun" ENABLE ROW LEVEL SECURITY;',
    );

    expect(cursorRlsIndex).toBeGreaterThan(cursorTableIndex);
    expect(runRlsIndex).toBeGreaterThan(runTableIndex);
    expect(cursorRlsIndex).toBeLessThan(commitIndex);
    expect(runRlsIndex).toBeLessThan(commitIndex);
    expect(migrationSql).not.toMatch(/\bCREATE POLICY\b/i);
    expect(migrationSql).not.toMatch(/\bGRANT\b.*\b(anon|authenticated|public)\b/i);
  });
});
