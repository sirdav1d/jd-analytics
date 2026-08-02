BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- Run mode is persisted so retries survive a page reload.
CREATE TYPE "LinxSyncMode" AS ENUM ('INCREMENTAL', 'RECONCILIATION');

ALTER TABLE "LinxSyncRun"
ADD COLUMN "mode" "LinxSyncMode" NOT NULL DEFAULT 'INCREMENTAL',
ADD COLUMN "failureStage" TEXT,
ADD COLUMN "reconciliationAuthorizationHash" TEXT;

UPDATE "LinxSyncRun"
SET "mode" = 'RECONCILIATION'
WHERE "trigger" = 'RECONCILIATION';

-- Reverse bindings make catalog-only Linx deltas resolvable to pedidos.
ALTER TABLE "Pedido"
ADD COLUMN "linxRoutineOriginCode" INTEGER,
ADD COLUMN "linxSalesResponseId" INTEGER,
ADD COLUMN "linxOriginBindingsSyncedAt" TIMESTAMP(3);

CREATE INDEX "Pedido_organizationId_linxRoutineOriginCode_idx"
ON "Pedido" ("organizationId", "linxRoutineOriginCode");

CREATE INDEX "Pedido_organizationId_linxSalesResponseId_idx"
ON "Pedido" ("organizationId", "linxSalesResponseId");

CREATE UNIQUE INDEX "LinxSyncRun_reconciliationAuthorizationHash_key"
ON "LinxSyncRun" ("reconciliationAuthorizationHash");

-- Only hashes of password-reset bearer tokens and rate-limit identities are stored.
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PasswordResetRateLimit" (
    "keyHash" TEXT NOT NULL,
    "windowStartedAt" TIMESTAMP(3) NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetRateLimit_pkey" PRIMARY KEY ("keyHash")
);

ALTER TABLE "PasswordResetToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PasswordResetRateLimit" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key"
ON "PasswordResetToken" ("tokenHash");

CREATE INDEX "PasswordResetToken_userId_createdAt_idx"
ON "PasswordResetToken" ("userId", "createdAt");

CREATE INDEX "PasswordResetToken_expiresAt_idx"
ON "PasswordResetToken" ("expiresAt");

CREATE INDEX "PasswordResetRateLimit_windowStartedAt_idx"
ON "PasswordResetRateLimit" ("windowStartedAt");

ALTER TABLE "PasswordResetToken"
ADD CONSTRAINT "PasswordResetToken_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
