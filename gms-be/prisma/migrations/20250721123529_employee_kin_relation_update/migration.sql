/*
  Warnings:

  - You are about to drop the column `kinReligion` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "kinReligion",
ADD COLUMN     "kinRelation" TEXT NOT NULL DEFAULT 'N/A';
