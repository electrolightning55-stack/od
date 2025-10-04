/*
  Warnings:

  - Added the required column `locationPayrollDurationId` to the `GuardAllowances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GuardAllowances" ADD COLUMN     "locationPayrollDurationId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "GuardAllowances" ADD CONSTRAINT "GuardAllowances_locationPayrollDurationId_fkey" FOREIGN KEY ("locationPayrollDurationId") REFERENCES "LocationPayRollDuration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
