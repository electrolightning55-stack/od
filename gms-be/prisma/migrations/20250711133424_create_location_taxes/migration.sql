/*
  Warnings:

  - You are about to drop the column `overtime` on the `requested_guard_finances` table. All the data in the column will be lost.
  - You are about to drop the column `charges` on the `requested_guards` table. All the data in the column will be lost.
  - You are about to drop the column `overtime` on the `requested_guards` table. All the data in the column will be lost.
  - Added the required column `overtimePerHour` to the `requested_guard_finances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chargesPerMonth` to the `requested_guards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overtimePerHour` to the `requested_guards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requested_guard_finances" DROP COLUMN "overtime",
ADD COLUMN     "overtimePerHour" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "requested_guards" DROP COLUMN "charges",
DROP COLUMN "overtime",
ADD COLUMN     "chargesPerMonth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "overtimePerHour" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "LocationTaxes" (
    "id" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "taxType" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "addInvoice" BOOLEAN NOT NULL,

    CONSTRAINT "LocationTaxes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocationTaxes" ADD CONSTRAINT "LocationTaxes_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
