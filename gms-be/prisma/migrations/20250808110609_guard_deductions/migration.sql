-- CreateEnum
CREATE TYPE "DeductionType" AS ENUM ('sessiPessiFund', 'eobiFund', 'insurance', 'advances', 'loanRepayment', 'penalty', 'miscCharges');

-- CreateTable
CREATE TABLE "GuardDeductions" (
    "id" UUID NOT NULL,
    "guardId" UUID NOT NULL,
    "deductionType" "DeductionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuardDeductions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuardDeductions" ADD CONSTRAINT "GuardDeductions_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
