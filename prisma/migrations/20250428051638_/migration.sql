/*
  Warnings:

  - You are about to drop the column `cancelada` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `cliente` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_pedido` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_produto` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `data_aprovacao` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `faturado` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `preco_unitario` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `produto` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `setor` on the `pedidos` table. All the data in the column will be lost.
  - Added the required column `documento` to the `pedidos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operacao` to the `pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "cancelada",
DROP COLUMN "cliente",
DROP COLUMN "codigo_pedido",
DROP COLUMN "codigo_produto",
DROP COLUMN "data_aprovacao",
DROP COLUMN "faturado",
DROP COLUMN "preco_unitario",
DROP COLUMN "produto",
DROP COLUMN "quantidade",
DROP COLUMN "setor",
ADD COLUMN     "documento" TEXT NOT NULL,
ADD COLUMN     "operacao" TEXT NOT NULL;
