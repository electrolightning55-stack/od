-- CreateTable
CREATE TABLE "GuardAllowances" (
    "id" UUID NOT NULL,
    "guardId" UUID NOT NULL,
    "assignedGuardId" UUID NOT NULL,
    "allowancePercentage" DOUBLE PRECISION NOT NULL,
    "holidayCount" INTEGER NOT NULL,
    "overTimeCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardAllowances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuardAllowances" ADD CONSTRAINT "GuardAllowances_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardAllowances" ADD CONSTRAINT "GuardAllowances_assignedGuardId_fkey" FOREIGN KEY ("assignedGuardId") REFERENCES "AssignedGuard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
