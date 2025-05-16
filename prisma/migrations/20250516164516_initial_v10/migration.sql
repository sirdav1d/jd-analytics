/*
  Warnings:

  - You are about to drop the column `productId` on the `SaleItem` table. All the data in the column will be lost.
  - You are about to drop the column `saleId` on the `SaleItem` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `SaleItem` table. All the data in the column will be lost.
  - You are about to drop the column `unitValue` on the `SaleItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[method]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[documentNumber]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[externalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sale_id` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_value` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_value` to the `SaleItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_saleId_fkey";

-- AlterTable
ALTER TABLE "SaleItem" DROP COLUMN "productId",
DROP COLUMN "saleId",
DROP COLUMN "totalValue",
DROP COLUMN "unitValue",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "sale_id" TEXT NOT NULL,
ADD COLUMN     "total_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unit_value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "externalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_method_key" ON "PaymentMethod"("method");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_documentNumber_key" ON "Pedido"("documentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
