import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "prisma/migrations/20260729010000_harden_linx_and_password_reset/migration.sql",
);

describe("Linx and password-reset hardening migration", () => {
  it("is one bounded atomic forward migration and leaves the applied migration untouched", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toMatch(
      /^BEGIN;\n\nSET LOCAL lock_timeout = '5s';\nSET LOCAL statement_timeout = '60s';/,
    );
    expect(sql.trim()).toMatch(/COMMIT;$/);
    expect(sql).not.toMatch(/\bCONCURRENTLY\b/);
  });

  it("adds nullable reverse origin bindings and organization-bound indexes", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toContain('ADD COLUMN "linxRoutineOriginCode" INTEGER');
    expect(sql).toContain('ADD COLUMN "linxSalesResponseId" INTEGER');
    expect(sql).toContain(
      'ADD COLUMN "linxOriginBindingsSyncedAt" TIMESTAMP(3)',
    );
    expect(sql).toContain(
      '("organizationId", "linxRoutineOriginCode")',
    );
    expect(sql).toContain(
      '("organizationId", "linxSalesResponseId")',
    );
  });

  it("persists run mode, failure stage and a unique consumed preview authorization hash", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toContain(
      `CREATE TYPE "LinxSyncMode" AS ENUM ('INCREMENTAL', 'RECONCILIATION')`,
    );
    expect(sql).toContain('ADD COLUMN "mode" "LinxSyncMode"');
    expect(sql).toContain('ADD COLUMN "failureStage" TEXT');
    expect(sql).toContain(
      'ADD COLUMN "reconciliationAuthorizationHash" TEXT',
    );
    expect(sql).toContain(
      'CREATE UNIQUE INDEX "LinxSyncRun_reconciliationAuthorizationHash_key"',
    );
  });

  it("creates one-use reset tokens and database-backed rate limits with RLS and indexes", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toContain('CREATE TABLE "PasswordResetToken"');
    expect(sql).toContain('"tokenHash" TEXT NOT NULL');
    expect(sql).toContain('"expiresAt" TIMESTAMP(3) NOT NULL');
    expect(sql).toContain('"consumedAt" TIMESTAMP(3)');
    expect(sql).toContain('"invalidatedAt" TIMESTAMP(3)');
    expect(sql).toContain('CREATE TABLE "PasswordResetRateLimit"');
    expect(sql).toContain(
      'ALTER TABLE "PasswordResetToken" ENABLE ROW LEVEL SECURITY;',
    );
    expect(sql).toContain(
      'ALTER TABLE "PasswordResetRateLimit" ENABLE ROW LEVEL SECURITY;',
    );
    expect(sql).toContain(
      'FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE',
    );
    expect(sql).toContain(
      'CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key"',
    );
    expect(sql).toContain(
      'CREATE INDEX "PasswordResetToken_userId_createdAt_idx"',
    );
    expect(sql).toContain(
      'CREATE INDEX "PasswordResetToken_expiresAt_idx"',
    );
  });
});
