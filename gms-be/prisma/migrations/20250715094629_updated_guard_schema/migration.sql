/*
  Warnings:

  - You are about to drop the column `guardCategoryId` on the `Guard` table. All the data in the column will be lost.
  - You are about to drop the column `kinReligion` on the `Guard` table. All the data in the column will be lost.
  - You are about to drop the column `socialSecurityNo` on the `Guard` table. All the data in the column will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_guardCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_guardId_fkey";

-- DropForeignKey
ALTER TABLE "Guard" DROP CONSTRAINT "Guard_guardCategoryId_fkey";

-- AlterTable
ALTER TABLE "Guard" DROP COLUMN "guardCategoryId",
DROP COLUMN "kinReligion",
DROP COLUMN "socialSecurityNo",
ADD COLUMN     "cnicExpiryDate" TIMESTAMP(3),
ADD COLUMN     "contactNumber" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "currentAreaPoliceContact" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "currentAreaPoliceStation" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "kinRelation" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "permanentAreaPoliceContact" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "permanentAreaPoliceStation" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "religionSect" TEXT NOT NULL DEFAULT 'N/A';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "organizationLogo" TEXT;

-- DropTable
DROP TABLE "Experience";

-- CreateTable
CREATE TABLE "Office" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "province" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardExperience" (
    "id" UUID NOT NULL,
    "guardId" UUID,
    "guardCategoryId" UUID,
    "isExServiceMen" BOOLEAN NOT NULL,
    "exServiceDischargeNumber" TEXT,
    "armyNumber" TEXT,
    "branch" TEXT,
    "serviceYears" INTEGER,
    "serviceMonths" INTEGER,
    "securityYears" INTEGER,
    "place" TEXT,
    "unit" TEXT,
    "recentCivilEmployment" TEXT,

    CONSTRAINT "GuardExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeExperience" (
    "id" UUID NOT NULL,
    "employeeId" UUID,
    "recentCivilEmployment" TEXT,
    "placeOfDuty" TEXT,
    "totalYears" TEXT,

    CONSTRAINT "EmployeeExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardExperience" ADD CONSTRAINT "GuardExperience_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardExperience" ADD CONSTRAINT "GuardExperience_guardCategoryId_fkey" FOREIGN KEY ("guardCategoryId") REFERENCES "GuardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExperience" ADD CONSTRAINT "EmployeeExperience_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
