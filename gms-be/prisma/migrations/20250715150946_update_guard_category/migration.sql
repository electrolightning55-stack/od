/*
  Warnings:

  - Added the required column `organizationId` to the `GuardCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guard" ADD COLUMN     "kinContactNumber" TEXT NOT NULL DEFAULT 'N/A';

-- AlterTable
ALTER TABLE "GuardCategory" ADD COLUMN     "organizationId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "GuardCategory" ADD CONSTRAINT "GuardCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
