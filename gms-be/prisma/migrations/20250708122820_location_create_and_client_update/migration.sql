/*
  Warnings:

  - You are about to drop the column `MSCNumber` on the `Client` table. All the data in the column will be lost.
  - Added the required column `serviceNumber` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Academic" DROP CONSTRAINT "Academic_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Academic" DROP CONSTRAINT "Academic_guardId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_guardId_fkey";

-- DropForeignKey
ALTER TABLE "Biometric" DROP CONSTRAINT "Biometric_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Biometric" DROP CONSTRAINT "Biometric_guardId_fkey";

-- DropForeignKey
ALTER TABLE "DrivingLicense" DROP CONSTRAINT "DrivingLicense_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "DrivingLicense" DROP CONSTRAINT "DrivingLicense_guardId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_guardCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_guardId_fkey";

-- DropForeignKey
ALTER TABLE "Guard" DROP CONSTRAINT "Guard_guardCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Guard" DROP CONSTRAINT "Guard_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Reference" DROP CONSTRAINT "Reference_guardId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "MSCNumber",
ADD COLUMN     "serviceNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "shifts" (
    "id" UUID NOT NULL,
    "shiftName" TEXT NOT NULL,

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "locationName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "provinceState" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "GPScoordinate" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "authorizedPersonName" TEXT NOT NULL,
    "authorizedPersonNumber" TEXT NOT NULL,
    "authorizedPersonDesignation" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requested_guards" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "guardCategoryId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "shiftId" UUID NOT NULL,
    "days" INTEGER NOT NULL,
    "charges" DOUBLE PRECISION NOT NULL,
    "overtime" DOUBLE PRECISION NOT NULL,
    "allowance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "requested_guards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requested_guard_finances" (
    "id" UUID NOT NULL,
    "requestedGuardId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "salaryPerMonth" DOUBLE PRECISION NOT NULL,
    "overtime" DOUBLE PRECISION NOT NULL,
    "allowance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "requested_guard_finances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_guardCategoryId_fkey" FOREIGN KEY ("guardCategoryId") REFERENCES "GuardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guard" ADD CONSTRAINT "Guard_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guard" ADD CONSTRAINT "Guard_guardCategoryId_fkey" FOREIGN KEY ("guardCategoryId") REFERENCES "GuardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingLicense" ADD CONSTRAINT "DrivingLicense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrivingLicense" ADD CONSTRAINT "DrivingLicense_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometric" ADD CONSTRAINT "Biometric_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometric" ADD CONSTRAINT "Biometric_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requested_guards" ADD CONSTRAINT "requested_guards_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requested_guards" ADD CONSTRAINT "requested_guards_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requested_guard_finances" ADD CONSTRAINT "requested_guard_finances_requestedGuardId_fkey" FOREIGN KEY ("requestedGuardId") REFERENCES "requested_guards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requested_guard_finances" ADD CONSTRAINT "requested_guard_finances_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
