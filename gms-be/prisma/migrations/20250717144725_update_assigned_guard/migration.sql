/*
  Warnings:

  - Added the required column `guardCategoryId` to the `AssignedGuard` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "requested_guard_finances" DROP CONSTRAINT "requested_guard_finances_requestedGuardId_fkey";

-- DropIndex
DROP INDEX "AssignedGuard_locationId_key";

-- AlterTable
ALTER TABLE "AssignedGuard" ADD COLUMN     "guardCategoryId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "requested_guards" ADD CONSTRAINT "requested_guards_guardCategoryId_fkey" FOREIGN KEY ("guardCategoryId") REFERENCES "GuardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requested_guard_finances" ADD CONSTRAINT "requested_guard_finances_requestedGuardId_fkey" FOREIGN KEY ("requestedGuardId") REFERENCES "requested_guards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGuard" ADD CONSTRAINT "AssignedGuard_guardCategoryId_fkey" FOREIGN KEY ("guardCategoryId") REFERENCES "GuardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
