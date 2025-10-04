/*
  Warnings:

  - You are about to drop the column `assignedGuardId` on the `GuardAllowances` table. All the data in the column will be lost.
  - Added the required column `requestedGuardId` to the `GuardAllowances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GuardAllowances" DROP CONSTRAINT "GuardAllowances_assignedGuardId_fkey";

-- AlterTable
ALTER TABLE "GuardAllowances" DROP COLUMN "assignedGuardId",
ADD COLUMN     "requestedGuardId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "GuardAllowances" ADD CONSTRAINT "GuardAllowances_requestedGuardId_fkey" FOREIGN KEY ("requestedGuardId") REFERENCES "requested_guards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
