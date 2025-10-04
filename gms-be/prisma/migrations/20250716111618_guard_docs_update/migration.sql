/*
  Warnings:

  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Documents" DROP CONSTRAINT "Documents_guardId_fkey";

-- DropTable
DROP TABLE "Documents";

-- CreateTable
CREATE TABLE "EmployeeDocuments" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "picture" TEXT NOT NULL,
    "cnicFront" TEXT NOT NULL,
    "cnicBack" TEXT NOT NULL,
    "licenseFront" TEXT NOT NULL,
    "licenseBack" TEXT NOT NULL,

    CONSTRAINT "EmployeeDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardDocuments" (
    "id" UUID NOT NULL,
    "guardId" UUID,
    "picture" TEXT NOT NULL,
    "cnicFront" TEXT NOT NULL,
    "cnicBack" TEXT NOT NULL,
    "licenseFront" TEXT NOT NULL,
    "licenseBack" TEXT NOT NULL,
    "policeVerification" TEXT,
    "specialBranchVerification" TEXT,
    "dischargeBook" TEXT,
    "NadraVeriSys" TEXT,
    "NadraVeriSysRef1" TEXT,
    "NadraVeriSysRef2" TEXT,
    "healthCertificate" TEXT,
    "medicalDocument" TEXT,
    "DDCDriving" TEXT,
    "educationCertificate" TEXT,
    "APSAATrainingCertificate" TEXT,
    "misc1" TEXT,
    "misc2" TEXT,

    CONSTRAINT "GuardDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeDocuments_employeeId_key" ON "EmployeeDocuments"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "GuardDocuments_guardId_key" ON "GuardDocuments"("guardId");

-- AddForeignKey
ALTER TABLE "EmployeeDocuments" ADD CONSTRAINT "EmployeeDocuments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardDocuments" ADD CONSTRAINT "GuardDocuments_guardId_fkey" FOREIGN KEY ("guardId") REFERENCES "Guard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
