/*
  Warnings:

  - Added the required column `locationId` to the `GuardDeductions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GuardDeductions" ADD COLUMN     "locationId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "GuardDeductions" ADD CONSTRAINT "GuardDeductions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
