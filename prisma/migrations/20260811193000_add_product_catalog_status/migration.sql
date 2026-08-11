BEGIN;

SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

CREATE TYPE "ProductCatalogStatus" AS ENUM ('KNOWN', 'PENDING');

ALTER TABLE "Product"
ADD COLUMN "catalogStatus" "ProductCatalogStatus" NOT NULL DEFAULT 'KNOWN',
ADD COLUMN "catalogLastCheckedAt" TIMESTAMP(3),
ADD COLUMN "catalogResolvedAt" TIMESTAMP(3);

CREATE INDEX "Product_catalogStatus_idx" ON "Product"("catalogStatus");

COMMIT;
