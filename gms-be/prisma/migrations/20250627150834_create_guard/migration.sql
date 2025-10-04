/*
  Warnings:

  - A unique constraint covering the columns `[guardId]` on the table `Academic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guardId]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guardId]` on the table `Biometric` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[guardId]` on the table `DrivingLicense` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Academic" DROP CONSTRAINT "Academic_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Biometric" DROP CONSTRAINT "Biometric_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "DrivingLicense" DROP CONSTRAINT "DrivingLicense_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_employeeId_fkey";

-- AlterTable
ALTER TABLE "Academic" ADD COLUMN     "guardId" UUID,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "guardId" UUID,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Biometric" ADD COLUMN     "guardId" UUID,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DrivingLicense" ADD COLUMN     "guardId" UUID,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "guardId" UUID,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reference" ADD COLUMN     "guardId" UUID,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Guard" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "guardCategoryId" UUID NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "cnicNumber" TEXT NOT NULL,
    "cnicIssueDate" TIMESTAMP(3) NOT NULL,
    "currentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT NOT NULL,
    "socialSecurityNo" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "religion" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "heartBeat" TEXT NOT NULL,
    "eyeColor" TEXT NOT NULL,
    "disability" TEXT,
    "eobiNumber" TEXT,
    "sessiNumber" TEXT,
    "kinName" TEXT NOT NULL,
    "kinFatherName" TEXT NOT NULL,
    "kinReligion" TEXT NOT NULL,
    "kinCNIC" TEXT NOT NULL,

    CONSTRAINT "Guard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Academic_guardId_key" ON "Academic"("guardId");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_guardId_key" ON "BankAccount"("guardId");

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_guardId_key" ON "Biometric"("guardId");

-- CreateIndex
CREATE UNIQUE INDEX "DrivingLicense_guardId_key" ON "DrivingLicense"("guardId");

-- AddForeignKey
ALTER TABLE "Guard" ADD CONSTRAINT "Guard_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guard" ADD CONSTRAINT "Guard_guardCategoryId_fkey" FOREIGN KEY ("guardCategoryId") REFERENCES "GuardCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingLicense" ADD CONSTRAINT "DrivingLicense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingLicense" ADD CONSTRAINT "DrivingLicense_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometric" ADD CONSTRAINT "Biometric_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometric" ADD CONSTRAINT "Biometric_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
