/*
  Warnings:

  - You are about to drop the column `eobiDate` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "eobiDate",
ALTER COLUMN "kinContactNumber" DROP NOT NULL,
ALTER COLUMN "kinContactNumber" SET DEFAULT 'N/A';
