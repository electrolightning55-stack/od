/*
  Warnings:

  - You are about to drop the column `guardCategoryId` on the `GuardExperience` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GuardExperience" DROP CONSTRAINT "GuardExperience_guardCategoryId_fkey";

-- AlterTable
ALTER TABLE "GuardExperience" DROP COLUMN "guardCategoryId",
ADD COLUMN     "rankName" TEXT;

-- CreateTable
CREATE TABLE "AssignedGuard" (
    "id" UUID NOT NULL,
    "guardId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "requestedGuardId" UUID NOT NULL,
    "deploymentDate" TIMESTAMP(3) NOT NULL,
    "deploymentTill" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignedGuard_pkey" PRIMARY KEY ("id")
);
