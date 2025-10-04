/*
  Warnings:

  - A unique constraint covering the columns `[requestedGuardId]` on the table `requested_guard_finances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "requested_guard_finances_requestedGuardId_key" ON "requested_guard_finances"("requestedGuardId");
