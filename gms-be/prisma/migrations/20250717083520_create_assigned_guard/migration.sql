/*
  Warnings:

  - A unique constraint covering the columns `[requestedGuardId]` on the table `AssignedGuard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[locationId]` on the table `AssignedGuard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssignedGuard_requestedGuardId_key" ON "AssignedGuard"("requestedGuardId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignedGuard_locationId_key" ON "AssignedGuard"("locationId");

-- AddForeignKey
ALTER TABLE "AssignedGuard" ADD CONSTRAINT "AssignedGuard_requestedGuardId_fkey" FOREIGN KEY ("requestedGuardId") REFERENCES "requested_guards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGuard" ADD CONSTRAINT "AssignedGuard_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGuard" ADD CONSTRAINT "AssignedGuard_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
