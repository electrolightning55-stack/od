/*
  Warnings:

  - You are about to drop the column `locationType` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `requested_guard_finances` table. All the data in the column will be lost.
  - Added the required column `createdLocationId` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationTypeId` to the `locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "requested_guard_finances" DROP CONSTRAINT "requested_guard_finances_locationId_fkey";

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "locationType",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdLocationId" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "locationTypeId" UUID NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "requested_guard_finances" DROP COLUMN "locationId";

-- CreateTable
CREATE TABLE "location_types" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "location_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_locationTypeId_fkey" FOREIGN KEY ("locationTypeId") REFERENCES "location_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
