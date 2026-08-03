BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- CreateEnum
CREATE TYPE "LinxSyncMethod" AS ENUM ('MOVIMENTO', 'MOVIMENTO_PLANOS', 'MOVIMENTO_PRINCIPAL', 'ROTINA_ORIGEM', 'RESPOSTA_VENDA');

-- CreateEnum
CREATE TYPE "LinxSyncTrigger" AS ENUM ('CRON', 'MANUAL', 'RETRY', 'RECONCILIATION');

-- CreateEnum
CREATE TYPE "LinxSyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Organization"
ADD COLUMN "linxCnpj" TEXT,
ADD COLUMN "linxPortalId" INTEGER,
ADD COLUMN "linxCompanyId" INTEGER,
ADD COLUMN "linxSyncEnabled" BOOLEAN;

-- AlterTable
ALTER TABLE "Pedido"
ADD COLUMN "linxIdentifier" UUID,
ADD COLUMN "linxTimestamp" BIGINT,
ADD COLUMN "linxSyncedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SaleItem"
ADD COLUMN "linxOrder" INTEGER,
ADD COLUMN "linxTimestamp" BIGINT;

-- CreateTable
CREATE TABLE "LinxSyncCursor" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "method" "LinxSyncMethod" NOT NULL,
    "lastTimestamp" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinxSyncCursor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinxSyncRun" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "requestedById" TEXT,
    "trigger" "LinxSyncTrigger" NOT NULL,
    "status" "LinxSyncStatus" NOT NULL,
    "stage" TEXT,
    "processedOrders" INTEGER NOT NULL DEFAULT 0,
    "processedItems" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "leaseExpiresAt" TIMESTAMP(3),

    CONSTRAINT "LinxSyncRun_pkey" PRIMARY KEY ("id")
);

-- EnableRowLevelSecurity
ALTER TABLE "LinxSyncCursor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LinxSyncRun" ENABLE ROW LEVEL SECURITY;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_linxCnpj_key" ON "Organization"("linxCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_linxIdentifier_key" ON "Pedido"("linxIdentifier");

-- CreateIndex
CREATE UNIQUE INDEX "SaleItem_sale_id_linxOrder_key" ON "SaleItem"("sale_id", "linxOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LinxSyncCursor_organizationId_method_key" ON "LinxSyncCursor"("organizationId", "method");

-- CreateIndex
CREATE INDEX "LinxSyncRun_organizationId_startedAt_idx" ON "LinxSyncRun"("organizationId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LinxSyncRun_one_running_per_org"
ON "LinxSyncRun" ("organizationId")
WHERE "status" = 'RUNNING';

-- AddForeignKey
ALTER TABLE "LinxSyncCursor" ADD CONSTRAINT "LinxSyncCursor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinxSyncRun" ADD CONSTRAINT "LinxSyncRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinxSyncRun" ADD CONSTRAINT "LinxSyncRun_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
