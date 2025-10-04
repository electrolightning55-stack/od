/*
  Warnings:

  - You are about to drop the `EmployeeCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "EmployeeCategory";

-- CreateTable
CREATE TABLE "GuardCategory" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "GuardCategory_pkey" PRIMARY KEY ("id")
);
