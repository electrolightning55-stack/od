/*
  Warnings:

  - You are about to drop the `GuardCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GuardCategory";

-- CreateTable
CREATE TABLE "EmployeeCategory" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "EmployeeCategory_pkey" PRIMARY KEY ("id")
);
