-- DropForeignKey
ALTER TABLE "requested_guard_finances" DROP CONSTRAINT "requested_guard_finances_requestedGuardId_fkey";

-- CreateTable
CREATE TABLE "Documents" (
    "id" UUID NOT NULL,
    "employeeId" UUID,
    "guardId" UUID,
    "picture" TEXT NOT NULL,
    "cnicFront" TEXT NOT NULL,
    "cnicBack" TEXT NOT NULL,
    "licenseFront" TEXT NOT NULL,
    "licenseBack" TEXT NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Documents_employeeId_key" ON "Documents"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_guardId_key" ON "Documents"("guardId");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requested_guard_finances" ADD CONSTRAINT "requested_guard_finances_requestedGuardId_fkey" FOREIGN KEY ("requestedGuardId") REFERENCES "requested_guards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
