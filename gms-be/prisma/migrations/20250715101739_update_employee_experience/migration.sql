/*
  Warnings:

  - The `totalYears` column on the `EmployeeExperience` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EmployeeExperience" DROP COLUMN "totalYears",
ADD COLUMN     "totalYears" INTEGER;
