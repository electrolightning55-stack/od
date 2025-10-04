/*
  Warnings:

  - You are about to drop the column `serviceNumber` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "serviceNumber",
ADD COLUMN     "contractFile" TEXT DEFAULT 'N/A',
ADD COLUMN     "contractNumber" SERIAL NOT NULL;
