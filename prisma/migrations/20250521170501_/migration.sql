/*
  Warnings:

  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentNumber,organizationId]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `Pedido` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "external_code" SMALLSERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "data_pedido" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId";

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_documentNumber_organizationId_key" ON "Pedido"("documentNumber", "organizationId");

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
