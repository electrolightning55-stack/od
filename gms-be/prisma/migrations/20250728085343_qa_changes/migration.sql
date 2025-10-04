-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "accountTitle" TEXT;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "AlternateContactNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LocationTaxes" ALTER COLUMN "percentage" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reference" ALTER COLUMN "contactNumber" DROP NOT NULL,
ALTER COLUMN "relationship" DROP NOT NULL,
ALTER COLUMN "currentAddress" DROP NOT NULL,
ALTER COLUMN "permanentAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "locationTypeId" DROP NOT NULL;
