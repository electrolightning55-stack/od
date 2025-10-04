/*
  Warnings:

  - You are about to drop the column `cnicDocument` on the `Reference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Academic" ALTER COLUMN "lastEducation" DROP NOT NULL,
ALTER COLUMN "institute" DROP NOT NULL,
ALTER COLUMN "hasDrivingLicense" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BankAccount" ALTER COLUMN "bankName" DROP NOT NULL,
ALTER COLUMN "bankCode" DROP NOT NULL,
ALTER COLUMN "accountNumber" DROP NOT NULL,
ALTER COLUMN "IBAN" DROP NOT NULL,
ALTER COLUMN "branchCode" DROP NOT NULL,
ALTER COLUMN "branch" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Biometric" ALTER COLUMN "rightThumb" DROP NOT NULL,
ALTER COLUMN "rightMiddleFinger" DROP NOT NULL,
ALTER COLUMN "rightLittleFinger" DROP NOT NULL,
ALTER COLUMN "leftThumb" DROP NOT NULL,
ALTER COLUMN "leftMiddleFinger" DROP NOT NULL,
ALTER COLUMN "leftLittleFinger" DROP NOT NULL,
ALTER COLUMN "rightForeFinger" DROP NOT NULL,
ALTER COLUMN "rightRingFinger" DROP NOT NULL,
ALTER COLUMN "rightFourFinger" DROP NOT NULL,
ALTER COLUMN "leftFourFinger" DROP NOT NULL,
ALTER COLUMN "leftRingFinger" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "registrationDate" DROP NOT NULL,
ALTER COLUMN "fatherName" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "currentAddress" DROP NOT NULL,
ALTER COLUMN "permanentAddress" DROP NOT NULL,
ALTER COLUMN "religion" DROP NOT NULL,
ALTER COLUMN "bloodGroup" DROP NOT NULL,
ALTER COLUMN "bloodPressure" DROP NOT NULL,
ALTER COLUMN "heartBeat" DROP NOT NULL,
ALTER COLUMN "eyeColor" DROP NOT NULL,
ALTER COLUMN "kinName" DROP NOT NULL,
ALTER COLUMN "kinFatherName" DROP NOT NULL,
ALTER COLUMN "kinCNIC" DROP NOT NULL,
ALTER COLUMN "religionSect" DROP NOT NULL,
ALTER COLUMN "kinRelation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeDocuments" ALTER COLUMN "licenseFront" DROP NOT NULL,
ALTER COLUMN "licenseBack" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Guard" ALTER COLUMN "registrationDate" DROP NOT NULL,
ALTER COLUMN "fatherName" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL,
ALTER COLUMN "currentAddress" DROP NOT NULL,
ALTER COLUMN "permanentAddress" DROP NOT NULL,
ALTER COLUMN "religion" DROP NOT NULL,
ALTER COLUMN "bloodGroup" DROP NOT NULL,
ALTER COLUMN "bloodPressure" DROP NOT NULL,
ALTER COLUMN "heartBeat" DROP NOT NULL,
ALTER COLUMN "eyeColor" DROP NOT NULL,
ALTER COLUMN "kinName" DROP NOT NULL,
ALTER COLUMN "kinFatherName" DROP NOT NULL,
ALTER COLUMN "kinCNIC" DROP NOT NULL,
ALTER COLUMN "religionSect" DROP NOT NULL,
ALTER COLUMN "kinContactNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GuardDocuments" ALTER COLUMN "licenseFront" DROP NOT NULL,
ALTER COLUMN "licenseBack" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "cnicDocument",
ADD COLUMN     "cnicBack" TEXT DEFAULT 'N/A',
ADD COLUMN     "cnicFront" TEXT DEFAULT 'N/A';

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "GPScoordinate" DROP NOT NULL,
ALTER COLUMN "authorizedPersonName" DROP NOT NULL,
ALTER COLUMN "authorizedPersonNumber" DROP NOT NULL,
ALTER COLUMN "authorizedPersonDesignation" DROP NOT NULL;
