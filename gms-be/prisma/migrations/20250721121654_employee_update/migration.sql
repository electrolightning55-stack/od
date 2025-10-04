/*
  Warnings:

  - You are about to drop the column `guardCategoryId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `socialSecurityNo` on the `Employee` table. All the data in the column will be lost.
  - Added the required column `cnicExpiryDate` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eobiDate` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kinContactNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "guardCategoryId",
DROP COLUMN "socialSecurityNo",
ADD COLUMN     "cnicExpiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contactNumber" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "eobiDate" TEXT NOT NULL,
ADD COLUMN     "kinContactNumber" TEXT NOT NULL,
ADD COLUMN     "religionSect" TEXT NOT NULL DEFAULT 'N/A';
