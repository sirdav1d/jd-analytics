/*
  Warnings:

  - You are about to drop the column `googleUserId` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "googleUserId",
ADD COLUMN     "googleExpiresIn" DOUBLE PRECISION;
