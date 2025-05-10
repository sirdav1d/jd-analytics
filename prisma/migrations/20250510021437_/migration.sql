/*
  Warnings:

  - You are about to drop the column `googleExpiresIn` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the `ClientesRecorrentesVsUnicos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProdutoRank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceitaCategoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReceitaMetodoPagamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pedidos` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('FISICA', 'JURIDICA');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SELLER';

-- DropForeignKey
ALTER TABLE "ClientesRecorrentesVsUnicos" DROP CONSTRAINT "ClientesRecorrentesVsUnicos_dashboardId_fkey";

-- DropForeignKey
ALTER TABLE "ProdutoRank" DROP CONSTRAINT "ProdutoRank_dashboardId_fkey";

-- DropForeignKey
ALTER TABLE "ReceitaCategoria" DROP CONSTRAINT "ReceitaCategoria_dashboardId_fkey";

-- DropForeignKey
ALTER TABLE "ReceitaMetodoPagamento" DROP CONSTRAINT "ReceitaMetodoPagamento_dashboardId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "googleExpiresIn",
ADD COLUMN     "googleExpiresAt" BIGINT;

-- DropTable
DROP TABLE "ClientesRecorrentesVsUnicos";

-- DropTable
DROP TABLE "ProdutoRank";

-- DropTable
DROP TABLE "ReceitaCategoria";

-- DropTable
DROP TABLE "ReceitaMetodoPagamento";

-- DropTable
DROP TABLE "pedidos";

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personType" "PersonType" NOT NULL,
    "externalCode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalDateRef" DATE NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitValue" DOUBLE PRECISION NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "externalCode" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL,
    "natureOperation" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "customerId" TEXT,
    "paymentMethodId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_externalCode_key" ON "Customer"("externalCode");

-- CreateIndex
CREATE UNIQUE INDEX "SalesGoal_userId_goalDateRef_key" ON "SalesGoal"("userId", "goalDateRef");

-- CreateIndex
CREATE UNIQUE INDEX "Product_externalCode_key" ON "Product"("externalCode");

-- AddForeignKey
ALTER TABLE "SalesGoal" ADD CONSTRAINT "SalesGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
